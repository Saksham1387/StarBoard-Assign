import Link from "next/link";

export default function DealOverviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Deal Overview</h1>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Underwriting Model</div>
            <div className="text-sm font-medium">
              Industrial Template v2.4.xlsx
            </div>
          </div>
        </div>

        <div className=" p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Deal Overview Content</h2>

          <Link href="/lease" className="hover:underline">
            Go to Lease Abstract
          </Link>
        </div>
      </main>
    </div>
  );
}
