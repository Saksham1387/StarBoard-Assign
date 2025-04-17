import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "Assignment",
  description: "Starboard Assignment Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
