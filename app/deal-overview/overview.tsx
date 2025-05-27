"use client";
import { useState } from "react";
import { useDealOverviewStore } from "@/store/dealStrore";
import DealOverviewSkeleton from "./skeleton";
import { PDFViewerModal } from "./components/PDFViewerModal";
import { PropertyHeader } from "./components/PropertyHeader";
import { DealSummary } from "./components/DealSummary";
import { PersonalizedInsights } from "./components/PersonalizedInsights";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { AssetLevelData } from "./components/AssetLevelData";

export interface Source {
  page_no: number;
  start_position: number;
  end_position: number;
}

interface DealOverview {
  source?: Source;
  propertyName?: string;
  location?: string;
  dateUploaded?: string;
  propertyType?: string;
  seller?: string;
  guidancePrice?: string;
  guidancePricePSF?: string;
  capRate?: string;
  propertySize?: string;
  landArea?: string;
  zoning?: string;
  underwritingModel?: string;
}

interface DealSummary {
  source?: Source;
  text?: string;
}

interface AssetLevelData {
  source?: Source;
  tenant?: string;
  clearHeights?: string;
  columnSpacing?: string;
  parkingSpaces?: number;
  dockDoors?: number;
  seawardArea?: string;
  yearBuilt?: number;
  occupancyRate?: string;
}

export default function DealOverview() {
  const { dealData, isDataLoaded } = useDealOverviewStore();
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [currentPdfTitle, setCurrentPdfTitle] = useState("");
  const [currentStartPosition, setCurrentStartPosition] = useState<number>();
  const [currentEndPosition, setCurrentEndPosition] = useState<number>();
  
  const pdfUrl = "https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/ab85ea96-1cf3-4caa-bf8c-829fbac7b083-280%20Richards%20-%20OM.pdf";

  console.log("Deal Data:", dealData);
  if (!isDataLoaded || !dealData) {
    return <div><DealOverviewSkeleton /></div>;
  }

  const handleViewPDF = (pageNumber: number, title: string, startPosition?: number, endPosition?: number) => {
    console.log("Opening PDF Viewer:", { pageNumber, title, startPosition, endPosition });
    setCurrentPdfPage(pageNumber);
    setCurrentPdfTitle(title);
    setCurrentStartPosition(startPosition);
    setCurrentEndPosition(endPosition);
    setPdfModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* PDF Viewer Modal */}
      <PDFViewerModal 
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        pdfUrl={pdfUrl}
        pageNumber={currentPdfPage}
        title={currentPdfTitle}
        startPosition={currentStartPosition}
        endPosition={currentEndPosition}
      />

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
            {dealData.dealOverview && (
              <PropertyHeader 
                dealOverview={dealData.dealOverview}
                onViewPDF={handleViewPDF}
              />
            )}

            {dealData.dealSummary && dealData.dealSummary.text && (
              <DealSummary 
                text={dealData.dealSummary.text}
                source={dealData.dealSummary.source}
                onViewPDF={handleViewPDF}
              />
            )}

            {dealData.personalizedInsights && (
              <PersonalizedInsights 
                insights={dealData.personalizedInsights}
              />
            )}

            {(dealData.projectedFinancialMetrics || 
              dealData.keyAssumptions || 
              dealData.marketAnalysis || 
              dealData.leaseAnalysis) && (
              <AnalyticsSection 
                projectedFinancialMetrics={dealData.projectedFinancialMetrics}
                keyAssumptions={dealData.keyAssumptions}
                marketAnalysis={dealData.marketAnalysis}
                leaseAnalysis={dealData.leaseAnalysis}
                onViewPDF={handleViewPDF}
              />
            )}
          </div>

          {/* Right Column - Asset Level Data */}
          {dealData.assetLevelData && (
            <AssetLevelData 
              data={dealData.assetLevelData}
              onViewPDF={handleViewPDF}
            />
          )}
        </div>
      </div>
    </div>
  );
}