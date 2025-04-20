import {
  Calendar,
  DollarSign,
  Percent,
  ArrowUpRight,
  Building,
  Shield,
  Receipt,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/helper";
import Image from "next/image";
import { useLeaseStore } from "@/store/leaseStore";
import { Skeleton } from "@/components/ui/skeleton";

const isValidValue = (value: any): boolean => {
  return (
    value !== "N/A" &&
    value !== "NA" &&
    value !== null &&
    value !== undefined &&
    value !== ""
  );
};

export default function LeaseAbstract() {
  const { leaseData } = useLeaseStore();

  if (
    !leaseData ||
    !leaseData.lease ||
    !leaseData.tenant ||
    !leaseData.rent ||
    !leaseData.escalations ||
    !leaseData.recoveries ||
    !leaseData.security ||
    !leaseData.renewalOptions
  ) {
    return (
      <div>
        <SkeletonLeaseAbstract />
      </div>
    );
  }

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
        {isValidValue(leaseData.tenant.name) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
                <Image
                  src="person-standing.svg"
                  alt="Tenant"
                  width={25}
                  height={25}
                />
                Tenant
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium text-lg">
                  {leaseData.tenant.name}
                </div>
                {isValidValue(leaseData.tenant.creditRating) && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {leaseData.tenant.creditRating}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {isValidValue(leaseData.lease.term) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
                <Clock className="w-5 h-5" />
                Lease Term
              </div>
              <div className="font-medium text-lg">{leaseData.lease.term}</div>
              <Progress value={percentComplete} className="h-2 mt-2" />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(percentComplete)}% Complete
              </div>
            </CardContent>
          </Card>
        )}
        {isValidValue(leaseData.rent.baseRentPSF) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
                <Image src="Frame.svg" alt="Tenant" width={30} height={30} />
                Base Rent PSF
              </div>
              <div className="font-medium text-lg">
                {leaseData.rent.baseRentPSF}
              </div>
              {isValidValue(leaseData.escalations.rate) && (
                <div className="text-xs text-gray-500 mt-1">
                  Annual Escalation: {leaseData.escalations.rate}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {isValidValue(leaseData.recoveries.operatingExpenses) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500 mb-1 flex flex-row items-center gap-2">
                <Image src="tags.svg" alt="Tenant" width={20} height={20} />
                Lease Type
              </div>
              <div className="font-medium text-lg">
                {leaseData.recoveries.operatingExpenses}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tenant Information */}
      {(isValidValue(leaseData.tenant.name) ||
        isValidValue(leaseData.tenant.industry) ||
        isValidValue(leaseData.tenant.creditRating) ||
        isValidValue(leaseData.recoveries.operatingExpenses)) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tenant Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isValidValue(leaseData.tenant.name) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Tenant</div>
                  <div className="flex items-center">
                    <div className="font-medium">{leaseData.tenant.name}</div>
                  </div>
                </div>
              )}
              {isValidValue(leaseData.tenant.industry) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Industry</div>
                  <div className="font-medium">{leaseData.tenant.industry}</div>
                </div>
              )}
              {isValidValue(leaseData.tenant.creditRating) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Credit Rating
                  </div>
                  <div className="font-medium">
                    {leaseData.tenant.creditRating}
                  </div>
                </div>
              )}
              {isValidValue(leaseData.recoveries.operatingExpenses) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Lease Type</div>
                  <div className="font-medium">
                    {leaseData.recoveries.operatingExpenses}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lease Term */}
      {(isValidValue(leaseData.lease.startDate) ||
        isValidValue(leaseData.lease.expiryDate) ||
        isValidValue(leaseData.lease.term) ||
        isValidValue(leaseData.lease.remainingTerm)) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lease Term</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isValidValue(leaseData.lease.startDate) && (
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
              )}
              {isValidValue(leaseData.lease.expiryDate) && (
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
              )}
              {isValidValue(leaseData.lease.term) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Original Term
                  </div>
                  <div className="font-medium">{leaseData.lease.term}</div>
                </div>
              )}
              {isValidValue(leaseData.lease.remainingTerm) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Remaining Term
                  </div>
                  <div className="font-medium">
                    {leaseData.lease.remainingTerm}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rent Structure */}
      {(isValidValue(leaseData.rent.baseRentPSF) ||
        isValidValue(leaseData.rent.annualBaseRent) ||
        isValidValue(leaseData.rent.monthlyBaseRent) ||
        isValidValue(leaseData.rent.effectiveRentPSF)) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Rent Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isValidValue(leaseData.rent.baseRentPSF) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Base Rent PSF
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.rent.baseRentPSF}
                    </div>
                  </div>
                </div>
              )}
              {isValidValue(leaseData.rent.annualBaseRent) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Annual Base Rent
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.rent.annualBaseRent}
                    </div>
                  </div>
                </div>
              )}
              {isValidValue(leaseData.rent.monthlyBaseRent) && (
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
              )}
              {isValidValue(leaseData.rent.effectiveRentPSF) && (
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
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Escalations */}
      {(isValidValue(leaseData.escalations.structure) ||
        isValidValue(leaseData.escalations.rate) ||
        isValidValue(leaseData.escalations.nextEscalation)) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Escalations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isValidValue(leaseData.escalations.structure) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Structure</div>
                  <div className="flex items-center">
                    <ArrowUpRight size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.escalations.structure}
                    </div>
                  </div>
                </div>
              )}
              {isValidValue(leaseData.escalations.rate) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Rate</div>
                  <div className="flex items-center">
                    <Percent size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.escalations.rate}
                    </div>
                  </div>
                </div>
              )}
              {isValidValue(leaseData.escalations.nextEscalation) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Next Escalation
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.escalations.nextEscalation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery Terms */}
      {(isValidValue(leaseData.recoveries.operatingExpenses) ||
        isValidValue(leaseData.recoveries.cam) ||
        isValidValue(leaseData.recoveries.insurance) ||
        isValidValue(leaseData.recoveries.taxes)) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recovery Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isValidValue(leaseData.recoveries.operatingExpenses) && (
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
              )}
              {isValidValue(leaseData.recoveries.cam) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">CAM</div>
                  <div className="flex items-center">
                    <Building size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.recoveries.cam}
                    </div>
                  </div>
                </div>
              )}
              {isValidValue(leaseData.recoveries.insurance) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Insurance</div>
                  <div className="flex items-center">
                    <Shield size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.recoveries.insurance}
                    </div>
                  </div>
                </div>
              )}
              {isValidValue(leaseData.recoveries.taxes) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Taxes</div>
                  <div className="flex items-center">
                    <Receipt size={16} className="mr-2 text-gray-400" />
                    <div className="font-medium">
                      {leaseData.recoveries.taxes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Renewal Options */}
      {leaseData.renewalOptions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Renewal Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaseData.renewalOptions.map(
                (option, index) =>
                  (isValidValue(option.term) ||
                    isValidValue(option.notice) ||
                    isValidValue(option.rentStructure)) && (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      {isValidValue(option.term) && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Option {index + 1} Term
                          </div>
                          <div className="font-medium">{option.term}</div>
                        </div>
                      )}
                      {isValidValue(option.notice) && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Notice Period
                          </div>
                          <div className="font-medium">{option.notice}</div>
                        </div>
                      )}
                      {isValidValue(option.rentStructure) && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Rent Structure
                          </div>
                          <div className="font-medium">
                            {option.rentStructure}
                          </div>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security */}
      {(isValidValue(leaseData.security.deposit) ||
        isValidValue(leaseData.security.equivalent) ||
        isValidValue(leaseData.security.letterOfCredit)) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isValidValue(leaseData.security.deposit) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Security Deposit
                  </div>
                  <div className="font-medium">
                    {leaseData.security.deposit}
                  </div>
                </div>
              )}
              {isValidValue(leaseData.security.equivalent) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Equivalent</div>
                  <div className="font-medium">
                    {leaseData.security.equivalent}
                  </div>
                </div>
              )}
              {isValidValue(leaseData.security.letterOfCredit) && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Letter of Credit
                  </div>
                  <div className="font-medium">
                    {leaseData.security.letterOfCredit}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function SkeletonLeaseAbstract() {
  return (
    <div className="space-y-6">
      {/* Key Lease Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-2 w-full mt-1" />
              <Skeleton className="h-3 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generic Section Skeleton */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-3 w-1/3 mb-1" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
