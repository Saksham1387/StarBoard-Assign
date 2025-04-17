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

export default function LeasePage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="min-h-screen bg-white">
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
                280 Richards, Brooklyn, NY
              </h2>
              <p className="text-sm text-gray-500">Date Updated: 10/05/2024</p>
              <p className="text-sm text-gray-500">Warehouse</p>
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
            <LeaseAbstract />
          </TabsContent>
          <TabsContent value="analytics">
            <LeaseCharts />
          </TabsContent>
          <TabsContent value="news">
            <LeaseNews />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
