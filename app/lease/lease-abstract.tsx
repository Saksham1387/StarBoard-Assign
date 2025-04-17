import {
  Calendar,
  DollarSign,
  Percent,
  ArrowUpRight,
  Building,
  Shield,
  Receipt,
  CheckIcon,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { leaseData } from "./lease-data";
import { formatDate } from "@/lib/helper";
import Image from "next/image";

export default function LeaseAbstract() {
  const startDate = new Date(leaseData.lease.startDate).getTime();
  const endDate = new Date(leaseData.lease.expiryDate).getTime();
  const today = new Date().getTime();
  const totalDuration = endDate - startDate;
  const elapsedDuration = today - startDate;
  const percentComplete = Math.max(
    0,
    Math.min(100, (elapsedDuration / totalDuration) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Key Lease Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
              <Image src="person-standing.svg" alt="Tenant" width={25} height={25} />
              Tenant
              </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-lg">{leaseData.tenant.name}</div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {leaseData.tenant.creditRating}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
              <Clock className="w-5 h-5"/>
              Lease Term</div>
            <div className="font-medium text-lg">{leaseData.lease.term}</div>
            <Progress value={percentComplete} className="h-2 mt-2" />
            <div className="text-xs text-gray-500 mt-1">
              {Math.round(percentComplete)}% Complete
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
            <Image src="Frame.svg" alt="Tenant" width={30} height={30} />
              Base Rent PSF</div>
            <div className="font-medium text-lg">
              {leaseData.rent.baseRentPSF}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Annual Escalation: {leaseData.escalations.rate}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
            <Image src="tags.svg" alt="Tenant" width={20} height={20} />
              Lease Type</div>
            <div className="font-medium text-lg">
              {leaseData.recoveries.operatingExpenses}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tenant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Tenant</div>
              <div className="flex items-center">
                <div className="font-medium">{leaseData.tenant.name}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Industry</div>
              <div className="font-medium">{leaseData.tenant.industry}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Credit Rating</div>
              <div className="font-medium">{leaseData.tenant.creditRating}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Lease Type</div>
              <div className="font-medium">
                {leaseData.recoveries.operatingExpenses}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lease Term */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lease Term</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Lease Commencement Date (LCD)
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {formatDate(leaseData.lease.startDate)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Lease Expiry Date (LXD)
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {formatDate(leaseData.lease.expiryDate)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Original Term</div>
              <div className="font-medium">{leaseData.lease.term}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Remaining Term</div>
              <div className="font-medium">{leaseData.lease.remainingTerm}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rent Structure */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Rent Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Base Rent PSF</div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">{leaseData.rent.baseRentPSF}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Annual Base Rent</div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {leaseData.rent.annualBaseRent}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Monthly Base Rent
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {leaseData.rent.monthlyBaseRent}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Effective Rent PSF
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {leaseData.rent.effectiveRentPSF}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escalations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Escalations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Structure</div>
              <div className="flex items-center">
                <ArrowUpRight size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {leaseData.escalations.structure}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Rate</div>
              <div className="flex items-center">
                <Percent size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">{leaseData.escalations.rate}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Next Escalation</div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {leaseData.escalations.nextEscalation}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Terms */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recovery Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Operating Expenses
              </div>
              <div className="flex items-center">
                <Building size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {leaseData.recoveries.operatingExpenses}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">CAM</div>
              <div className="flex items-center">
                <Building size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">{leaseData.recoveries.cam}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Insurance</div>
              <div className="flex items-center">
                <Shield size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">
                  {leaseData.recoveries.insurance}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Taxes</div>
              <div className="flex items-center">
                <Receipt size={16} className="mr-2 text-gray-400" />
                <div className="font-medium">{leaseData.recoveries.taxes}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Renewal Options */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Renewal Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaseData.renewalOptions.map((option, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Option {index + 1} Term
                  </div>
                  <div className="font-medium">{option.term}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Notice Period
                  </div>
                  <div className="font-medium">{option.notice}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Rent Structure
                  </div>
                  <div className="font-medium">{option.rentStructure}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Security Deposit</div>
              <div className="font-medium">{leaseData.security.deposit}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Equivalent</div>
              <div className="font-medium">{leaseData.security.equivalent}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Letter of Credit</div>
              <div className="font-medium">
                {leaseData.security.letterOfCredit}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
