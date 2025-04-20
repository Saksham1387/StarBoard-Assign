import type React from "react";
import Image from "next/image";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="/main-logo.svg"
              alt="Company Logo"
              width={160}
              height={160}
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Coming Soon
        </h1>

        <div className="h-1 w-20 bg-gradient-to-r from-gray-900 to-gray-500 mx-auto mb-6 rounded-full"></div>

        <p className="text-gray-600 mb-8 text-sm">
          We're working hard to bring you something amazing. Stay tuned for
          updates!
        </p>
      </div>
    </div>
  );
}
