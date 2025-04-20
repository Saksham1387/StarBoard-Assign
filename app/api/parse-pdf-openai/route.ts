import { NextResponse } from "next/server";
import OpenAI from "openai";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import fs from "fs";
import { openApiPrompt } from "@/lib/prompt";
import crypto from "crypto";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to generate cache key from file content
function generateCacheKey(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

// Helper function to check if cache entry is valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    // Generate cache key from file content
    const cacheKey = generateCacheKey(buffer);

    // Check cache
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && isCacheValid(cachedResult.timestamp)) {
      // Clean up the temporary file
      try {
        await fs.promises.unlink(tempFilePath);
      } catch (error) {
        console.error("Error cleaning up temporary file:", error);
      }
      return NextResponse.json(cachedResult.data);
    }

    // Read the file and convert to base64
    const data = Buffer.from(bytes);
    const base64String = data.toString("base64");

    // Process with OpenAI
    const response = await client.responses.create({
      model: "chatgpt-4o-latest",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: file.name,
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

    console.log("OpenAI response:", response.output_text);

    const output_text = response.output_text;

    // Extract JSON objects from the text - looking for content between ```json and ```
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

    // Check if we found the expected number of JSON objects
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

    // Extract the two specific JSONs we want
    const dealData = jsonMatches[0]; // First JSON object - Deal information
    const tenantData = jsonMatches[1]; // Second JSON object - Tenant information

    // If we couldn't parse two separate JSONs, return an error
    return NextResponse.json({
      success: true,
      data: {
        dealData,
        tenantData,
      },
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
