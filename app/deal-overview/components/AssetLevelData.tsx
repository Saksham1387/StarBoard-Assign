import { Card } from "@/components/ui/card";
import { SourceLink } from "./SourceLink";
import {
  Building,
  Calendar,
  Columns,
  Home,
  MapPin,
  SquareStack,
  Truck,
  Users,
} from "lucide-react";

interface Source {
  page_no: number;
  start_position: number;
  end_position: number;
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

interface AssetLevelDataProps {
  data: AssetLevelData;
  onViewPDF: (pageNumber: number, title: string, startPosition?: number, endPosition?: number) => void;
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

export function AssetLevelData({ data, onViewPDF }: AssetLevelDataProps) {
  if (!data) return null;

  return (
    <div className="lg:col-span-1">
      <Card className="p-6 h-full sm:h-1/2 md:h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Asset-Level Data</h3>
          {data.source && (
            <SourceLink 
              source={data.source}
              label="Asset Level Data"
              onViewPDF={onViewPDF}
            />
          )}
        </div>

        <div className="space-y-6">
          {(isValidValue(data.clearHeights) || isValidValue(data.tenant)) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                {isValidValue(data.clearHeights) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Clear Heights</span>
                  </div>
                )}
                {isValidValue(data.tenant) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Tenant</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                {isValidValue(data.clearHeights) && (
                  <p className="text-xl font-bold">
                    {data.clearHeights}
                  </p>
                )}
                {isValidValue(data.tenant) && (
                  <p className="text-xl font-bold">
                    {data.tenant}
                  </p>
                )}
              </div>
            </div>
          )}

          {(isValidValue(data.columnSpacing) || isValidValue(data.seawardArea)) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                {isValidValue(data.columnSpacing) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Columns className="h-4 w-4 mr-2" />
                    <span>Column Spacing</span>
                  </div>
                )}
                {isValidValue(data.seawardArea) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Seaward Area</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                {isValidValue(data.columnSpacing) && (
                  <p className="text-xl font-bold">
                    {data.columnSpacing}
                  </p>
                )}
                {isValidValue(data.seawardArea) && (
                  <p className="text-xl font-bold">
                    {data.seawardArea}
                  </p>
                )}
              </div>
            </div>
          )}

          {(isValidValue(data.parkingSpaces) || isValidValue(data.yearBuilt)) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                {isValidValue(data.parkingSpaces) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SquareStack className="h-4 w-4 mr-2" />
                    <span>Parking Spaces</span>
                  </div>
                )}
                {isValidValue(data.yearBuilt) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Year Built</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                {isValidValue(data.parkingSpaces) && (
                  <p className="text-xl font-bold">
                    {data.parkingSpaces}
                  </p>
                )}
                {isValidValue(data.yearBuilt) && (
                  <p className="text-xl font-bold">
                    {data.yearBuilt}
                  </p>
                )}
              </div>
            </div>
          )}

          {(isValidValue(data.dockDoors) || isValidValue(data.occupancyRate)) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                {isValidValue(data.dockDoors) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-2" />
                    <span># of Dock Doors</span>
                  </div>
                )}
                {isValidValue(data.occupancyRate) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    <span>Occupancy Rate</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                {isValidValue(data.dockDoors) && (
                  <p className="text-xl font-bold">
                    {data.dockDoors}
                  </p>
                )}
                {isValidValue(data.occupancyRate) && (
                  <p className="text-xl font-bold">
                    {data.occupancyRate}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 