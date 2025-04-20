export interface LeaseData {
    tenant: {
      name: string;
      logo: string;
      industry: string;
      creditRating: string;
    };
    lease: {
      startDate: string;
      expiryDate: string;
      term: string;
      remainingTerm: string;
    };
    rent: {
      baseRentPSF: string;
      annualBaseRent: string;
      monthlyBaseRent: string;
      effectiveRentPSF: string;
    };
    escalations: {
      structure: string;
      rate: string;
      nextEscalation: string;
    };
    renewalOptions: Array<{
      term: string;
      notice: string;
      rentStructure: string;
    }>;
    recoveries: {
      operatingExpenses: string;
      cam: string;
      insurance: string;
      taxes: string;
      utilities: string;
    };
    security: {
      deposit: string;
      equivalent: string;
      letterOfCredit: string;
    };
    otherTerms: Array<{
      title: string;
      description: string;
    }>;
    rentSchedule: Array<{
      year: number;
      rentPSF: number;
      annualRent: number;
    }>;
    marketComparison: {
      subjectProperty: { name: string; rentPSF: number };
      marketComps: Array<{ name: string; rentPSF: number }>;
    };
    recoveryBreakdown: {
      cam: number;
      taxes: number;
      insurance: number;
    };
  }