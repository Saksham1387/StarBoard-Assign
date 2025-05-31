"use client";
import { useState } from "react";
import { useDealOverviewStore } from "@/store/dealStrore";
import DealOverviewSkeleton from "./skeleton";
import { PDFViewerExample } from "../../components/PDFViewer";
import { PropertyHeader } from "./components/PropertyHeader";
import { DealSummary } from "./components/DealSummary";
import { PersonalizedInsights } from "./components/PersonalizedInsights";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { AssetLevelData } from "./components/AssetLevelData";
import { ChatBot } from "./components/ChatBot";

export interface Source {
  page_no: number;
  start_position: number;
  text_in_the_pdf:string
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
  const [highlightText, setHighlightText] = useState<string>("");

  const pdfUrl = "https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/15158e48-3fc7-4020-b30e-64b0f98cb8e5-280+Richards+-+OM.pdf";

  // console.log("Deal Data:", dealData);
  if (!isDataLoaded || !dealData) {
    return <div><DealOverviewSkeleton /></div>;
  }

  const handleViewPDF = (pageNumber: number, title: string, startPosition?: number, endPosition?: number, sourceText?: string) => {
    console.log("Opening PDF Viewer:", { pageNumber, title, startPosition, endPosition });
    setCurrentPdfPage(pageNumber);
    setCurrentPdfTitle(title);
    setPdfModalOpen(true);
    setCurrentStartPosition(startPosition);
    setCurrentEndPosition(endPosition);
    if (sourceText) {
      setHighlightText(sourceText);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* PDF Viewer Modal */}
      {pdfModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed left-0 top-0 h-full w-4/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">{currentPdfTitle}</h3>
              <button 
                onClick={() => setPdfModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-[calc(100%-4rem)] overflow-auto">
              <PDFViewerExample 
                fileUrl={pdfUrl}
                pageNumber={currentPdfPage}
                highlightText={highlightText}
              />
            </div>
          </div>
        </div>
      )}

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

      {/* ChatBot */}
      <ChatBot projectId={dealData.projectId!} />
    </div>
  );
}