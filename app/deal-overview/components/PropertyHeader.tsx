import Image from "next/image";
import { SourceLink } from "./SourceLink";
import {
  Building,
  Calendar,
  DollarSign,
  Layers,
  MapPin,
  Maximize,
  Percent,
  SquareStack,
  Users,
} from "lucide-react";

interface Source {
  page_no: number;
  start_position: number;
  end_position: number;
  text_in_the_pdf: string;
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

interface PropertyHeaderProps {
  dealOverview: DealOverview;
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

export function PropertyHeader({ dealOverview, onViewPDF }: PropertyHeaderProps) {
  if (!dealOverview) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="relative rounded-lg overflow-hidden border">
          <Image
            src="/main-image.png"
            alt="Property Image"
            width={400}
            height={300}
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isValidValue(dealOverview.propertyName) &&
              isValidValue(dealOverview.location) && (
                <h2 className="text-xl font-bold">
                  {dealOverview.propertyName},{" "}
                  {dealOverview.location}
                </h2>
              )}
            {isValidValue(dealOverview.dateUploaded) && (
              <p className="text-sm text-gray-600 mt-1">
                Date Uploaded: {dealOverview.dateUploaded}
              </p>
            )}
            {isValidValue(dealOverview.propertyType) && (
              <p className="text-sm text-gray-600">
                {dealOverview.propertyType}
              </p>
            )}
          </div>
          {dealOverview.source && (
            <SourceLink 
              source={dealOverview.source}
              label="Deal Overview"
              onViewPDF={onViewPDF}
            />
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {isValidValue(dealOverview.seller) && (
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Users className="h-3 w-3 mr-1" />
                <span>Seller</span>
              </div>
              <p className="text-sm">{dealOverview.seller}</p>
            </div>
          )}
          {isValidValue(dealOverview.guidancePrice) && (
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>Guidance Price</span>
              </div>
              <p className="text-sm">
                {dealOverview.guidancePrice}
              </p>
            </div>
          )}
          {isValidValue(dealOverview.guidancePricePSF) && (
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>Guidance Price PSF</span>
              </div>
              <p className="text-sm">
                {dealOverview.guidancePricePSF}
              </p>
            </div>
          )}
          {isValidValue(dealOverview.capRate) && (
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Percent className="h-3 w-3 mr-1" />
                <span>Cap Rate</span>
              </div>
              <p className="text-sm">
                {dealOverview.capRate}
              </p>
            </div>
          )}
          {isValidValue(dealOverview.propertySize) && (
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Maximize className="h-3 w-3 mr-1" />
                <span>Property Size</span>
              </div>
              <p className="text-sm">
                {dealOverview.propertySize}
              </p>
            </div>
          )}
          {isValidValue(dealOverview.landArea) && (
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Layers className="h-3 w-3 mr-1" />
                <span>Land Area</span>
              </div>
              <p className="text-sm">
                {dealOverview.landArea}
              </p>
            </div>
          )}
          {isValidValue(dealOverview.zoning) && (
            <div className="flex flex-col">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>Zoning</span>
              </div>
              <p className="text-sm">{dealOverview.zoning}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 