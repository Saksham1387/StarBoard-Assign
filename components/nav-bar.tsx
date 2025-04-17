"use client";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeTab = usePathname();

  const navLinks = [
    {
      href: "/deal-overview",
      label: "Deal Overview",
      active: true,
    },
    { href: "/workshop", label: "Workshop" },
    { href: "/pipeline", label: "Pipeline" },
    { href: "/lease", label: "Lease" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMobileMenuOpen ? null : (
              <Image
                src="/main-logo.svg"
                alt="Logo"
                width={90}
                height={90}
                className="hidden lg:block md:block"
              />
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                link.href === "/deal-overview" ? "pr-6" : "px-6"
              } py-4 text-sm font-medium ${
                link.href == activeTab
                  ? "text-gray-900 underline underline-offset-8"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 text-sm font-medium ${
                  link.active
                    ? "text-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
