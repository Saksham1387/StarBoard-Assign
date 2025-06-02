export const prompt = `
<SYSTEM_CONSTRAINTS>
   CRITICAL: You will receive a PDF offering memorandum (OM) and multiple CSV files containing property data.
   CRITICAL: Return EXACTLY ONE complete JSON object following the schema below.
   CRITICAL: Extract information from ALL provided files systematically - PDF and CSVs.
   CRITICAL: Use "N/A" for any field where information is not found in ANY of the provided files.
   CRITICAL: Do NOT omit any fields from the schema - all fields must be present.
   CRITICAL: Return ONLY the JSON object - no additional text, explanations, or markdown formatting.
   CRITICAL: For PDF sources, include the EXACT text snippet AS IT APPEARS in the PDF, preserving all spacing, line breaks, and formatting.
   CRITICAL: For CSV sources, reference the EXACT file name as provided and relevant data point.
   CRITICAL: Page numbers must be integers only (e.g., 5, not "page 5" or "5-6").
   CRITICAL: File names must be EXACTLY as uploaded - preserve all characters, extensions, spaces, and special characters.
   CRITICAL: NEVER use generic names like "CSV File 1", "File 1", "Document 1" - ALWAYS use the actual uploaded filename.
</SYSTEM_CONSTRAINTS>

<EXTRACTION_PROCESS>
1. First, thoroughly read through the entire PDF document from beginning to end
2. Then, analyze all CSV files to understand their structure and data
3. For each field in the schema:
   a. Search the PDF first for relevant information
   b. If not found in PDF, check the CSV files
   c. Extract PDF text EXACTLY as it appears (preserve all spacing and formatting)
   d. Record the source location and exact text/data used
4. Cross-reference information between files to ensure accuracy
5. Always prioritize the most recent or authoritative source when conflicts exist
6. Return the complete JSON object with ALL fields populated
</EXTRACTION_PROCESS>

<SOURCE_DOCUMENTATION_RULES>
For PDF sources:
- "page_no": Must be a single integer representing the page where information was found
- "text_in_the_pdf": Must be the EXACT text snippet from the PDF AS IT APPEARS, preserving all original spacing, line breaks, character spacing, and formatting. Do NOT normalize, clean up, or reformat the text.

For CSV sources:
- "page_no": Use "CSV" 
- "text_in_the_pdf": Use format "CSV: [ACTUAL UPLOADED FILENAME] - [column]: [value]"
- The file name must be the REAL, ACTUAL filename that was uploaded, NOT a generic placeholder
- NEVER use "CSV File 1", "File 1", "Document 1", or any generic names
- The file name must be EXACTLY as provided when the file was uploaded, including:
  - All spaces, underscores, hyphens, and special characters
  - File extension (.csv, .xlsx, etc.)
  - Parentheses, numbers, and any other characters
  - Case sensitivity (uppercase/lowercase exactly as uploaded)
- Examples with REAL filenames: 
  - "CSV: Q3_2024_Property_Data.csv - Annual Rent: $125,000"
  - "CSV: Brooklyn_Industrial_Analysis (Final).xlsx - Cap Rate: 5.5%"
  - "CSV: tenant-lease-schedule_v2.csv - Population Growth: 2.3%"

CRITICAL CSV FILENAME RULES:
- You MUST identify and use the actual filename of each uploaded CSV/Excel file
- NEVER substitute with generic names like "CSV File 1" or similar placeholders  
- The filename should be exactly what appears when the file is uploaded to the system
- If you cannot determine the exact filename, state "CSV: [Unknown filename]" rather than using a generic placeholder
- Always cross-check that you're using the real uploaded filename, not a system-generated or generic name

CRITICAL PDF TEXT EXTRACTION RULES:
- Extract text EXACTLY as displayed in the PDF viewer
- Preserve unusual spacing (e.g., "B R O O K LY N" not "BROOKLYN")
- Keep original line breaks and character positioning
- Do not normalize, standardize, or clean up the text
- The extracted text must match character-for-character what appears in the PDF

CRITICAL FILE NAME RULES:
- NEVER modify, shorten, or normalize file names
- Use the COMPLETE file name exactly as it appears when uploaded
- Include ALL characters: spaces, special symbols, numbers, extensions
- Maintain exact capitalization
- Do NOT remove or change parentheses, underscores, hyphens, or other characters
- REJECT any impulse to use "CSV File 1", "File 1", "Document 1" - these are WRONG
</SOURCE_DOCUMENTATION_RULES>

<DATA_VALIDATION_RULES>
1. Numbers: Extract as strings but ensure they represent valid numbers (e.g., "5.5", "1,200,000")
2. Dates: Use YYYY-MM-DD format when possible, otherwise exact text from source
3. Percentages: Include the % symbol when present in source (e.g., "5.5%")
4. Currency: Include currency symbols when present (e.g., "$25.00")
5. Ranges: Use exact format from source (e.g., "5-7 years", "$20-25 PSF")
6. Text fields: Preserve exact capitalization and spacing from source
7. File names: Use EXACTLY as uploaded without any modifications - NO GENERIC NAMES
</DATA_VALIDATION_RULES>

<CONSISTENCY_REQUIREMENTS>
1. If the same information appears in multiple sources, use the most detailed/recent version
2. Ensure all related fields are consistent (e.g., if annual rent is $100,000 and PSF is $20, property size should be 5,000 SF)
3. Cross-validate tenant information across all sources
4. Verify that financial metrics align with provided assumptions
5. Check that dates are logically consistent (lease start < lease end, etc.)
6. Ensure file names are consistently referenced exactly as uploaded across all fields
7. VERIFY that no generic filenames like "CSV File 1" are being used anywhere
</CONSISTENCY_REQUIREMENTS>

<JSON_SCHEMA>
You must return EXACTLY this JSON structure with ALL fields present:

{
  "dealOverview": {
    "source": {
      "page_no": "N/A or integer or 'CSV'",
      "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
    },
    "propertyName": "N/A or extracted value",
    "location": "N/A or extracted value",
    "dateUploaded": "N/A or extracted value",
    "propertyType": "N/A or extracted value",
    "seller": "N/A or extracted value",
    "guidancePrice": "N/A or extracted value",
    "guidancePricePSF": "N/A or extracted value",
    "capRate": "N/A or extracted value",
    "propertySize": "N/A or extracted value",
    "landArea": "N/A or extracted value",
    "zoning": "N/A or extracted value",
    "underwritingModel": "N/A or extracted value"
  },
  "dealSummary": {
    "text": "N/A or extracted summary text",
    "source": {
      "page_no": "N/A or integer or 'CSV'",
      "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
    }
  },
  "personalizedInsights": ["N/A or array of extracted insights"],
  "assetLevelData": {
    "source": {
      "page_no": "N/A or integer or 'CSV'",
      "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
    },
    "tenant": "N/A or extracted value",
    "clearHeights": "N/A or extracted value",
    "columnSpacing": "N/A or extracted value",
    "parkingSpaces": "N/A or extracted value",
    "dockDoors": "N/A or extracted value",
    "seawardArea": "N/A or extracted value",
    "yearBuilt": "N/A or extracted value",
    "occupancyRate": "N/A or extracted value"
  },
  "keyAssumptions": {
    "source": {
      "page_no": "N/A or integer or 'CSV'",
      "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
    },
    "exitPrice": "N/A or extracted value",
    "exitCapRate": "N/A or extracted value",
    "rentalGrowth": "N/A or extracted value",
    "holdPeriod": "N/A or extracted value"
  },
  "marketAnalysis": {
    "source": {
      "page_no": "N/A or integer or 'CSV'",
      "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
    },
    "nearestUrbanCenter": "N/A or extracted value",
    "populationGrowthRate": "N/A or extracted value",
    "medianHouseholdIncome": "N/A or extracted value",
    "unemploymentRate": "N/A or extracted value"
  },
  "leaseAnalysis": {
    "source": {
      "page_no": "N/A or integer or 'CSV'",
      "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
    },
    "rentPSF": "N/A or extracted value",
    "WALT": "N/A or extracted value",
    "rentEscalations": "N/A or extracted value",
    "markToMarketOpportunity": "N/A or extracted value"
  },
  "tenantDetails": {
    "tenant": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "name": "N/A or extracted value",
      "logo": "/placeholder.svg?height=40&width=40",
      "industry": "N/A or extracted value",
      "creditRating": "N/A or extracted value"
    },
    "lease": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "startDate": "N/A or YYYY-MM-DD format",
      "expiryDate": "N/A or YYYY-MM-DD format",
      "term": "N/A or extracted value",
      "remainingTerm": "N/A or extracted value"
    },
    "rent": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "baseRentPSF": "N/A or extracted value",
      "annualBaseRent": "N/A or extracted value",
      "monthlyBaseRent": "N/A or extracted value",
      "effectiveRentPSF": "N/A or extracted value"
    },
    "escalations": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "structure": "N/A or extracted value",
      "rate": "N/A or extracted value",
      "nextEscalation": "N/A or extracted value"
    },
    "renewalOptions": [
      {
        "source": {
          "page_no": "N/A or integer or 'CSV'",
          "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
        },
        "term": "N/A or extracted value",
        "notice": "N/A or extracted value",
        "rentStructure": "N/A or extracted value"
      }
    ],
    "recoveries": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "operatingExpenses": "N/A or extracted value",
      "cam": "N/A or extracted value",
      "insurance": "N/A or extracted value",
      "taxes": "N/A or extracted value",
      "utilities": "N/A or extracted value"
    },
    "security": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "deposit": "N/A or extracted value",
      "equivalent": "N/A or extracted value",
      "letterOfCredit": "N/A or extracted value"
    },
    "otherTerms": [
      {
        "source": {
          "page_no": "N/A or integer or 'CSV'",
          "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
        },
        "title": "N/A or extracted value",
        "description": "N/A or extracted value"
      }
    ],
    "rentSchedule": [
      {
        "source": {
          "page_no": "N/A or integer or 'CSV'",
          "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
        },
        "year": "N/A or integer",
        "rentPSF": "N/A or number",
        "annualRent": "N/A or number"
      }
    ],
    "marketComparison": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "subjectProperty": { 
        "name": "N/A or extracted value", 
        "rentPSF": "N/A or number"
      },
      "marketComps": [
        { 
          "name": "N/A or extracted value", 
          "rentPSF": "N/A or number"
        }
      ]
    },
    "recoveryBreakdown": {
      "source": {
        "page_no": "N/A or integer or 'CSV'",
        "text_in_the_pdf": "N/A or exact extracted text or CSV reference with ACTUAL UPLOADED FILENAME"
      },
      "cam": "N/A or number",
      "taxes": "N/A or number",
      "insurance": "N/A or number"
    }
  }
}
</JSON_SCHEMA>

<CRITICAL_RULES>
1. Return ONLY the JSON object above - no additional text, explanations, or markdown
2. ALL fields must be present in your response - never omit any field
3. Use "N/A" for missing information - do not use null, undefined, or empty strings
4. Maintain exact field names and structure as shown in the schema
5. Process ALL provided files (PDF and CSVs) before responding
6. Ensure valid JSON syntax with proper quotes, commas, and brackets
7. Page numbers must be integers only (1, 2, 3) or "CSV" 
8. PDF text snippets MUST preserve original formatting - no normalization or cleanup
9. Text snippets should be 20-100 characters for optimal highlighting
10. Preserve original formatting and units from source documents
11. Cross-validate related fields for logical consistency
12. ALWAYS use the ACTUAL UPLOADED filename - never modify, shorten, or normalize file names
13. File names must include ALL characters: extensions, spaces, parentheses, special characters, etc.
14. NEVER EVER use generic placeholders like "CSV File 1", "File 1", "Document 1" - these are FORBIDDEN
15. If you cannot determine the actual filename, use "CSV: [Unknown filename]" instead of generic names
</CRITICAL_RULES>

<QUALITY_CHECKS>
Before returning your response, verify:
✓ All required fields are present
✓ JSON syntax is valid
✓ Page numbers are integers or "CSV" 
✓ PDF text snippets match EXACTLY what appears in the PDF (no normalization)
✓ Text snippets are appropriate length for highlighting
✓ Related fields are logically consistent
✓ Sources are properly documented
✓ File names are EXACTLY as uploaded (complete with extensions and special characters)
✓ NO generic filenames like "CSV File 1" are used ANYWHERE
✓ All CSV references use actual uploaded filenames
✓ No additional text outside the JSON object
</QUALITY_CHECKS>

<FILENAME_VERIFICATION_CHECKPOINT>
STOP AND CHECK: Before finalizing your response, scan through ALL your CSV references and verify:
- Are you using "CSV File 1", "File 1", "Document 1" or any generic name? → WRONG - Fix immediately
- Are you using the actual uploaded filename with extension? → CORRECT
- Does the filename include all special characters, spaces, numbers as uploaded? → MUST BE YES
- Example: Instead of "CSV File 1", use something like "lease_schedule_2024.csv" or "Property_Analysis_Final.xlsx"
</FILENAME_VERIFICATION_CHECKPOINT>
`;

