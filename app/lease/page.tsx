"use client";
import { FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaseAbstract from "./lease-abstract";
import LeaseCharts from "./lease-charts";
import LeaseNews from "./lease-news";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDoc from "@/components/summary-pdf";
import { useEffect, useState } from "react";
import { useLeaseStore } from "@/store/leaseStore";
import { useRouter } from "next/navigation";
import EnhancedPDFCSVViewer from "@/components/PDFViewer";


export default function LeasePage() {
  const [isClient, setIsClient] = useState(false);
  const { leaseData } = useLeaseStore();
  const router = useRouter();
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [currentPdfTitle, setCurrentPdfTitle] = useState("");
  const [currentStartPosition, setCurrentStartPosition] = useState<number>();
  const [currentEndPosition, setCurrentEndPosition] = useState<number>();
  const [highlightText, setHighlightText] = useState<string>("");

  const pdfUrl = "https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/15158e48-3fc7-4020-b30e-64b0f98cb8e5-280+Richards+-+OM.pdf";

  useEffect(() => {
    setIsClient(true);
    if (
      !leaseData ||
      !leaseData.tenant ||
      Object.keys(leaseData).length === 0
    ) {
      //  If No data found then redirect to deal-overview page for uploading data
      router.push("/deal-overview");
    }
  }, [leaseData, router]);

  const handleViewPDF = (pageNumber: number, title: string, startPosition?: number, endPosition?: number, sourceText?: string) => {
    console.log("Opening PDF Viewer:", { pageNumber, title, startPosition, endPosition });
    setCurrentPdfPage(pageNumber);
    setCurrentPdfTitle(title);
    setPdfModalOpen(true);
    setCurrentStartPosition(startPosition);
    setCurrentEndPosition(endPosition);
    if (sourceText) {
      console.log("Setting highlight text:", sourceText);
      setHighlightText(sourceText);
    }
  };

  if (!isClient || !leaseData || !leaseData.tenant) {
    return null;
  }

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
              <EnhancedPDFCSVViewer 
                fileUrl={pdfUrl}
                pageNumber={currentPdfPage}
                highlightText={highlightText}
              />
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lease Abstract</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-32 h-32 rounded-md overflow-hidden">
              <Image
                src="/main-image.png"
                alt="280 Richards"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {leaseData.marketComparison?.subjectProperty.name ||
                  "Property Name"}
              </h2>
              <p className="text-sm text-gray-500">Date Updated: 10/05/2024</p>
              <p className="text-sm text-gray-500">
                {leaseData.tenant?.industry || "Industry"}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <Button
              variant="outline"
              className="w-full md:w-auto bg-black text-white hover:bg-black/80 hover:text-white"
            >
              <FileText size={16} className="mr-2" />
              {isClient ? (
                <PDFDownloadLink
                  document={<MyDoc />}
                  fileName="lease-summary.pdf"
                  className=""
                >
                  {({ loading }) =>
                    loading ? "Preparing document..." : "Export Summary PDF"
                  }
                </PDFDownloadLink>
              ) : null}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <LeaseAbstract onViewPDF={handleViewPDF} />
          </TabsContent>
          <TabsContent value="analytics">
            <LeaseCharts onViewPDF={handleViewPDF} />
          </TabsContent>
          <TabsContent value="news">
            <LeaseNews onViewPDF={handleViewPDF} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
