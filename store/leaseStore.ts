import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Source {
  page_no: number;
  start_position: number;
  end_position: number;
  text_in_the_pdf: string;
}

export type LeaseDataType = {
  tenant?: {
    name: string;
    logo: string;
    industry: string;
    creditRating: string;
    source?: Source;
  };
  lease?: {
    startDate: string;
    expiryDate: string;
    term: string;
    remainingTerm: string;
    source?: Source;
  };
  rent?: {
    baseRentPSF: string;
    annualBaseRent: string;
    monthlyBaseRent: string;
    effectiveRentPSF: string;
    source?: Source;
  };
  escalations?: {
    structure: string;
    rate: string;
    nextEscalation: string;
    source?: Source;
  };
  renewalOptions?: Array<{
    term: string;
    notice: string;
    rentStructure: string;
    source?: Source;
  }>;
  recoveries?: {
    operatingExpenses: string;
    cam: string;
    insurance: string;
    taxes: string;
    utilities: string;
    source?: Source;
  };
  security?: {
    deposit: string;
    equivalent: string;
    letterOfCredit: string;
    source?: Source;
  };
  otherTerms?: Array<{
    title: string;
    description: string;
  }>;
  rentSchedule?: Array<{
    year: number;
    rentPSF: number;
    annualRent: number;
  }>;
  marketComparison?: {
    subjectProperty: { name: string; rentPSF: number };
    marketComps: Array<{ name: string; rentPSF: number }>;
  };
  recoveryBreakdown?: {
    cam: number;
    taxes: number;
    insurance: number;
  };
};

interface LeaseStore {
  leaseData: LeaseDataType;
  isDataLoaded: boolean;
  setLeaseData: (data: LeaseDataType) => void;
  resetLeaseData: () => void;
}

export const useLeaseStore = create<LeaseStore>()(
  persist(
    (set) => ({
      leaseData: {},
      isDataLoaded: false,
      setLeaseData: (data) => set({ leaseData: data, isDataLoaded: true }),
      resetLeaseData: () => set({ leaseData: {}, isDataLoaded: false }),
    }),
    {
      name: "lease-storage",
    }
  )
);
