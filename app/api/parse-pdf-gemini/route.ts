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

const parsePDFWithGemini = async (filePath: string, csvData: any[] = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    const fileBuffer = fs.readFileSync(filePath);

    // Modify prompt to include CSV data if available
    let enhancedPrompt = prompt;
    if (csvData.length > 0) {
      enhancedPrompt += "\n\nAdditional data from CSV files:\n" + JSON.stringify(csvData, null, 2);
    }

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

    console.log(text) 
    
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
      throw new Error("No valid JSON objects found in the response");
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
    const { pdfUrl, csvUrls } = await req.json();

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

    // Download and parse CSV files if they exist
    let csvData = [];
    if (csvUrls && csvUrls.length > 0) {
      const csvPromises = csvUrls.map(async (url: string) => {
        const tempFilePath = await downloadFile(url, 'csv');
        const data = await parseCSV(tempFilePath);
        try {
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.error("Error deleting temporary CSV file:", error);
        }
        return data;
      });
      
      csvData = await Promise.all(csvPromises);
    }

    const tempFilePath = await downloadFile(pdfUrl, 'pdf');
    const { leaseData, tenantData } = await parsePDFWithGemini(tempFilePath, csvData);

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
