export const prompt = `Please analyze the provided lease document and extract all relevant information, returning the results in the exact JSON format specified below. If any field is not present or the information cannot be determined, use the value "N/A". The structure and field names must be strictly followed:

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
      "year": number,
      "rentPSF": number,
      "annualRent": number
    }
  ],
  "marketComparison": {
    "subjectProperty": { "name": "string", "rentPSF": number },
    "marketComps": [
      { "name": "string", "rentPSF": number }
    ]
  },
  "recoveryBreakdown": {
    "cam": number,
    "taxes": number,
    "insurance": number
  }
}

Requirements:
- Ensure that the values you are extracting are accurate and exactly as what is in the lease document.
- Ensure the output strictly matches the schema above.
- Use "N/A" for any missing or unavailable fields.
- Dates should be formatted as "YYYY-MM-DD".
- All numeric values should be parsed as numbers (not strings), unless specified otherwise.
- Maintain consistency and accuracy with terminology used in the lease document.
`;

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
