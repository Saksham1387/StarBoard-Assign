// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { prompt } from "@/lib/prompt";
// import * as fs from 'fs';
// import * as path from 'path';
// import * as os from 'os';
// import fetch from 'node-fetch';
// import { parse } from 'csv-parse/sync';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// // In-memory cache to store parsed PDF results
// const pdfCache = new Map<string, { leaseData: any; tenantData: any; timestamp: number }>();
// const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// const downloadFile = async (url: string, fileType: string): Promise<string> => {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(`Failed to download file: ${response.statusText}`);
//   }

//   const buffer = await response.buffer();
//   const tempDir = os.tmpdir();
//   const tempFilePath = path.join(tempDir, `temp-${Date.now()}.${fileType}`);
  
//   fs.writeFileSync(tempFilePath, buffer);
//   return tempFilePath;
// };

// const parseCSV = async (filePath: string) => {
//   try {
//     const fileContent = fs.readFileSync(filePath, 'utf-8');
//     const records = parse(fileContent, {
//       columns: true,
//       skip_empty_lines: true
//     });
//     return records;
//   } catch (error) {
//     console.error("Error parsing CSV:", error);
//     throw error;
//   }
// };

// const parsePDFWithGemini = async (filePath: string, csvData: any[] = []) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
//     const fileBuffer = fs.readFileSync(filePath);

//     // Modify prompt to include CSV data if available
//     let enhancedPrompt = prompt;
//     if (csvData.length > 0) {
//       enhancedPrompt += "\n\nAdditional data from CSV files:\n" + JSON.stringify(csvData, null, 2);
//     }

//     const result = await model.generateContent([
//       enhancedPrompt,
//       {
//         inlineData: {
//           mimeType: "application/pdf",
//           data: fileBuffer.toString('base64'),
//         },
//       },
//     ]);

//     const response = await result.response;
//     const text = response.text();

//     console.log(text) 
    
//     const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
//     const jsonMatches = [];
//     let match;

//     while ((match = jsonRegex.exec(text)) !== null) {
//       try {
//         const jsonText = match[1].trim();
//         const parsedJson = JSON.parse(jsonText);
//         jsonMatches.push(parsedJson);
//       } catch (parseError) {
//         console.error("Error parsing JSON:", parseError);
//       }
//     }

//     if (jsonMatches.length === 0) {
//       const json = JSON.parse(text);
//       const leaseData = json;
//       const tenantData = json.tenantDetails;
//       return { leaseData, tenantData };
//     }

//     const leaseData = jsonMatches[0];
//     const tenantData = leaseData.tenantDetails;

//     return { leaseData, tenantData };
//   } catch (error) {
//     console.error("Error parsing PDF with Gemini:", error);
//     throw error;
//   } finally {
//     // Clean up the temporary file
//     try {
//       fs.unlinkSync(filePath);
//     } catch (error) {
//       console.error("Error deleting temporary file:", error);
//     }
//   }
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { pdfUrl, csvUrls } = await req.json();

//     if (!pdfUrl) {
//       return NextResponse.json(
//         { error: "No PDF URL provided" },
//         { status: 400 }
//       );
//     }

//     // Check cache first
//     const cachedResult = pdfCache.get(pdfUrl);
//     const now = Date.now();
    
//     if (cachedResult && (now - cachedResult.timestamp) < CACHE_TTL) {
//       console.log("Returning cached result for:", pdfUrl);
//       return NextResponse.json({
//         success: true,
//         data: {
//           leaseData: cachedResult.leaseData,
//           tenantData: cachedResult.tenantData,
//         },
//         fromCache: true
//       });
//     }

//     // Download and parse CSV files if they exist
//     let csvData = [];
//     if (csvUrls && csvUrls.length > 0) {
//       const csvPromises = csvUrls.map(async (url: string) => {
//         const tempFilePath = await downloadFile(url, 'csv');
//         const data = await parseCSV(tempFilePath);
//         try {
//           fs.unlinkSync(tempFilePath);
//         } catch (error) {
//           console.error("Error deleting temporary CSV file:", error);
//         }
//         return data;
//       });
      
//       csvData = await Promise.all(csvPromises);
//     }

//     const tempFilePath = await downloadFile(pdfUrl, 'pdf');
//     const { leaseData, tenantData } = await parsePDFWithGemini(tempFilePath, csvData);

//     // Store in cache
//     pdfCache.set(pdfUrl, {
//       leaseData,
//       tenantData,
//       timestamp: now
//     });

//     const result = {
//       success: true,
//       data: {
//         leaseData,
//         tenantData,
//       },
//       fromCache: false
//     };

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Error processing files:", error);
//     return NextResponse.json(
//       { error: "Failed to process files" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "@/lib/prompt";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// In-memory cache to store parsed PDF results
const pdfCache = new Map<string, { leaseData: any; tenantData: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const downloadFile = async (url: string, fileType: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `temp-${Date.now()}.${fileType}`);
  
  fs.writeFileSync(tempFilePath, buffer);
  return tempFilePath;
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
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    return records;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw error;
  }
};

const parsePDFWithGemini = async (filePath: string, csvDataWithFilenames: Array<{filename: string, data: any[]}> = [], pdfFilename: string = 'document.pdf') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    const fileBuffer = fs.readFileSync(filePath);

    // Enhanced prompt with filename information
    let enhancedPrompt = prompt;
    
    if (csvDataWithFilenames.length > 0) {
      enhancedPrompt += "\n\n=== CSV FILES WITH FILENAMES ===\n";
      csvDataWithFilenames.forEach(({filename, data}) => {
        enhancedPrompt += `\nFILE: ${filename}\n`;
        enhancedPrompt += `DATA: ${JSON.stringify(data, null, 2)}\n`;
        enhancedPrompt += "---\n";
      });
      
      enhancedPrompt += "\nIMPORTANT: When referencing CSV data in your response, use the EXACT filename shown above (e.g., 'CSV: " + csvDataWithFilenames[0].filename + " - Column: Value')\n";
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
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error deleting temporary file:", error);
    }
  }
};

export async function POST(req: NextRequest) {
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

    // Download and parse CSV files with cleaned filename information
    let csvDataWithFilenames = [];
    if (csvUrls && csvUrls.length > 0) {
      const csvPromises = csvUrls.map(async (url: string, index: number) => {
        const tempFilePath = await downloadFile(url, 'csv');
        const data = await parseCSV(tempFilePath);
        
        // Get clean filename from multiple sources in order of preference
        let filename = 'unknown-file.csv';
        if (csvFilenames && csvFilenames[index]) {
          filename = cleanFilename(csvFilenames[index]);
        } else {
          filename = getCleanFilenameFromUrl(url);
        }
        
        try {
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.error("Error deleting temporary CSV file:", error);
        }
        
        return { filename, data };
      });
      
      csvDataWithFilenames = await Promise.all(csvPromises);
    }

    // Get clean PDF filename
    let pdfFilenameToUse = 'document.pdf';
    if (pdfFilename) {
      pdfFilenameToUse = cleanFilename(pdfFilename);
    } else {
      pdfFilenameToUse = getCleanFilenameFromUrl(pdfUrl);
    }

    const tempFilePath = await downloadFile(pdfUrl, 'pdf');
    const { leaseData, tenantData } = await parsePDFWithGemini(tempFilePath, csvDataWithFilenames, pdfFilenameToUse);

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
      { error: "Failed to process files" },
      { status: 500 }
    );
  }
}