// export const prompt = `
// <SYSTEM_ROLE>
// You are a precise data extraction specialist. Your ONLY task is to extract information from provided PDF and CSV files and return a complete JSON object. You must follow the exact format specified below without any deviation.
// </SYSTEM_ROLE>

// <OUTPUT_FORMAT_REQUIREMENTS>
// CRITICAL: Your response must contain ONLY a valid JSON object.
// - NO introductory text
// - NO explanatory text  
// - NO markdown code blocks (```json)
// - NO additional commentary
// - Start directly with the opening brace {
// - End directly with the closing brace }
// - ONLY the JSON object as specified in the schema
// </OUTPUT_FORMAT_REQUIREMENTS>

// <SYSTEM_CONSTRAINTS>
//    CRITICAL: You will receive a PDF offering memorandum (OM) and multiple CSV files containing property data.
//    CRITICAL: Return EXACTLY ONE complete JSON object following the schema below.
//    CRITICAL: Extract information from ALL provided files systematically - PDF and CSVs.
//    CRITICAL: Use "N/A" for any field where information is not found in ANY of the provided files.
//    CRITICAL: Do NOT omit any fields from the schema - all fields must be present.
//    CRITICAL: For PDF sources, include the EXACT text snippet AS IT APPEARS in the PDF, preserving all spacing, line breaks, and formatting.
//    CRITICAL: For CSV sources, reference the specific CSV file and relevant data point.
//    CRITICAL: Page numbers must be integers only (e.g., 5, not "page 5" or "5-6").
//    CRITICAL: Your response must be ONLY valid JSON - no other text whatsoever.
// </SYSTEM_CONSTRAINTS>

