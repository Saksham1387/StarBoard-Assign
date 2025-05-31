import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { writeFile } from "fs/promises";
import { join, basename } from "path";
import { tmpdir } from "os";
import fs from "fs";
import { openApiPrompt } from "@/lib/prompt";
import crypto from "crypto";
import axios from "axios";
import { parse } from 'csv-parse/sync';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory cache to store parsed PDF results
const pdfCache = new Map<string, { leaseData: any; tenantData: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const downloadFile = async (url: string, fileType: string): Promise<string> => {
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  if (!response.data) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const buffer = Buffer.from(response.data);
  const tempDir = tmpdir();
  const tempFilePath = join(tempDir, `temp-${Date.now()}.${fileType}`);
  
  await writeFile(tempFilePath, buffer);
  return tempFilePath;
};

const parseCSV = async (filePath: string) => {
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
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

const parsePDFWithOpenAI = async (filePath: string, csvData: any[] = []) => {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    const base64String = fileBuffer.toString('base64');

    // Modify prompt to include CSV data if available
    let enhancedPrompt = openApiPrompt;
    if (csvData.length > 0) {
      enhancedPrompt += "\n\nAdditional data from CSV files:\n" + JSON.stringify(csvData, null, 2);
    }

    const aiResponse = await client.responses.create({
      model: "chatgpt-4o-latest",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: basename(filePath),
              file_data: `data:application/pdf;base64,${base64String}`,
            },
            {
              type: "input_text",
              text: enhancedPrompt,
            },
          ],
        },
      ],
    });

    console.log("OpenAI response:", aiResponse.output_text);

    const output_text = aiResponse.output_text;
    
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    const jsonMatches = [];
    let match;

    while ((match = jsonRegex.exec(output_text)) !== null) {
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
    console.error("Error parsing PDF with OpenAI:", error);
    throw error;
  } finally {
    // Clean up the temporary file
    try {
      await fs.promises.unlink(filePath);
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
          await fs.promises.unlink(tempFilePath);
        } catch (error) {
          console.error("Error deleting temporary CSV file:", error);
        }
        return data;
      });
      
      csvData = await Promise.all(csvPromises);
    }

    const tempFilePath = await downloadFile(pdfUrl, 'pdf');
    const { leaseData, tenantData } = await parsePDFWithOpenAI(tempFilePath, csvData);

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
