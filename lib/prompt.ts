export const prompt = `
<SYSTEM_CONSTRAINTS>
   CRITICAL: Return EXACTLY ONE complete JSON object following the schema below.
   CRITICAL: Extract information from the ENTIRE PDF systematically.
   CRITICAL: Use "N/A" for any field where information is not found in the PDF.
   CRITICAL: Do NOT omit any fields from the schema - all fields must be present.
   CRITICAL: Return ONLY the JSON object - no additional text, explanations, or markdown.
   CRITICAL: In text_in_the_pdf keep all the text that has been used.
   CRITICAL: In the page_no there should be only one page number, the page number where the text_in_the_pdf is present.
</SYSTEM_CONSTRAINTS>

<EXTRACTION_PROCESS>
1. Read through the entire PDF document completely
2. For each field in the schema, search the entire document for relevant information
3. If information is found, extract it exactly as written in the PDF
4. If information is not found, use "N/A" as the value
5. Always include source information when data is found
6. Return the complete JSON object with ALL fields populated
</EXTRACTION_PROCESS>

<JSON_SCHEMA>
You must return EXACTLY this JSON structure with ALL fields present:

{
  "dealOverview": {
    "source": {
      "page_no": "N/A or number only one page number",
      "text_in_the_pdf": "N/A or extracted text",
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
      "page_no": "N/A or number only one page number",
      "text_in_the_pdf": "N/A or extracted text",
    },
  },
  "personalizedInsights": ["N/A or array of extracted insights"],
  "assetLevelData": {
    "source": {
      "page_no": "N/A or number only one page number",
      "text_in_the_pdf": "N/A or extracted text",
    },
    "tenant": "N/A or extracted value",
    "clearHeights": "N/A or extracted value",
    "columnSpacing": "N/A or extracted value",
    "parkingSpaces": "N/A or number",
    "dockDoors": "N/A or number",
    "seawardArea": "N/A or extracted value",
    "yearBuilt": "N/A or number",
    "occupancyRate": "N/A or extracted value"
  },
  "projectedFinancialMetrics": {
    "IRR": "N/A or extracted value",
    "equityMultiple": "N/A or extracted value",
    "returnOnEquity": "N/A or extracted value",
    "returnOnCost": "N/A or extracted value"
  },
  "keyAssumptions": {
    "exitPrice": "N/A or extracted value",
    "exitCapRate": "N/A or extracted value",
    "rentalGrowth": "N/A or extracted value",
    "holdPeriod": "N/A or extracted value"
  },
  "marketAnalysis": {
    "source": {
      "page_no": "N/A or number only one page number",
      "text_in_the_pdf": "N/A or extracted text",
    },
    "nearestUrbanCenter": "N/A or extracted value",
    "populationGrowthRate": "N/A or extracted value",
    "medianHouseholdIncome": "N/A or extracted value",
    "unemploymentRate": "N/A or extracted value"
  },
  "leaseAnalysis": {
    "rentPSF": "N/A or extracted value",
    "WALT": "N/A or extracted value",
    "rentEscalations": "N/A or extracted value",
    "markToMarketOpportunity": "N/A or extracted value"
  },
  "tenantDetails": {
    "tenant": {
      "source": {
        "page_no": "N/A or number only one page number",
        "text_in_the_pdf": "N/A or extracted text",
      },
      "name": "N/A or extracted value",
      "logo": "/placeholder.svg?height=40&width=40",
      "industry": "N/A or extracted value",
      "creditRating": "N/A or extracted value"
    },
    "lease": {
      "source": {
        "page_no": "N/A or number",
        "text_in_the_pdf": "N/A or extracted text",
      },
      "startDate": "N/A or YYYY-MM-DD",
      "expiryDate": "N/A or YYYY-MM-DD",
      "term": "N/A or extracted value",
      "remainingTerm": "N/A or extracted value"
    },
    "rent": {
      "source": {
        "page_no": "N/A or number",
        "text_in_the_pdf": "N/A or extracted text",
      },
      "baseRentPSF": "N/A or extracted value",
      "annualBaseRent": "N/A or extracted value",
      "monthlyBaseRent": "N/A or extracted value",
      "effectiveRentPSF": "N/A or extracted value"
    },
    "escalations": {
      "structure": "N/A or extracted value",
      "rate": "N/A or extracted value",
      "nextEscalation": "N/A or extracted value"
    },
    "renewalOptions": [
      {
        "term": "N/A or extracted value",
        "notice": "N/A or extracted value",
        "rentStructure": "N/A or extracted value"
      }
    ],
    "recoveries": {
      "operatingExpenses": "N/A or extracted value",
      "cam": "N/A or extracted value",
      "insurance": "N/A or extracted value",
      "taxes": "N/A or extracted value",
      "utilities": "N/A or extracted value"
    },
    "security": {
      "deposit": "N/A or extracted value",
      "equivalent": "N/A or extracted value",
      "letterOfCredit": "N/A or extracted value"
    },
    "otherTerms": [
      {
        "title": "N/A or extracted value",
        "description": "N/A or extracted value"
      }
    ],
    "rentSchedule": [
      {
        "year": "N/A or number",
        "rentPSF": "N/A or number",
        "annualRent": "N/A or number"
      }
    ],
    "marketComparison": {
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
      "cam": "N/A or number",
      "taxes": "N/A or number",
      "insurance": "N/A or number"
    }
  }
}
</JSON_SCHEMA>

<CRITICAL_RULES>
1. Return ONLY the JSON object above - no additional text
2. ALL fields must be present in your response
3. Use "N/A" for missing information - do not omit fields
4. Maintain exact field names and structure as shown
5. Process the entire PDF before responding
6. Ensure valid JSON syntax (proper quotes, commas, brackets)
</CRITICAL_RULES>
`;