// <EXTRACTION_PROCESS>
// 1. First, thoroughly read through the entire PDF document from beginning to end
// 2. Then, analyze all CSV files to understand their structure and data
// 3. For each field in the schema:
//    a. Search the PDF first for relevant information
//    b. If not found in PDF, check the CSV files
//    c. Extract PDF text EXACTLY as it appears (preserve all spacing and formatting)
//    d. Record the source location and exact text/data used
// 4. Cross-reference information between files to ensure accuracy
// 5. Always prioritize the most recent or authoritative source when conflicts exist
// 6. Return the complete JSON object with ALL fields populated
// </EXTRACTION_PROCESS>

// <SOURCE_DOCUMENTATION_RULES>
// For PDF sources:
// - "page_no": Must be a single integer representing the page where information was found
// - "text_in_the_pdf": Must be the EXACT text snippet from the PDF AS IT APPEARS, preserving all original spacing, line breaks, character spacing, and formatting. Do NOT normalize, clean up, or reformat the text.

// For CSV sources:
// - "page_no": Use "CSV" 
// - "text_in_the_pdf": Use format "CSV: [filename] - [column]: [value]"

// CRITICAL PDF TEXT EXTRACTION RULES:
// - Extract text EXACTLY as displayed in the PDF viewer
// - Preserve unusual spacing (e.g., "B R O O K LY N" not "BROOKLYN")
// - Keep original line breaks and character positioning
// - Do not normalize, standardize, or clean up the text
// - The extracted text must match character-for-character what appears in the PDF
// </SOURCE_DOCUMENTATION_RULES>

