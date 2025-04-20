"use client";

import { Card } from "@/components/ui/card";

export default function DealOverviewSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="relative rounded-lg overflow-hidden border">
                  <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>

                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2"></div>

                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="space-y-2 pl-5">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="mt-8 w-full">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <Card className="p-4 h-full w-full flex flex-col">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-4 flex-grow">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 h-full w-full flex flex-col">
                  <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-4 flex-grow">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 h-full w-full flex flex-col">
                  <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-4 flex-grow">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4 h-full w-full flex flex-col">
                  <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-4 flex-grow">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 h-full sm:h-1/2 md:h-full">
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
