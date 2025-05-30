// "use client";
// import { FileUpload } from "@/components/ui/file-upload";
// import { Progress } from "@/components/ui/progress";
// import { useLeaseStore } from "@/store/leaseStore";
// import axios from "axios";
// import { useState, useEffect, useRef } from "react";
// import DealOverview from "./overview";
// import { useDealOverviewStore } from "@/store/dealStrore";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export default function DealOverviewPage() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [sending, setSending] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [projectId, setProjectId] = useState<string | null>(null);
//   const { setLeaseData } = useLeaseStore();
//   const { setDealData, dealData, isDataLoaded } = useDealOverviewStore();
//   const [showUploader, setShowUploader] = useState(false);
//   const router = useRouter();
  
//   // Use ref to track polling status
//   const pollingRef = useRef<{ isActive: boolean; timeoutId?: NodeJS.Timeout }>({ 
//     isActive: false 
//   });

//   useEffect(() => {
//     const hasNoData = !isDataLoaded || !dealData.dealOverview?.propertyName;
//     setShowUploader(hasNoData);
//   }, [dealData, isDataLoaded]);

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;

//     if (sending) {
//       setProgress(0);

//       intervalId = setInterval(() => {
//         setProgress((prevProgress) => {
//           const increment = Math.max(0.5, 5 * (1 - prevProgress / 95));
//           const newProgress = Math.min(95, prevProgress + increment);
//           return newProgress;
//         });
//       }, 300);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//       if (!sending) setProgress(100);
//     };
//   }, [sending]);

//   // Cleanup polling on unmount
//   useEffect(() => {
//     return () => {
//       if (pollingRef.current.timeoutId) {
//         clearTimeout(pollingRef.current.timeoutId);
//       }
//       pollingRef.current.isActive = false;
//     };
//   }, []);

//   const uploadFileToS3 = async (file: File) => {
//     const filename = encodeURIComponent(file.name);
//     const fileType = encodeURIComponent(file.type);

//     const { data: s3Data } = await axios.get(
//       `/api/get-upload-url?filename=${filename}&fileType=${fileType}`
//     );

//     await axios.put(s3Data.uploadUrl, file, {
//       headers: {
//         "Content-Type": file.type,
//       },
//     });

//     return s3Data.fileUrl;
//   };

//   const pollForResults = async (projectId: string): Promise<boolean> => {
//     try {
//       const statusResponse = await axios.get(`http://localhost:8000/status/${projectId}`);

//       if (statusResponse.data.status === "completed") {
//         // Stop polling and navigate
//         const nowData = {
//           ...dealData,
//           projectId
//         }
//         setDealData(nowData);
      
        
//         pollingRef.current.isActive = false;
//         setProgress(100);
//         setSending(false);
        
//         // Navigate after a short delay to ensure state updates
//         // setTimeout(() => {
//         //   router.push("/lease");
//         // }, 100);
        
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("Error polling for results:", error);
//       return false;
//     }
//   };

//   const startPolling = (projectId: string) => {
//     // Stop any existing polling
//     if (pollingRef.current.timeoutId) {
//       clearTimeout(pollingRef.current.timeoutId);
//     }
    
//     pollingRef.current.isActive = true;
    
//     const poll = async () => {
//       if (!pollingRef.current.isActive) return;
      
//       try {
//         const isComplete = await pollForResults(projectId);
        
//         if (!isComplete && pollingRef.current.isActive) {
//           // Schedule next poll
//           pollingRef.current.timeoutId = setTimeout(poll, 5000);
//         }
//       } catch (error) {
//         console.error("Error polling for results:", error);
//         if (pollingRef.current.isActive) {
//           // Retry on error
//           pollingRef.current.timeoutId = setTimeout(poll, 5000);
//         }
//       }
//     };

//     // Start first poll
//     poll();
//   };

//   const handleFileUpload = async (files: File[]) => {
//     if (!files || files.length === 0) return;
//     const otherFiles = files.filter(file => file.type !== 'application/pdf');

//     // Stop any existing polling
//     pollingRef.current.isActive = false;
//     if (pollingRef.current.timeoutId) {
//       clearTimeout(pollingRef.current.timeoutId);
//     }

//     setSending(true);
//     setFiles(files);
//     setProgress(0);

//     try {
//       // First handle other files and get project ID
//       if (otherFiles.length > 0) {
//         // Upload other files to S3
//         const fileUrls = await Promise.all(
//           otherFiles.map(async (file, index) => {
//             const url = await uploadFileToS3(file);
//             setProgress(40 + (index + 1) * (40 / otherFiles.length));
//             return url;
//           })
//         );

//         // Send to processing endpoint
//         const processResponse = await axios.post("http://localhost:8000/process", {
//           user_id: "user123",
//           file_urls: fileUrls,
//         });

