import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "@/lib/prompt";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import fetch from 'node-fetch';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// In-memory cache to store parsed PDF results
const pdfCache = new Map<string, { leaseData: any; tenantData: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const downloadPDF = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `temp-${Date.now()}.pdf`);
  
  fs.writeFileSync(tempFilePath, buffer);
  return tempFilePath;
};

const parsePDFWithGemini = async (filePath: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    const fileBuffer = fs.readFileSync(filePath);

    const result = await model.generateContent([
      prompt,
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

    // console.log("JSON Matches:", jsonMatches);


    const leaseData = jsonMatches[0];
    const tenantData = leaseData.tenantDetails;


    // console.log("Lease Data:", leaseData);
    // console.log("Tenant Data:", tenantData);

    // if (leaseData.lease.expiryDate !== "N/A") {
    //   leaseData.lease.remainingTerm = calculateRemainingTerm(
    //     leaseData.lease.expiryDate
    //   );
    // }

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
    const { pdfUrl } = await req.json();

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

    const tempFilePath = await downloadPDF(pdfUrl);
    const { leaseData, tenantData } = await parsePDFWithGemini(tempFilePath);

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
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