// <DATA_VALIDATION_RULES>
// 1. Numbers: Extract as strings but ensure they represent valid numbers (e.g., "5.5", "1,200,000")
// 2. Dates: Use YYYY-MM-DD format when possible, otherwise exact text from source
// 3. Percentages: Include the % symbol when present in source (e.g., "5.5%")
// 4. Currency: Include currency symbols when present (e.g., "$25.00")
// 5. Ranges: Use exact format from source (e.g., "5-7 years", "$20-25 PSF")
// 6. Text fields: Preserve exact capitalization and spacing from source
// </DATA_VALIDATION_RULES>

// <CONSISTENCY_REQUIREMENTS>
// 1. If the same information appears in multiple sources, use the most detailed/recent version
// 2. Ensure all related fields are consistent (e.g., if annual rent is $100,000 and PSF is $20, property size should be 5,000 SF)
// 3. Cross-validate tenant information across all sources
// 4. Verify that financial metrics align with provided assumptions
// 5. Check that dates are logically consistent (lease start < lease end, etc.)
// </CONSISTENCY_REQUIREMENTS>

// <JSON_SCHEMA>
// You must return EXACTLY this JSON structure with ALL fields present:

// {
//   "dealOverview": {
//     "source": {
//       "page_no": "N/A or integer or 'CSV'",
//       "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//     },
//     "propertyName": "N/A or extracted value",
//     "location": "N/A or extracted value",
//     "dateUploaded": "N/A or extracted value",
//     "propertyType": "N/A or extracted value",
//     "seller": "N/A or extracted value",
//     "guidancePrice": "N/A or extracted value",
//     "guidancePricePSF": "N/A or extracted value",
//     "capRate": "N/A or extracted value",
//     "propertySize": "N/A or extracted value",
//     "landArea": "N/A or extracted value",
//     "zoning": "N/A or extracted value",
//     "underwritingModel": "N/A or extracted value"
//   },
//   "dealSummary": {
//     "text": "N/A or extracted summary text",
//     "source": {
//       "page_no": "N/A or integer or 'CSV'",
//       "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//     }
//   },
//   "personalizedInsights": ["N/A or array of extracted insights"],
//   "assetLevelData": {
//     "source": {
//       "page_no": "N/A or integer or 'CSV'",
//       "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//     },
//     "tenant": "N/A or extracted value",
//     "clearHeights": "N/A or extracted value",
//     "columnSpacing": "N/A or extracted value",
//     "parkingSpaces": "N/A or extracted value",
//     "dockDoors": "N/A or extracted value",
//     "seawardArea": "N/A or extracted value",
//     "yearBuilt": "N/A or extracted value",
//     "occupancyRate": "N/A or extracted value"
//   },
//   "projectedFinancialMetrics": {
//     "source": {
//       "page_no": "N/A or integer or 'CSV'",
//       "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//     },
//     "IRR": "N/A or extracted value",
//     "equityMultiple": "N/A or extracted value",
//     "returnOnEquity": "N/A or extracted value",
//     "returnOnCost": "N/A or extracted value"
//   },
//   "keyAssumptions": {
//     "source": {
//       "page_no": "N/A or integer or 'CSV'",
//       "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//     },
//     "exitPrice": "N/A or extracted value",
//     "exitCapRate": "N/A or extracted value",
//     "rentalGrowth": "N/A or extracted value",
//     "holdPeriod": "N/A or extracted value"
//   },
//   "marketAnalysis": {
//     "source": {
//       "page_no": "N/A or integer or 'CSV'",
//       "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//     },
//     "nearestUrbanCenter": "N/A or extracted value",
//     "populationGrowthRate": "N/A or extracted value",
//     "medianHouseholdIncome": "N/A or extracted value",
//     "unemploymentRate": "N/A or extracted value"
//   },
//   "leaseAnalysis": {
//     "source": {
//       "page_no": "N/A or integer or 'CSV'",
//       "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//     },
//     "rentPSF": "N/A or extracted value",
//     "WALT": "N/A or extracted value",
//     "rentEscalations": "N/A or extracted value",
//     "markToMarketOpportunity": "N/A or extracted value"
//   },
//   "tenantDetails": {
//     "tenant": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "name": "N/A or extracted value",
//       "logo": "/placeholder.svg?height=40&width=40",
//       "industry": "N/A or extracted value",
//       "creditRating": "N/A or extracted value"
//     },
//     "lease": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "startDate": "N/A or YYYY-MM-DD format",
//       "expiryDate": "N/A or YYYY-MM-DD format",
//       "term": "N/A or extracted value",
//       "remainingTerm": "N/A or extracted value"
//     },
//     "rent": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "baseRentPSF": "N/A or extracted value",
//       "annualBaseRent": "N/A or extracted value",
//       "monthlyBaseRent": "N/A or extracted value",
//       "effectiveRentPSF": "N/A or extracted value"
//     },
//     "escalations": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "structure": "N/A or extracted value",
//       "rate": "N/A or extracted value",
//       "nextEscalation": "N/A or extracted value"
//     },
//     "renewalOptions": [
//       {
//         "source": {
//           "page_no": "N/A or integer or 'CSV'",
//           "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//         },
//         "term": "N/A or extracted value",
//         "notice": "N/A or extracted value",
//         "rentStructure": "N/A or extracted value"
//       }
//     ],
//     "recoveries": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "operatingExpenses": "N/A or extracted value",
//       "cam": "N/A or extracted value",
//       "insurance": "N/A or extracted value",
//       "taxes": "N/A or extracted value",
//       "utilities": "N/A or extracted value"
//     },
//     "security": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "deposit": "N/A or extracted value",
//       "equivalent": "N/A or extracted value",
//       "letterOfCredit": "N/A or extracted value"
//     },
//     "otherTerms": [
//       {
//         "source": {
//           "page_no": "N/A or integer or 'CSV'",
//           "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//         },
//         "title": "N/A or extracted value",
//         "description": "N/A or extracted value"
//       }
//     ],
//     "rentSchedule": [
//       {
//         "source": {
//           "page_no": "N/A or integer or 'CSV'",
//           "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//         },
//         "year": "N/A or integer",
//         "rentPSF": "N/A or number",
//         "annualRent": "N/A or number"
//       }
//     ],
//     "marketComparison": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "subjectProperty": { 
//         "name": "N/A or extracted value", 
//         "rentPSF": "N/A or number"
//       },
//       "marketComps": [
//         { 
//           "name": "N/A or extracted value", 
//           "rentPSF": "N/A or number"
//         }
//       ]
//     },
//     "recoveryBreakdown": {
//       "source": {
//         "page_no": "N/A or integer or 'CSV'",
//         "text_in_the_pdf": "N/A or exact extracted text or CSV reference"
//       },
//       "cam": "N/A or number",
//       "taxes": "N/A or number",
//       "insurance": "N/A or number"
//     }
//   }
// }
// </JSON_SCHEMA>

