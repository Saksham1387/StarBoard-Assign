import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "@/lib/prompt";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// In-memory cache to store parsed PDF results
const pdfCache = new Map<string, { leaseData: any; tenantData: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const downloadFile = async (url: string, fileType: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileType}`);
    
    // Write file synchronously to ensure it's completely written
    fs.writeFileSync(tempFilePath, buffer);
    
    // Verify the file exists and is readable
    await fs.promises.access(tempFilePath, fs.constants.R_OK);
    
    // Add a small delay to ensure file system has processed the write
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return tempFilePath;
  } catch (error) {
    console.error("Error in downloadFile:", error);
    throw error;
  }
};

// Extract clean filename from URL by removing UUID prefix
const getCleanFilenameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    let filename = pathname.split('/').pop() || 'unknown-file';
    filename = decodeURIComponent(filename);
    
    // Remove UUID prefix pattern (UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-)
    // This regex matches UUID pattern followed by a dash at the beginning of filename
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i;
    const cleanFilename = filename.replace(uuidPattern, '');
    
    return cleanFilename || filename; // fallback to original if cleaning fails
  } catch (error) {
    console.error("Error extracting filename from URL:", error);
    return 'unknown-file';
  }
};

// Alternative function to clean filename if it's already extracted
const cleanFilename = (filename: string): string => {
  // Remove UUID prefix pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i;
  const cleanName = filename.replace(uuidPattern, '');
  return cleanName || filename; // fallback to original if cleaning fails
};

const parseCSV = async (filePath: string) => {
  try {
    // Verify file exists before reading
    await fs.promises.access(filePath, fs.constants.R_OK);
    
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relaxColumnCount: true
    });
    return records;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw error;
  }
};

interface SheetData {
  sheetName: string;
  data: any[];
}

type FileData = any[] | SheetData[];

interface FileWithData {
  filename: string;
  data: FileData;
}

const parseXLSX = async (filePath: string): Promise<SheetData[]> => {
  try {
    // Verify file exists and is accessible
    await fs.promises.access(filePath, fs.constants.R_OK);
    
    // Check file stats to ensure it has content
    const stats = await fs.promises.stat(filePath);
    if (stats.size === 0) {
      throw new Error("XLSX file is empty");
    }
    
    console.log(`Reading XLSX file: ${filePath}, size: ${stats.size} bytes`);
    
    // Add a small delay before reading
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Read the file into buffer first
    const buffer = await fs.promises.readFile(filePath);
    
    // Use XLSX.read with buffer instead of readFile
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    const sheets = workbook.SheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const records = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false
      });
      
      // Convert to object format if we have data
      if (records.length > 0) {
        const headers = records[0] as string[];
        const dataRows = records.slice(1) as any[][];
        const objectData = dataRows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        return {
          sheetName,
          data: objectData
        };
      }
      
      return {
        sheetName,
        data: []
      };
    });
    
    return sheets;
  } catch (error) {
    console.error("Error parsing XLSX:", error);
    console.error("File path:", filePath);
    throw error;
  }
};

const parseFile = async (filePath: string, fileType: string): Promise<any[] | SheetData[]> => {
  console.log(`Parsing file: ${filePath}, type: ${fileType}`);
  
  switch (fileType.toLowerCase()) {
    case 'csv':
      return await parseCSV(filePath);
    case 'xlsx':
      return await parseXLSX(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};

const cleanupFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up temporary file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting temporary file ${filePath}:`, error);
  }
};

