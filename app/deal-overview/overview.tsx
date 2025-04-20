"use client";
import {
  Building,
  Calendar,
  Clock,
  Columns,
  DollarSign,
  Home,
  Layers,
  MapPin,
  Maximize,
  Percent,
  PieChart,
  SquareStack,
  Target,
  Truck,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useDealOverviewStore } from "@/store/dealStrore";
import DealOverviewSkeleton from "./skeleton";

const isValidValue = (value: any): boolean => {
  return (
    value !== "N/A" &&
    value !== "NA" &&
    value !== null &&
    value !== undefined &&
    value !== ""
  );
};

export default function DealOverview() {
  const { dealData, isDataLoaded} = useDealOverviewStore();

  if(!isDataLoaded) {
    return <div><DealOverviewSkeleton /></div>
  }

  console.log("Deal Data:", dealData);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Deal Overview</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Image and Details */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="relative rounded-lg overflow-hidden border">
                  <Image
                    src="/main-image.png"
                    alt="Property Image"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                {isValidValue(dealData.dealOverview?.propertyName) &&
                  isValidValue(dealData.dealOverview?.location) && (
                    <h2 className="text-xl font-bold">
                      {dealData.dealOverview?.propertyName},{" "}
                      {dealData.dealOverview?.location}
                    </h2>
                  )}
                {isValidValue(dealData.dealOverview?.dateUploaded) && (
                  <p className="text-sm text-gray-600 mt-1">
                    Date Uploaded: {dealData.dealOverview?.dateUploaded}
                  </p>
                )}
                {isValidValue(dealData.dealOverview?.propertyType) && (
                  <p className="text-sm text-gray-600">
                    {dealData.dealOverview?.propertyType}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {isValidValue(dealData.dealOverview?.seller) && (
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Users className="h-3 w-3 mr-1" />
                        <span>Seller</span>
                      </div>
                      <p className="text-sm">{dealData.dealOverview?.seller}</p>
                    </div>
                  )}
                  {isValidValue(dealData.dealOverview?.guidancePrice) && (
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>Guidance Price</span>
                      </div>
                      <p className="text-sm">
                        {dealData.dealOverview?.guidancePrice}
                      </p>
                    </div>
                  )}
                  {isValidValue(dealData.dealOverview?.guidancePricePSF) && (
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>Guidance Price PSF</span>
                      </div>
                      <p className="text-sm">
                        {dealData.dealOverview?.guidancePricePSF}
                      </p>
                    </div>
                  )}
                  {isValidValue(dealData.dealOverview?.capRate) && (
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Percent className="h-3 w-3 mr-1" />
                        <span>Cap Rate</span>
                      </div>
                      <p className="text-sm">
                        {dealData.dealOverview?.capRate}
                      </p>
                    </div>
                  )}
                  {isValidValue(dealData.dealOverview?.propertySize) && (
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Maximize className="h-3 w-3 mr-1" />
                        <span>Property Size</span>
                      </div>
                      <p className="text-sm">
                        {dealData.dealOverview?.propertySize}
                      </p>
                    </div>
                  )}
                  {isValidValue(dealData.dealOverview?.landArea) && (
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Layers className="h-3 w-3 mr-1" />
                        <span>Land Area</span>
                      </div>
                      <p className="text-sm">
                        {dealData.dealOverview?.landArea}
                      </p>
                    </div>
                  )}
                  {isValidValue(dealData.dealOverview?.zoning) && (
                    <div className="flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>Zoning</span>
                      </div>
                      <p className="text-sm">{dealData.dealOverview?.zoning}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Deal Summary */}
            {isValidValue(dealData.dealSummary?.text) && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Deal Summary</h3>
                <p className="text-sm leading-relaxed">
                  {dealData.dealSummary?.text}
                </p>
              </div>
            )}

            {/* Personalized Insights */}
            {dealData.personalizedInsights &&
              dealData.personalizedInsights.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-3">
                    Personalized Insights
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                    {dealData.personalizedInsights.map(
                      (insight, index) =>
                        isValidValue(insight) && <li key={index}>{insight}</li>
                    )}
                  </ul>
                </div>
              )}

            {/* Analysis Sections */}
            <div className="mt-8 w-full">
              <h3 className="text-lg font-medium mb-4">Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {/* Projected Financial Metrics */}
                {(isValidValue(dealData.projectedFinancialMetrics?.IRR) ||
                  isValidValue(
                    dealData.projectedFinancialMetrics?.equityMultiple
                  ) ||
                  isValidValue(
                    dealData.projectedFinancialMetrics?.returnOnEquity
                  ) ||
                  isValidValue(
                    dealData.projectedFinancialMetrics?.returnOnCost
                  )) && (
                  <Card className="p-4 h-full w-full flex flex-col">
                    <h4 className="text-base font-medium mb-4 text-blue-600">
                      Projected Financial Metrics
                    </h4>

                    <div className="space-y-4 flex-grow">
                      {isValidValue(
                        dealData.projectedFinancialMetrics?.IRR
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <PieChart className="h-3 w-3 mr-1" />
                            <span>IRR</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.projectedFinancialMetrics?.IRR}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.projectedFinancialMetrics?.equityMultiple
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Target className="h-3 w-3 mr-1" />
                            <span>Equity Multiple</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.projectedFinancialMetrics?.equityMultiple}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.projectedFinancialMetrics?.returnOnEquity
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Percent className="h-3 w-3 mr-1" />
                            <span>Return on Equity</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.projectedFinancialMetrics?.returnOnEquity}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.projectedFinancialMetrics?.returnOnCost
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>Return on Cost</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.projectedFinancialMetrics?.returnOnCost}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Key Assumptions */}
                {(isValidValue(dealData.keyAssumptions?.exitPrice) ||
                  isValidValue(dealData.keyAssumptions?.exitCapRate) ||
                  isValidValue(dealData.keyAssumptions?.rentalGrowth) ||
                  isValidValue(dealData.keyAssumptions?.holdPeriod)) && (
                  <Card className="p-4 h-full w-full flex flex-col">
                    <h4 className="text-base font-medium mb-4 text-green-600">
                      Key Assumptions
                    </h4>

                    <div className="space-y-4 flex-grow">
                      {isValidValue(dealData.keyAssumptions?.exitPrice) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>Exit Price</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.keyAssumptions?.exitPrice}
                          </p>
                        </div>
                      )}

                      {isValidValue(dealData.keyAssumptions?.exitCapRate) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Percent className="h-3 w-3 mr-1" />
                            <span>Exit Cap Rate</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.keyAssumptions?.exitCapRate}
                          </p>
                        </div>
                      )}

                      {isValidValue(dealData.keyAssumptions?.rentalGrowth) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Target className="h-3 w-3 mr-1" />
                            <span>Rental Growth</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.keyAssumptions?.rentalGrowth}
                          </p>
                        </div>
                      )}

                      {isValidValue(dealData.keyAssumptions?.holdPeriod) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Hold Period</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.keyAssumptions?.holdPeriod}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Market Analysis */}
                {(isValidValue(dealData.marketAnalysis?.nearestUrbanCenter) ||
                  isValidValue(dealData.marketAnalysis?.populationGrowthRate) ||
                  isValidValue(
                    dealData.marketAnalysis?.medianHouseholdIncome
                  ) ||
                  isValidValue(dealData.marketAnalysis?.unemploymentRate)) && (
                  <Card className="p-4 h-full w-full flex flex-col">
                    <h4 className="text-base font-medium mb-4 text-purple-600">
                      Market Analysis
                    </h4>

                    <div className="space-y-4 flex-grow">
                      {isValidValue(
                        dealData.marketAnalysis?.nearestUrbanCenter
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Building className="h-3 w-3 mr-1" />
                            <span>Nearest Urban Center</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.marketAnalysis?.nearestUrbanCenter}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.marketAnalysis?.populationGrowthRate
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Users className="h-3 w-3 mr-1" />
                            <span>Population Growth Rate</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.marketAnalysis?.populationGrowthRate}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.marketAnalysis?.medianHouseholdIncome
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>Median Household Income</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.marketAnalysis?.medianHouseholdIncome}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.marketAnalysis?.unemploymentRate
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Users className="h-3 w-3 mr-1" />
                            <span>Unemployment Rate</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.marketAnalysis?.unemploymentRate}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Lease Analysis */}
                {(isValidValue(dealData.leaseAnalysis?.rentPSF) ||
                  isValidValue(dealData.leaseAnalysis?.WALT) ||
                  isValidValue(dealData.leaseAnalysis?.rentEscalations) ||
                  isValidValue(
                    dealData.leaseAnalysis?.markToMarketOpportunity
                  )) && (
                  <Card className="p-4 h-full w-full flex flex-col">
                    <h4 className="text-base font-medium mb-4 text-orange-600">
                      Lease Analysis
                    </h4>

                    <div className="space-y-4 flex-grow">
                      {isValidValue(dealData.leaseAnalysis?.rentPSF) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span>Rent PSF</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.leaseAnalysis?.rentPSF}
                          </p>
                        </div>
                      )}

                      {isValidValue(dealData.leaseAnalysis?.WALT) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>WALT</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.leaseAnalysis?.WALT}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.leaseAnalysis?.rentEscalations
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Percent className="h-3 w-3 mr-1" />
                            <span>Rent Escalations</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.leaseAnalysis?.rentEscalations}
                          </p>
                        </div>
                      )}

                      {isValidValue(
                        dealData.leaseAnalysis?.markToMarketOpportunity
                      ) && (
                        <div>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Target className="h-3 w-3 mr-1" />
                            <span>Mark-to-Market Opportunity</span>
                          </div>
                          <p className="text-xl font-bold">
                            {dealData.leaseAnalysis?.markToMarketOpportunity}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Asset Level Data */}
          {(isValidValue(dealData.assetLevelData?.clearHeights) ||
            isValidValue(dealData.assetLevelData?.tenant) ||
            isValidValue(dealData.assetLevelData?.columnSpacing) ||
            isValidValue(dealData.assetLevelData?.seawardArea) ||
            isValidValue(dealData.assetLevelData?.parkingSpaces) ||
            isValidValue(dealData.assetLevelData?.yearBuilt) ||
            isValidValue(dealData.assetLevelData?.dockDoors) ||
            isValidValue(dealData.assetLevelData?.occupancyRate)) && (
            <div className="lg:col-span-1">
              <Card className="p-6 h-full sm:h-1/2 md:h-full">
                <h3 className="text-lg font-medium mb-6">Asset-Level Data</h3>

                <div className="space-y-6">
                  {(isValidValue(dealData.assetLevelData?.clearHeights) ||
                    isValidValue(dealData.assetLevelData?.tenant)) && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        {isValidValue(
                          dealData.assetLevelData?.clearHeights
                        ) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            <span>Clear Heights</span>
                          </div>
                        )}
                        {isValidValue(dealData.assetLevelData?.tenant) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>Tenant</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        {isValidValue(
                          dealData.assetLevelData?.clearHeights
                        ) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.clearHeights}
                          </p>
                        )}
                        {isValidValue(dealData.assetLevelData?.tenant) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.tenant}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(isValidValue(dealData.assetLevelData?.columnSpacing) ||
                    isValidValue(dealData.assetLevelData?.seawardArea)) && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        {isValidValue(
                          dealData.assetLevelData?.columnSpacing
                        ) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Columns className="h-4 w-4 mr-2" />
                            <span>Column Spacing</span>
                          </div>
                        )}
                        {isValidValue(dealData.assetLevelData?.seawardArea) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>Seaward Area</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        {isValidValue(
                          dealData.assetLevelData?.columnSpacing
                        ) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.columnSpacing}
                          </p>
                        )}
                        {isValidValue(dealData.assetLevelData?.seawardArea) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.seawardArea}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(isValidValue(dealData.assetLevelData?.parkingSpaces) ||
                    isValidValue(dealData.assetLevelData?.yearBuilt)) && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        {isValidValue(
                          dealData.assetLevelData?.parkingSpaces
                        ) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <SquareStack className="h-4 w-4 mr-2" />
                            <span>Parking Spaces</span>
                          </div>
                        )}
                        {isValidValue(dealData.assetLevelData?.yearBuilt) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Year Built</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        {isValidValue(
                          dealData.assetLevelData?.parkingSpaces
                        ) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.parkingSpaces}
                          </p>
                        )}
                        {isValidValue(dealData.assetLevelData?.yearBuilt) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.yearBuilt}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {(isValidValue(dealData.assetLevelData?.dockDoors) ||
                    isValidValue(dealData.assetLevelData?.occupancyRate)) && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        {isValidValue(dealData.assetLevelData?.dockDoors) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Truck className="h-4 w-4 mr-2" />
                            <span># of Dock Doors</span>
                          </div>
                        )}
                        {isValidValue(
                          dealData.assetLevelData?.occupancyRate
                        ) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Home className="h-4 w-4 mr-2" />
                            <span>Occupancy Rate</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        {isValidValue(dealData.assetLevelData?.dockDoors) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.dockDoors}
                          </p>
                        )}
                        {isValidValue(
                          dealData.assetLevelData?.occupancyRate
                        ) && (
                          <p className="text-xl font-bold">
                            {dealData.assetLevelData?.occupancyRate}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