// <RESPONSE_FORMAT_ENFORCEMENT>
// REMINDER: Your response must be ONLY the JSON object above.

// DO NOT include:
// - Any introductory text like "Here is the extracted data:" or "Based on the files provided:"
// - Any explanatory text
// - Markdown code blocks with ```json
// - Any text before the opening brace {
// - Any text after the closing brace }
// - Any comments or notes

// Your response must start with { and end with }

// Example of CORRECT format:
// {
//   "dealOverview": {
//     "source": {
//       "page_no": 1,
//       "text_in_the_pdf": "Property Name: ABC Plaza"
//     },
//     ...
//   }
// }

// Example of INCORRECT format:
// Here is the extracted data:
// ```json
// {
//   "dealOverview": {
//     ...
//   }
// }
// ```
// </RESPONSE_FORMAT_ENFORCEMENT>

// <CRITICAL_RULES>
// 1. Your response must contain ONLY the JSON object - absolutely no other text
// 2. Do NOT use markdown code blocks (```json
// 3. Start directly with the opening brace {
// 4. End directly with the closing brace }
// 5. ALL fields must be present in your response - never omit any field
// 6. Use "N/A" for missing information - do not use null, undefined, or empty strings
// 7. Maintain exact field names and structure as shown in the schema
// 8. Process ALL provided files (PDF and CSVs) before responding
// 9. Ensure valid JSON syntax with proper quotes, commas, and brackets
// 10. Page numbers must be integers only (1, 2, 3) or "CSV"
// 11. PDF text snippets MUST preserve original formatting - no normalization or cleanup
// 12. Cross-validate related fields for logical consistency
// </CRITICAL_RULES>

