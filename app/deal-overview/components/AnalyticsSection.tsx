import { Card } from "@/components/ui/card";
import { SourceLink } from "./SourceLink";
import {
  PieChart,
  Target,
  Percent,
  DollarSign,
  Building,
  Users,
  Calendar,
  Clock,
} from "lucide-react";

interface Source {
  page_no: number;
  start_position: number;
  end_position: number;
  text_in_the_pdf: string;
}

interface ProjectedFinancialMetrics {
  source?: Source;
  IRR?: string;
  equityMultiple?: string;
  returnOnEquity?: string;
  returnOnCost?: string;
}

interface KeyAssumptions {
  source?: Source;
  exitPrice?: string;
  exitCapRate?: string;
  rentalGrowth?: string;
  holdPeriod?: string;
}

interface MarketAnalysis {
  source?: Source;
  nearestUrbanCenter?: string;
  populationGrowthRate?: string;
  medianHouseholdIncome?: string;
  unemploymentRate?: string;
}

interface LeaseAnalysis {
  source?: Source;
  rentPSF?: string;
  WALT?: string;
  rentEscalations?: string;
  markToMarketOpportunity?: string;
}

interface AnalyticsSectionProps {
  projectedFinancialMetrics?: ProjectedFinancialMetrics;
  keyAssumptions?: KeyAssumptions;
  marketAnalysis?: MarketAnalysis;
  leaseAnalysis?: LeaseAnalysis;
  onViewPDF: (pageNumber: number, title: string, startPosition?: number, endPosition?: number, sourceText?: string) => void;
}

const isValidValue = (value: any): boolean => {
  return (
    value !== "N/A" &&
    value !== "NA" &&
    value !== null &&
    value !== undefined &&
    value !== ""
  );
};

export function AnalyticsSection({
  projectedFinancialMetrics,
  keyAssumptions,
  marketAnalysis,
  leaseAnalysis,
  onViewPDF,
}: AnalyticsSectionProps) {
  return (
    <div className="mt-8 w-full">
      <h3 className="text-lg font-medium mb-4">Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Key Assumptions */}
        {keyAssumptions && (
          <Card className="p-4 h-full w-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-green-600">
                Key Assumptions
              </h4>
              {keyAssumptions.source && (
                <SourceLink 
                  source={keyAssumptions.source}
                  label="Key Assumptions"
                  onViewPDF={onViewPDF}
                />
              )}
            </div>

            <div className="space-y-4 flex-grow">
              {isValidValue(keyAssumptions.exitPrice) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>Exit Price</span>
                  </div>
                  <p className="text-xl font-bold">
                    {keyAssumptions.exitPrice}
                  </p>
                </div>
              )}

              {isValidValue(keyAssumptions.exitCapRate) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Percent className="h-3 w-3 mr-1" />
                    <span>Exit Cap Rate</span>
                  </div>
                  <p className="text-xl font-bold">
                    {keyAssumptions.exitCapRate}
                  </p>
                </div>
              )}

              {isValidValue(keyAssumptions.rentalGrowth) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Target className="h-3 w-3 mr-1" />
                    <span>Rental Growth</span>
                  </div>
                  <p className="text-xl font-bold">
                    {keyAssumptions.rentalGrowth}
                  </p>
                </div>
              )}

              {isValidValue(keyAssumptions.holdPeriod) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Hold Period</span>
                  </div>
                  <p className="text-xl font-bold">
                    {keyAssumptions.holdPeriod}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Market Analysis */}
        {marketAnalysis && (
          <Card className="p-4 h-full w-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-purple-600">
                Market Analysis
              </h4>
              {marketAnalysis.source && (
                <SourceLink 
                  source={marketAnalysis.source}
                  label="Market Analysis"
                  onViewPDF={onViewPDF}
                />
              )}
            </div>

            <div className="space-y-4 flex-grow">
              {isValidValue(marketAnalysis.nearestUrbanCenter) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Building className="h-3 w-3 mr-1" />
                    <span>Nearest Urban Center</span>
                  </div>
                  <p className="text-xl font-bold">
                    {marketAnalysis.nearestUrbanCenter}
                  </p>
                </div>
              )}

              {isValidValue(marketAnalysis.populationGrowthRate) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Population Growth Rate</span>
                  </div>
                  <p className="text-xl font-bold">
                    {marketAnalysis.populationGrowthRate}
                  </p>
                </div>
              )}

              {isValidValue(marketAnalysis.medianHouseholdIncome) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>Median Household Income</span>
                  </div>
                  <p className="text-xl font-bold">
                    {marketAnalysis.medianHouseholdIncome}
                  </p>
                </div>
              )}

              {isValidValue(marketAnalysis.unemploymentRate) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Unemployment Rate</span>
                  </div>
                  <p className="text-xl font-bold">
                    {marketAnalysis.unemploymentRate}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Lease Analysis */}
        {leaseAnalysis && (
          <Card className="p-4 h-full w-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-orange-600">
                Lease Analysis
              </h4>
              {leaseAnalysis.source && (
                <SourceLink 
                  source={leaseAnalysis.source}
                  label="Lease Analysis"
                  onViewPDF={onViewPDF}
                />
              )}
            </div>

            <div className="space-y-4 flex-grow">
              {isValidValue(leaseAnalysis.rentPSF) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    <span>Rent PSF</span>
                  </div>
                  <p className="text-xl font-bold">
                    {leaseAnalysis.rentPSF}
                  </p>
                </div>
              )}

              {isValidValue(leaseAnalysis.WALT) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>WALT</span>
                  </div>
                  <p className="text-xl font-bold">
                    {leaseAnalysis.WALT}
                  </p>
                </div>
              )}

              {isValidValue(leaseAnalysis.rentEscalations) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Percent className="h-3 w-3 mr-1" />
                    <span>Rent Escalations</span>
                  </div>
                  <p className="text-xl font-bold">
                    {leaseAnalysis.rentEscalations}
                  </p>
                </div>
              )}

              {isValidValue(leaseAnalysis.markToMarketOpportunity) && (
                <div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <Target className="h-3 w-3 mr-1" />
                    <span>Mark-to-Market Opportunity</span>
                  </div>
                  <p className="text-xl font-bold">
                    {leaseAnalysis.markToMarketOpportunity}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 