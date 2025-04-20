import { NextResponse } from "next/server";
import OpenAI from "openai";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import fs from "fs";
import { openApiPrompt } from "@/lib/prompt";
import crypto from "crypto";
import axios from "axios";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

function generateCacheKey(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pdfUrl } = body;

    if (!pdfUrl) {
      return NextResponse.json(
        { error: "No PDF URL provided" },
        { status: 400 }
      );
    }

    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    const tempFileName = `temp-${Date.now()}.pdf`;
    const tempFilePath = join(tmpdir(), tempFileName);
    await writeFile(tempFilePath, buffer);

    const cacheKey = generateCacheKey(buffer);

    const cachedResult = cache.get(cacheKey);
    if (cachedResult && isCacheValid(cachedResult.timestamp)) {
      try {
        await fs.promises.unlink(tempFilePath);
      } catch (error) {
        console.error("Error cleaning up temporary file:", error);
      }
      return NextResponse.json(cachedResult.data);
    }

    const base64String = buffer.toString("base64");

    const aiResponse = await client.responses.create({
      model: "chatgpt-4o-latest",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: tempFileName,
              file_data: `data:application/pdf;base64,${base64String}`,
            },
            {
              type: "input_text",
              text: openApiPrompt,
            },
          ],
        },
      ],
    });

    console.log("OpenAI response:", aiResponse.output_text);

    const output_text = aiResponse.output_text;

    try {
      await fs.promises.unlink(tempFilePath);
    } catch (error) {
      console.error("Error cleaning up temporary file:", error);
    }

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

    if (jsonMatches.length < 2) {
      return NextResponse.json(
        {
          error: "Could not find two valid JSON objects",
          found: jsonMatches.length,
          jsonMatches,
        },
        { status: 422 }
      );
    }

    const dealData = jsonMatches[0];
    const tenantData = jsonMatches[1];

    const result = {
      success: true,
      data: {
        dealData,
        tenantData,
      },
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