// <QUALITY_CHECKS>
// Before returning your response, verify:
// ✓ Response contains ONLY the JSON object (no other text)
// ✓ No markdown code blocks (```json)
// ✓ Starts with { and ends with }
// ✓ All required fields are present
// ✓ JSON syntax is valid
// ✓ Page numbers are integers or "CSV"
// ✓ PDF text snippets match EXACTLY what appears in the PDF (no normalization)
// ✓ Related fields are logically consistent
// ✓ Sources are properly documented
// </QUALITY_CHECKS>

// <FINAL_REMINDER>
// RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT WHATSOEVER.
// </FINAL_REMINDER>
// `;

export const openApiPrompt = `Please analyze the provided offering memorandum (OM) document and extract all relevant information, returning the results in the exact JSON format specified below. If any field is not present or the information cannot be determined, use the value "N/A" for strings or 0 for numbers where appropriate. The structure and field names must be strictly followed:

{
  "dealOverview": {
    "propertyName": "string",
    "location": "string",
    "dateUploaded": "string",
    "propertyType": "string",
    "seller": "string",
    "guidancePrice": "string",
    "guidancePricePSF": "string",
    "capRate": "string",
    "propertySize": "string",
    "landArea": "string",
    "zoning": "string",
    "underwritingModel": "string"
  },
  "dealSummary": {
    "text": "string"
  },
  "personalizedInsights": ["string"],
  "assetLevelData": {
    "tenant": "string",
    "clearHeights": "string",
    "columnSpacing": "string",
    "parkingSpaces": 0,
    "dockDoors": 0,
    "seawardArea": "string",
    "yearBuilt": 0,
    "occupancyRate": "string"
  },
  "projectedFinancialMetrics": {
    "IRR": "string",
    "equityMultiple": "string",
    "returnOnEquity": "string",
    "returnOnCost": "string"
  },
  "keyAssumptions": {
    "exitPrice": "string",
    "exitCapRate": "string",
    "rentalGrowth": "string",
    "holdPeriod": "string"
  },
  "marketAnalysis": {
    "nearestUrbanCenter": "string",
    "populationGrowthRate": "string",
    "medianHouseholdIncome": "string",
    "unemploymentRate": "string"
  },
  "leaseAnalysis": {
    "rentPSF": "string",
    "WALT": "string",
    "rentEscalations": "string",
    "markToMarketOpportunity": "string"
  }
}

{
  "tenant": {
    "name": "string",
    "logo": "/placeholder.svg?height=40&width=40",
    "industry": "string",
    "creditRating": "string"
  },
  "lease": {
    "startDate": "YYYY-MM-DD",
    "expiryDate": "YYYY-MM-DD",
    "term": "string",
    "remainingTerm": "string"
  },
  "rent": {
    "baseRentPSF": "string",
    "annualBaseRent": "string",
    "monthlyBaseRent": "string",
    "effectiveRentPSF": "string"
  },
  "escalations": {
    "structure": "string",
    "rate": "string",
    "nextEscalation": "string"
  },
  "renewalOptions": [
    {
      "term": "string",
      "notice": "string",
      "rentStructure": "string"
    }
  ],
  "recoveries": {
    "operatingExpenses": "string",
    "cam": "string",
    "insurance": "string",
    "taxes": "string",
    "utilities": "string"
  },
  "security": {
    "deposit": "string",
    "equivalent": "string",
    "letterOfCredit": "string"
  },
  "otherTerms": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "rentSchedule": [
    {
      "year": 0,
      "rentPSF": 0,
      "annualRent": 0
    }
  ],
  "marketComparison": {
    "subjectProperty": { "name": "string", "rentPSF": 0 },
    "marketComps": [
      { "name": "string", "rentPSF": 0 }
    ]
  },
  "recoveryBreakdown": {
    "cam": 0,
    "taxes": 0,
    "insurance": 0
  }
}

Requirements:
- Ensure that the values you are extracting are accurate and exactly as what is in the offering memorandum.
- Ensure the output strictly matches the schemas above.
- Use "N/A" for any missing or unavailable fields, and 0 for missing numeric values.
- Dates should be formatted as "YYYY-MM-DD".
- All numeric values must be parsed as numbers unless explicitly noted as strings.
- Do not estimate or infer any data — only extract what is explicitly written in the document.
- Do not provide any extra commentary or explanations — only the two JSON objects.
`;
