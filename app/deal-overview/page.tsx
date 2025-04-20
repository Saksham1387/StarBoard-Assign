"use client";
import { FileUpload } from "@/components/ui/file-upload";
import { Progress } from "@/components/ui/progress";
import { useLeaseStore } from "@/store/leaseStore";
import axios from "axios";
import { useState, useEffect } from "react";
import DealOverview from "./overview";
import { useDealOverviewStore } from "@/store/dealStrore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DealOverviewPage() {
  const [files, setFiles] = useState<File[]>();
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setLeaseData } = useLeaseStore();
  const { setDealData, dealData, isDataLoaded } = useDealOverviewStore();
  const [showUploader, setShowUploader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasNoData = !isDataLoaded || !dealData.dealOverview?.propertyName;
    setShowUploader(hasNoData);
  }, [dealData, isDataLoaded]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (sending) {
      setProgress(0);

      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          const increment = Math.max(0.5, 5 * (1 - prevProgress / 95));
          const newProgress = Math.min(95, prevProgress + increment);
          return newProgress;
        });
      }, 300);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);

      if (!sending) setProgress(100);
    };
  }, [sending]);

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    setSending(true);
    setFiles(files);

    try {
      const file = files[0];
      const filename = encodeURIComponent(file.name);
      const fileType = encodeURIComponent(file.type);

      const { data: s3Data } = await axios.get(
        `/api/get-upload-url?filename=${filename}&fileType=${fileType}`
      );

      await axios.put(s3Data.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 40) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      const res = await axios.post("/api/parse-pdf-openai", {
        pdfUrl: s3Data.fileUrl,
      });

      console.log("Response:", res.data);

      setProgress(100);
      setTimeout(() => {
        setSending(false);
      }, 500);

      setLeaseData(res.data.data.tenantData);
      setDealData(res.data.data.dealData);
      router.push("/lease");
    } catch (error) {
      console.error("Error uploading file:", error);
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {sending ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="space-y-2 pt-32">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {progress < 40 ? "Uploading to S3..." : "Processing PDF..."}
                </p>
                <p className="text-xs text-gray-500">
                  *This may take a while, depends on the LLM response
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {Math.round(progress)}%
                </p>
              </div>
            </div>
          </div>
        ) : showUploader ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onChange={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-end justify-end flex-col">
              <Button
                onClick={() => {
                  setShowUploader(true);
                }}
                className="w-full sm:w-auto bg-black text-white hover:bg-black/80 hover:text-white"
              >
                Upload New PDF
              </Button>
              <p className="text-xs text-gray-500 pt-2">
                * This is just for demo
              </p>
            </div>
            <DealOverview />
          </div>
        )}
      </div>
    </div>
  );
}
