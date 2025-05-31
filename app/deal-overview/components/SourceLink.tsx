import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

interface Source {
  page_no: number;
  start_position: number;
  end_position: number;
  text_in_the_pdf: string;
}

interface SourceLinkProps {
  source: Source;
  label: string;
  onViewPDF: (pageNumber: number, title: string, startPosition?: number, endPosition?: number, sourceText?: string) => void;
}

export const SourceLink = ({ source, label, onViewPDF }: SourceLinkProps) => {
  if (!source || !source.page_no) return null;

  const handleClick = () => {
    console.log("SourceLink clicked:", source);
    onViewPDF(source.page_no, label, 0, 0, source.text_in_the_pdf);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
    >
      <FileText className="h-3 w-3 mr-1" />
    
      {/* <ExternalLink className="h-3 w-3 ml-1" /> */}
    </Button>
  );
}; 