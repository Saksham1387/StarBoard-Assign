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
import { useFileStore } from "@/store/fielStore";

export default function DealOverviewPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);
  const { setLeaseData } = useLeaseStore();
  const {setMultipleFileData} = useFileStore();
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

  const uploadFileToS3 = async (file: File) => {
    const filename = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type);

    const { data: s3Data } = await axios.get(
      `/api/get-upload-url?filename=${filename}&fileType=${fileType}`
    );

    await axios.put(s3Data.uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return s3Data.fileUrl;
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const otherFiles = files.filter((file) => file.type !== "application/pdf");
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    setSending(true);
    setFiles(files);
    setProgress(0);

    let currentProjectId = null;
    let uploadedFileData: Array<{fileName: string, fileUrl: string}> = [];

    try {
      // Upload all files to S3 first
      const allFiles = [...otherFiles, ...pdfFiles];
      for (let i = 0; i < allFiles.length; i++) {
        const file = allFiles[i];
        const fileUrl = await uploadFileToS3(file);
        uploadedFileData.push({
          fileName: file.name,
          fileUrl: fileUrl
        });
        setProgress(20 + (i + 1) * (40 / allFiles.length));
      }

      try {
        // First handle other files and get project ID
        if (otherFiles.length > 0) {
          // Upload other files to S3
          const fileUrls = await Promise.all(
            otherFiles.map(async (file, index) => {
              const url = await uploadFileToS3(file);
              setProgress(20 + (index + 1) * (20 / otherFiles.length));
              return url;
            })
          );
  
          // Send to processing endpoint
          const processResponse = await axios.post("http://13.233.158.171:8000/process", {
            user_id: "user123",
            file_urls: fileUrls,
          });
  
          currentProjectId = processResponse.data.project_id;
          console.log("This is the coming projects ID:", currentProjectId);
  
          setProjectId(currentProjectId);
          setProgress(50);
        }
      }catch (error) {
        console.error("Error processing other files:", error);
        setSending(false);
        return;
      }

      // Handle PDF files
      if (pdfFiles.length > 0) {
        for (const pdfFile of pdfFiles) {
          // Find the uploaded PDF URL
          const pdfFileData = uploadedFileData.find(fileData => 
            fileData.fileName === pdfFile.name && fileData.fileName.endsWith('.pdf')
          );
          
          // Get CSV URLs from uploaded files
          const csvUrls = uploadedFileData
            .filter(fileData => fileData.fileName.endsWith('.csv'))
            .map(fileData => fileData.fileUrl);

          const res = await axios.post("/api/parse-pdf-gemini", {
            pdfUrl: pdfFileData?.fileUrl,
            csvUrls: csvUrls
          });

          console.log("Response:", res.data);

          setLeaseData(res.data.data.tenantData);
          
          // Add PDF URL to the file data array
          const fileDataWithPdf = [
            ...uploadedFileData,
            {
              fileName: "pdf",
              fileUrl: pdfFileData?.fileUrl || ""
            }
          ];
          
          setMultipleFileData(fileDataWithPdf);
          
          const dealData1 = {
            ...res.data.data.leaseData,
            projectId: currentProjectId,
          };

          setDealData(dealData1);
          setProgress(100);
          setSending(false);

          // Redirect only after PDF parsing is complete
          router.push("/lease");
        }
      } else if (otherFiles.length > 0) {
        // If only other files were uploaded (no PDFs), complete the process
        setMultipleFileData(uploadedFileData);
        setProgress(100);
        setSending(false);
      }
    } catch (error) {
      console.error("Error processing files:", error);
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
                  {progress < 20
                    ? `Uploading ${files.length} files to S3...`
                    : progress < 60
                    ? "Uploading files to S3..."
                    : "Parsing PDF..."}
                </p>
                <p className="text-xs text-gray-500">
                  *This may take a while, depends on the processing time
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