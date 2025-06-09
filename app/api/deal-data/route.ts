import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const dealData = {
    "dealOverview": {
      "source": {
        "page_no": 4,
        "text_in_the_pdf": "280 Richards is ideally located on Brooklyn's waterfront in the coveted Red Hook logistics\nsubmarket."
      },
      "propertyName": "280 Richards",
      "location": "B R O O K LY N , N E W YO R K C I T Y",
      "dateUploaded": "N/A",
      "propertyType": "NEW CONSTRUCTION LOGISTICS CENTER",
      "seller": "N/A",
      "guidancePrice": "N/A",
      "guidancePricePSF": "N/A",
      "capRate": "N/A",
      "propertySize": "312,000 square feet",
      "landArea": "16-acre NYC site",
      "zoning": "N/A",
      "underwritingModel": "CSV: 280_Richards_Pro_Forma.csv - Financial projections provided"
    },
    "dealSummary": {
      "text": "Newmark has been retained to sell the 100% fee simple interest in 280 Richards (the \"Property\" or the \"Offering\"). Fully leased to Amazon (S&P: AA), the Offering represents an exclusive opportunity to acquire new construction on a 16-acre NYC site, an investment grade tenant, assumable in-place financing ($72.9 million at 3.85% through Feb-28), and 13 years of remaining term with embedded 3% annual rental growth.",
      "source": {
        "page_no": 4,
        "text_in_the_pdf": "Newmark has been retained to sell the 100% fee simple interest in 280 Richards (the\n\"Property\" or the \"Offering\"). Fully leased to Amazon (S&P: AA), the Offering represents an\nexclusive opportunity to acquire new construction on a 16-acre NYC site, an investment grade\ntenant, assumable in-place financing ($72.9 million at 3.85% through Feb-28), and 13 years\nof remaining term with embedded 3% annual rental growth."
      }
    },
    "personalizedInsights": [
      "100% Net Leased to Amazon with AA S&P rating",
      "Assumable in-place financing at 3.85% through Feb-28",
      "30%+ mark-to-market opportunity at lease expiration",
      "Mission critical location for Amazon business consumers",
      "High barrier to entry Red Hook submarket"
    ],
    "assetLevelData": {
      "source": {
        "page_no": 9,
        "text_in_the_pdf": "36' CLEAR HEIGHTS\n393 TOTAL SPACES\n63' X 54'\nCOLUMN SPACING\n5 LOADING DOCKS\n(CAPACITY FOR 28)"
      },
      "tenant": "Amazon.com Services LLC",
      "clearHeights": "36'",
      "columnSpacing": "63' X 54'",
      "parkingSpaces": "393 TOTAL SPACES",
      "dockDoors": "5 LOADING DOCKS (CAPACITY FOR 28)",
      "seawardArea": "357,151 SF",
      "yearBuilt": "2022",
      "occupancyRate": "100%"
    },
    "keyAssumptions": {
      "source": {
        "page_no": 11,
        "text_in_the_pdf": "Annual Rent Steps 3.00%\nRenewal Option(s) Four 5-year renewal options at 100% FMV"
      },
      "exitPrice": "N/A",
      "exitCapRate": "N/A",
      "rentalGrowth": "3.00%",
      "holdPeriod": "N/A"
    },
    "marketAnalysis": {
      "source": {
        "page_no": 12,
        "text_in_the_pdf": "As of Q1 2024, Brooklyn houses over 2.8 million residents, or\n31% of New York City's total population"
      },
      "nearestUrbanCenter": "Downtown Manhattan",
      "populationGrowthRate": "N/A",
      "medianHouseholdIncome": "$160,000",
      "unemploymentRate": "N/A"
    },
    "leaseAnalysis": {
      "source": {
        "page_no": 7,
        "text_in_the_pdf": "Total / W.A 312,000 100% Sep-37 $7,613,773 $24.40"
      },
      "rentPSF": "$24.40",
      "WALT": "13 YRS OF REMAINING TERM THROUGH SEP-37",
      "rentEscalations": "3% ANNUAL ESCALATIONS",
      "markToMarketOpportunity": "30%+ MARK-TO-MARKET"
    },
    "tenantDetails": {
      "tenant": {
        "source": {
          "page_no": 8,
          "text_in_the_pdf": "AA\n(S&P) INVESTMENT\nGRADE"
        },
        "name": "Amazon.com Services LLC",
        "logo": "/placeholder.svg?height=40&width=40",
        "industry": "E-commerce/Logistics",
        "creditRating": "AA (S&P)"
      },
      "lease": {
        "source": {
          "page_no": "CSV",
          "text_in_the_pdf": "CSV: 280_Richards_Tenant_History.csv - Lease Start: 2022-05-01, Lease End: 2037-09-30"
        },
        "startDate": "2022-05-01",
        "expiryDate": "2037-09-30",
        "term": "15 years",
        "remainingTerm": "13 years"
      },
      "rent": {
        "source": {
          "page_no": 7,
          "text_in_the_pdf": "Total / W.A 312,000 100% Sep-37 $7,613,773 $24.40"
        },
        "baseRentPSF": "$24.40",
        "annualBaseRent": "$7,613,773",
        "monthlyBaseRent": "$634,481",
        "effectiveRentPSF": "$24.40"
      },
      "escalations": {
        "source": {
          "page_no": 11,
          "text_in_the_pdf": "Annual Rent Steps 3.00%"
        },
        "structure": "Annual",
        "rate": "3.00%",
        "nextEscalation": "N/A"
      },
      "renewalOptions": [
        {
          "source": {
            "page_no": 11,
            "text_in_the_pdf": "Renewal Option(s) Four 5-year renewal options at 100% FMV"
          },
          "term": "5 years",
          "notice": "N/A",
          "rentStructure": "100% FMV"
        }
      ],
      "recoveries": {
        "source": {
          "page_no": 11,
          "text_in_the_pdf": "Real Estate Taxes: 100% Recovery\nCAM: 100% Recovery\nInsurance & Mgmt Fee: Incurred by Ownership"
        },
        "operatingExpenses": "Partial",
        "cam": "100% Recovery",
        "insurance": "Incurred by Ownership",
        "taxes": "100% Recovery",
        "utilities": "N/A"
      },
      "security": {
        "source": {
          "page_no": "N/A",
          "text_in_the_pdf": "N/A"
        },
        "deposit": "N/A",
        "equivalent": "N/A",
        "letterOfCredit": "N/A"
      },
      "otherTerms": [
        {
          "source": {
            "page_no": 11,
            "text_in_the_pdf": "Other Option(s) One-Time ROFO (Right of First Offer)"
          },
          "title": "Right of First Offer",
          "description": "One-Time ROFO (Right of First Offer)"
        }
      ],
      "rentSchedule": [
        {
          "source": {
            "page_no": "CSV",
            "text_in_the_pdf": "CSV: 280_Richards_Pro_Forma.csv - Jun-25: $7,613,773"
          },
          "year": 1,
          "rentPSF": 24.40,
          "annualRent": 7613773
        },
        {
          "source": {
            "page_no": "CSV",
            "text_in_the_pdf": "CSV: 280_Richards_Pro_Forma.csv - Jun-26: $7,842,186"
          },
          "year": 2,
          "rentPSF": 25.13,
          "annualRent": 7842186
        },
        {
          "source": {
            "page_no": "CSV",
            "text_in_the_pdf": "CSV: 280_Richards_Pro_Forma.csv - Jun-27: $8,077,451"
          },
          "year": 3,
          "rentPSF": 25.89,
          "annualRent": 8077451
        }
      ],
      "marketComparison": {
        "source": {
          "page_no": 10,
          "text_in_the_pdf": "average Class A rents have skyrocketed to $40+ PSF in the NYC Boroughs"
        },
        "subjectProperty": { 
          "name": "280 Richards", 
          "rentPSF": 24.40
        },
        "marketComps": [
          { 
            "name": "NYC Boroughs Class A Average", 
            "rentPSF": 40.00
          }
        ]
      },
      "recoveryBreakdown": {
        "source": {
          "page_no": "CSV",
          "text_in_the_pdf": "CSV: 280_Richards_Pro_Forma.csv - Expense Recoveries: $1,361,000"
        },
        "cam": 20000,
        "taxes": 1341000,
        "insurance": 73100
      }
    }
  };

  const result = {
    success: true,
    data: {
      leaseData: dealData,
      tenantData: dealData.tenantDetails,
    },
    fromCache: false
  };

  return NextResponse.json(result);
} 