import { SourceLink } from "./SourceLink";

interface Source {
  page_no: number;
  start_position: number;
  end_position: number;
  text_in_the_pdf: string;
}

interface DealSummaryProps {
  text?: string;
  source?: Source;
  onViewPDF: (pageNumber: number, title: string, startPosition?: number, endPosition?: number, sourceText?: string) => void;
}

const isValidValue = (value: any): boolean => {
  return (
    value !== "N/A" &&
    value !== "NA" &&
    value !== null &&
    value !== undefined &&
    value !== ""
  );
};

export function DealSummary({ text, source, onViewPDF }: DealSummaryProps) {
  if (!isValidValue(text)) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Deal Summary</h3>
        {source && (
          <SourceLink 
            source={source}
            label="Deal Summary"
            onViewPDF={onViewPDF}
          />
        )}
      </div>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
} 