//         const projectId1 = processResponse.data.project_id;
//         console.log("THis is the the coming projects ID:", projectId1);

//         setProjectId(projectId1);
//         setProgress(90);

//         // Start polling
//         // startPolling(projectId);
//       }

//       // Handle PDF files
//       const pdfFiles = files.filter(file => file.type === 'application/pdf');
//       if (pdfFiles.length > 0) {
//         for (const pdfFile of pdfFiles) {
//           const url = await uploadFileToS3(pdfFile);
//           setProgress(40);
          
//           const res = await axios.post("/api/parse-pdf-gemini", {
//             pdfUrl: url,
//           });

//           console.log("Response:", res.data);

//           setLeaseData(res.data.data.tenantData);
//           const dealData1 = {
//             ...res.data.data.leaseData,
//             projectId: projectId // Include project ID in dealData
//           }
//           setDealData(dealData1);
//           router.push("/lease");
//         }
//       }

//       if (otherFiles.length === 0) {
//         setProgress(100);
//         setSending(false);
//       }

//     } catch (error) {
//       console.error("Error processing files:", error);
//       setSending(false);
//       pollingRef.current.isActive = false;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {sending ? (
//           <div className="max-w-2xl mx-auto space-y-4">
//             <div className="space-y-2 pt-32">
//               <Progress value={progress} className="h-2" />
//               <div className="flex justify-between items-center">
//                 <p className="text-sm text-gray-500">
//                   {progress < 40 
//                     ? `Uploading ${files.length} files to S3...` 
//                     : progress < 50 
//                     ? "Starting processing..." 
//                     : "Processing files..."}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   *This may take a while, depends on the processing time
//                 </p>
//                 <p className="text-sm font-medium text-gray-700">
//                   {Math.round(progress)}%
//                 </p>
//               </div>
//             </div>
//           </div>
//         ) : showUploader ? (
//           <div className="max-w-2xl mx-auto">
//             <FileUpload onChange={handleFileUpload} />
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-end justify-end flex-col">
//               <Button
//                 onClick={() => {
//                   setShowUploader(true);
//                 }}
//                 className="w-full sm:w-auto bg-black text-white hover:bg-black/80 hover:text-white"
//               >
//                 Upload New PDF
//               </Button>
//               <p className="text-xs text-gray-500 pt-2">
//                 * This is just for demo
//               </p>
//             </div>
//             <DealOverview />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import { FileUpload } from "@/components/ui/file-upload";
import { Progress } from "@/components/ui/progress";
import { useLeaseStore } from "@/store/leaseStore";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import DealOverview from "./overview";
import { useDealOverviewStore } from "@/store/dealStrore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DealOverviewPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);
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
    const otherFiles = files.filter(file => file.type !== 'application/pdf');
    const pdfFiles = files.filter(file => file.type === 'application/pdf');

    setSending(true);
    setFiles(files);
    setProgress(0);

    let currentProjectId = null;

    try {
      // First handle other files and get project ID
      // if (otherFiles.length > 0) {
      //   // Upload other files to S3
      //   const fileUrls = await Promise.all(
      //     otherFiles.map(async (file, index) => {
      //       const url = await uploadFileToS3(file);
      //       setProgress(20 + (index + 1) * (20 / otherFiles.length));
      //       return url;
      //     })
      //   );

      //   // Send to processing endpoint
      //   const processResponse = await axios.post("http://43.205.239.14:8000/process", {
      //     user_id: "user123",
      //     file_urls: fileUrls,
      //   });

      //   currentProjectId = processResponse.data.project_id;
      //   console.log("This is the coming projects ID:", currentProjectId);

      //   setProjectId(currentProjectId);
      //   setProgress(50);
      // }

      // Handle PDF files
      if (pdfFiles.length > 0) {
        for (const pdfFile of pdfFiles) {
          const url = await uploadFileToS3(pdfFile);
          setProgress(60);
          
          const res = await axios.post("/api/parse-pdf-gemini", {
            pdfUrl: url,
          });

          console.log("Response:", res.data);

          setLeaseData(res.data.data.tenantData);
          
          // Set dealData with projectId included
          const dealData1 = {
            ...res.data.data.leaseData,
            projectId: currentProjectId // Use the projectId we got earlier
          };
          
          setDealData(dealData1);
          setProgress(100);
          setSending(false);
          
          // Redirect only after PDF parsing is complete
          router.push("/lease");
        }
      } else if (otherFiles.length > 0) {
        // If only other files were uploaded (no PDFs), complete the process
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
                    : progress < 50 
                    ? "Processing other files..." 
                    : progress < 60
                    ? "Uploading PDF to S3..."
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