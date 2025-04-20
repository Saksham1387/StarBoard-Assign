import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LeaseData } from "@/types/leaseData";
import {
  calculateRemainingTerm,
  extractJsonFromGeminiResponse,
} from "@/lib/helper";
import { prompt } from "@/lib/prompt";

// This is the API key for the Gemini model
// But it does not support the Signed URL feature, to use this one you have to send the PDF in form Data
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const parsePDFWithGemini = async (buffer: Buffer): Promise<LeaseData> => {
  try {
    const base64PDF = buffer.toString("base64");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64PDF,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    const parsedString = extractJsonFromGeminiResponse(text);

    const leaseData = JSON.parse(parsedString);

    if (leaseData.lease.expiryDate !== "N/A") {
      leaseData.lease.remainingTerm = calculateRemainingTerm(
        leaseData.lease.expiryDate
      );
    }

    return leaseData;
  } catch (error) {
    console.error("Error parsing PDF with Gemini:", error);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const leaseData = await parsePDFWithGemini(buffer);

    return NextResponse.json(leaseData);
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