// export const prompt = `
// <SYSTEM_CONSTRAINTS>
//    CRITICAL: Return EXACTLY ONE complete JSON object following the schema below.
//    CRITICAL: Extract information from the ENTIRE PDF systematically.
//    CRITICAL: Use "N/A" for any field where information is not found in the PDF.
//    CRITICAL: Do NOT omit any fields from the schema - all fields must be present.
//    CRITICAL: Return ONLY the JSON object - no additional text, explanations, or markdown.
//    CRITICAL: For text_in_the_pdf fields, give the text which would be easy to find when the pdf is rendered using pdfjs-dist viewer.
//    CRITICAL: REMEMBER: The text_in_the_pdf fields should be according to the pdfjs-dist, give them such a manner that it is easy to find the text in the pdfjs-dist viewer.
// </SYSTEM_CONSTRAINTS>

// <EXTRACTION_PROCESS>
// 1. Read through the entire PDF document completely
// 2. For each field in the schema, search the entire document for relevant information
// 3. If information is found, extract it exactly as written in the PDF
// 4. If information is not found, use "N/A" as the value
// 5. For text_in_the_pdf fields, copy the EXACT text from the PDF without any modifications or summaries
// 6. Return the complete JSON object with ALL fields populated
// </EXTRACTION_PROCESS>

// <JSON_SCHEMA>
// You must return EXACTLY this JSON structure with ALL fields present:

// {
//   "dealOverview": {
//     "source": {
//       "page_no": "N/A or number",
//       "text_in_the_pdf": "N/A or exact text from PDF as it appears"
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
//     "source": {
//       "page_no": "N/A or number",
//       "text_in_the_pdf": "N/A or exact text from PDF as it appears"
//     },
//     "text": "N/A or extracted summary text"
//   },
//   "personalizedInsights": ["N/A or array of extracted insights"],
//   "assetLevelData": {
//     "source": {
//       "page_no": "N/A or number",
//       "text_in_the_pdf": "N/A or exact text from PDF as it appears"
//     },
//     "tenant": "N/A or extracted value",
//     "clearHeights": "N/A or extracted value",
//     "columnSpacing": "N/A or extracted value",
//     "parkingSpaces": "N/A or number",
//     "dockDoors": "N/A or number",
//     "seawardArea": "N/A or extracted value",
//     "yearBuilt": "N/A or number",
//     "occupancyRate": "N/A or extracted value"
//   },
//   "projectedFinancialMetrics": {
//     "IRR": "N/A or extracted value",
//     "equityMultiple": "N/A or extracted value",
//     "returnOnEquity": "N/A or extracted value",
//     "returnOnCost": "N/A or extracted value"
//   },
//   "keyAssumptions": {
//     "exitPrice": "N/A or extracted value",
//     "exitCapRate": "N/A or extracted value",
//     "rentalGrowth": "N/A or extracted value",
//     "holdPeriod": "N/A or extracted value"
//   },
//   "marketAnalysis": {
//     "source": {
//       "page_no": "N/A or number",
//       start_position: "N/A or number",
//       end_position: "N/A or number",
//       "text_in_the_pdf": "N/A or exact text from PDF as it appears"
//     },
//     "nearestUrbanCenter": "N/A or extracted value",
//     "populationGrowthRate": "N/A or extracted value",
//     "medianHouseholdIncome": "N/A or extracted value",
//     "unemploymentRate": "N/A or extracted value"
//   },
//   "leaseAnalysis": {
//     "rentPSF": "N/A or extracted value",
//     "WALT": "N/A or extracted value",
//     "rentEscalations": "N/A or extracted value",
//     "markToMarketOpportunity": "N/A or extracted value"
//   },
//   "tenantDetails": {
//     "tenant": {
//       "source": {
//         "page_no": "N/A or number",
//         "text_in_the_pdf": "N/A or exact text from PDF as it appears"
//       },
//       "name": "N/A or extracted value",
//       "logo": "/placeholder.svg?height=40&width=40",
//       "industry": "N/A or extracted value",
//       "creditRating": "N/A or extracted value"
//     },
//     "lease": {
//       "source": {
//         "page_no": "N/A or number",
//         "text_in_the_pdf": "N/A or exact text from PDF as it appears"
//       },
//       "startDate": "N/A or YYYY-MM-DD",
//       "expiryDate": "N/A or YYYY-MM-DD",
//       "term": "N/A or extracted value",
//       "remainingTerm": "N/A or extracted value"
//     },
//     "rent": {
//       "source": {
//         "page_no": "N/A or number",
//         "text_in_the_pdf": "N/A or exact text from PDF as it appears"
//       },
//       "baseRentPSF": "N/A or extracted value",
//       "annualBaseRent": "N/A or extracted value",
//       "monthlyBaseRent": "N/A or extracted value",
//       "effectiveRentPSF": "N/A or extracted value"
//     },
//     "escalations": {
//       "structure": "N/A or extracted value",
//       "rate": "N/A or extracted value",
//       "nextEscalation": "N/A or extracted value"
//     },
//     "renewalOptions": [
//       {
//         "term": "N/A or extracted value",
//         "notice": "N/A or extracted value",
//         "rentStructure": "N/A or extracted value"
//       }
//     ],
//     "recoveries": {
//       "operatingExpenses": "N/A or extracted value",
//       "cam": "N/A or extracted value",
//       "insurance": "N/A or extracted value",
//       "taxes": "N/A or extracted value",
//       "utilities": "N/A or extracted value"
//     },
//     "security": {
//       "deposit": "N/A or extracted value",
//       "equivalent": "N/A or extracted value",
//       "letterOfCredit": "N/A or extracted value"
//     },
//     "otherTerms": [
//       {
//         "title": "N/A or extracted value",
//         "description": "N/A or extracted value"
//       }
//     ],
//     "rentSchedule": [
//       {
//         "year": "N/A or number",
//         "rentPSF": "N/A or number",
//         "annualRent": "N/A or number"
//       }
//     ],
//     "marketComparison": {
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
//       "cam": "N/A or number",
//       "taxes": "N/A or number",
//       "insurance": "N/A or number"
//     }
//   }
// }
// </JSON_SCHEMA>

// <CRITICAL_RULES>
// 1. Return ONLY the JSON object above - no additional text
// 2. ALL fields must be present in your response
// 3. Use "N/A" for missing information - do not omit fields
// 4. Maintain exact field names and structure as shown
// 5. Process the entire PDF before responding
// 6. Ensure valid JSON syntax (proper quotes, commas, brackets)
// 7. For text_in_the_pdf fields: Copy the EXACT text from the PDF as it appears, including spacing, capitalization, and punctuation - do not modify, summarize, or paraphrase
// </CRITICAL_RULES>
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
