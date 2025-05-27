import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pageNumber: number;
  title: string;
  startPosition?: number;
  endPosition?: number;
}

export const PDFViewerModal = ({
  isOpen,
  onClose,
  pdfUrl,
  pageNumber,
  title,
  startPosition,
  endPosition,
}: PDFViewerModalProps) => {
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(pageNumber);
    }
  }, [isOpen, pageNumber]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={handlePageChange}
                  className="w-16 px-2 py-1 border rounded text-center"
                />
                <span className="text-sm text-gray-500">
                  of {totalPages || "?"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={`${pdfUrl}#page=${currentPage}&view=FitH&search=${encodeURIComponent(
              title
            )}`}
            className="w-full h-full border-0"
            title={`PDF Viewer -  ${currentPage}`}
            onLoad={(e) => {
              const iframe = e.target as HTMLIFrameElement;
              if (iframe.contentWindow) {
                // @ts-ignore
                if (iframe.contentWindow.PDFViewerApplication) {
                  // @ts-ignore
                  setTotalPages(iframe.contentWindow.PDFViewerApplication.pagesCount);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}; 
