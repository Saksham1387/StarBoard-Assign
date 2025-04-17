'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black px-4">
      <Image
        src="/main-logo.svg"
        alt="Logo"
        width={120}
        height={120}
        className="mb-6"
        priority
      />
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-300 mb-6 text-center max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
