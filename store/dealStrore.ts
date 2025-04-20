import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DealOverviewType = {
  dealOverview?: {
    propertyName: string;
    location: string;
    dateUploaded: string;
    propertyType: string;
    seller: string;
    guidancePrice: string;
    guidancePricePSF: string;
    capRate: string;
    propertySize: string;
    landArea: string;
    zoning: string;
    underwritingModel: string;
  };
  dealSummary?: {
    text: string;
  };
  personalizedInsights?: string[];
  assetLevelData?: {
    tenant: string;
    clearHeights: string;
    columnSpacing: string;
    parkingSpaces: number;
    dockDoors: number;
    seawardArea: string;
    yearBuilt: number;
    occupancyRate: string;
  };
  projectedFinancialMetrics?: {
    IRR: string;
    equityMultiple: string;
    returnOnEquity: string;
    returnOnCost: string;
  };
  keyAssumptions?: {
    exitPrice: string;
    exitCapRate: string;
    rentalGrowth: string;
    holdPeriod: string;
  };
  marketAnalysis?: {
    nearestUrbanCenter: string;
    populationGrowthRate: string;
    medianHouseholdIncome: string;
    unemploymentRate: string;
  };
  leaseAnalysis?: {
    rentPSF: string;
    WALT: string;
    rentEscalations: string;
    markToMarketOpportunity: string;
  };
};

interface DealOverviewStore {
  dealData: DealOverviewType;
  isDataLoaded: boolean;
  setDealData: (data: DealOverviewType) => void;
  resetDealData: () => void;
}

export const useDealOverviewStore = create<DealOverviewStore>()(
  persist(
    (set) => ({
      dealData: {},
      isDataLoaded: false,
      setDealData: (data) => set({ dealData: data, isDataLoaded: true }),
      resetDealData: () => set({ dealData: {}, isDataLoaded: false }),
    }),
    {
      name: "deal-overview-storage",
    }
  )
);