const parsePDFWithGemini = async (filePath: string, csvDataWithFilenames: FileWithData[] = [], pdfFilename: string = 'document.pdf') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    const fileBuffer = fs.readFileSync(filePath);

    // Enhanced prompt with filename information
    let enhancedPrompt = prompt;
    
    if (csvDataWithFilenames.length > 0) {
      enhancedPrompt += "\n\n=== XLSX FILES WITH FILENAMES ===\n";
      csvDataWithFilenames.forEach(({filename, data}) => {
        // Only include XLSX files
        if (filename.toLowerCase().endsWith('.xlsx')) {
          enhancedPrompt += `\nFILE: ${filename}\n`;
          // Handle XLSX sheet data
          (data as SheetData[]).forEach(sheet => {
            enhancedPrompt += `SHEET: ${sheet.sheetName}\n`;
            enhancedPrompt += `DATA: ${JSON.stringify(sheet.data, null, 2)}\n`;
          });
          enhancedPrompt += "---\n";
        }
      });
      
      enhancedPrompt += "\nIMPORTANT: When referencing data in your response, use the EXACT filename and sheet name shown above (e.g., 'File: filename.xlsx - Sheet: Sheet1 - Column: Value')\n";
    }
    
    enhancedPrompt += `\n\n=== PDF FILE ===\nFILE: ${pdfFilename}\n`;
    enhancedPrompt += "IMPORTANT: When referencing PDF data, use the exact filename shown above.\n";

    const result = await model.generateContent([
      enhancedPrompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: fileBuffer.toString('base64'),
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // For Debug only
    // console.log(text) 
    
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    const jsonMatches = [];
    let match;

    while ((match = jsonRegex.exec(text)) !== null) {
      try {
        const jsonText = match[1].trim();
        const parsedJson = JSON.parse(jsonText);
        jsonMatches.push(parsedJson);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
      }
    }

    if (jsonMatches.length === 0) {
      const json = JSON.parse(text);
      const leaseData = json;
      const tenantData = json.tenantDetails;
      return { leaseData, tenantData };
    }

    const leaseData = jsonMatches[0];
    const tenantData = leaseData.tenantDetails;

    return { leaseData, tenantData };
  } catch (error) {
    console.error("Error parsing PDF with Gemini:", error);
    throw error;
  } finally {
    // Clean up the temporary file
    cleanupFile(filePath);
  }
};

export async function POST(req: NextRequest) {
  const tempFiles: string[] = [];
  
  try {
    const { pdfUrl, csvUrls, pdfFilename, csvFilenames } = await req.json();

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "No PDF URL provided" },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedResult = pdfCache.get(pdfUrl);
    const now = Date.now();
    
    if (cachedResult && (now - cachedResult.timestamp) < CACHE_TTL) {
      console.log("Returning cached result for:", pdfUrl);
      return NextResponse.json({
        success: true,
        data: {
          leaseData: cachedResult.leaseData,
          tenantData: cachedResult.tenantData,
        },
        fromCache: true
      });
    }

    // Download and parse CSV/XLSX files with cleaned filename information
    let csvDataWithFilenames = [];
    if (csvUrls && csvUrls.length > 0) {
      console.log(`Processing ${csvUrls.length} CSV/XLSX files`);
      
      for (let i = 0; i < csvUrls.length; i++) {
        const url = csvUrls[i];
        let tempFilePath = '';
        
        try {
          const fileType = url.toLowerCase().endsWith('.xlsx') ? 'xlsx' : 'csv';
          console.log(`Processing file ${i + 1}/${csvUrls.length}: ${url} (${fileType})`);
          
          tempFilePath = await downloadFile(url, fileType);
          tempFiles.push(tempFilePath);
          
          const data = await parseFile(tempFilePath, fileType);
          
          // Get clean filename from multiple sources in order of preference
          let filename = `unknown-file.${fileType}`;
          if (csvFilenames && csvFilenames[i]) {
            filename = cleanFilename(csvFilenames[i]);
          } else {
            filename = getCleanFilenameFromUrl(url);
          }
          
          csvDataWithFilenames.push({ filename, data });
          console.log(`Successfully processed: ${filename}`);
          
        } catch (error) {
          console.error(`Error processing file ${i + 1} (${url}):`, error);
          // Clean up this specific file if it was created
          if (tempFilePath) {
            cleanupFile(tempFilePath);
          }
          // Continue with other files instead of failing completely
          continue;
        }
      }
    }

    // Get clean PDF filename
    let pdfFilenameToUse = 'document.pdf';
    if (pdfFilename) {
      pdfFilenameToUse = cleanFilename(pdfFilename);
    } else {
      pdfFilenameToUse = getCleanFilenameFromUrl(pdfUrl);
    }

    console.log(`Processing PDF: ${pdfFilenameToUse}`);
    const pdfTempFilePath = await downloadFile(pdfUrl, 'pdf');
    tempFiles.push(pdfTempFilePath);
    
    const { leaseData, tenantData } = await parsePDFWithGemini(pdfTempFilePath, csvDataWithFilenames, pdfFilenameToUse);

    // Store in cache
    pdfCache.set(pdfUrl, {
      leaseData,
      tenantData,
      timestamp: now
    });

    const result = {
      success: true,
      data: {
        leaseData,
        tenantData,
      },
      fromCache: false
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing files:", error);
    return NextResponse.json(
      { error: "Failed to process files", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    // Clean up all temporary files
    tempFiles.forEach(cleanupFile);
  }
}