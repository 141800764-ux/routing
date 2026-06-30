import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

/* Devicon CSS */
import "devicon/devicon.min.css";

import Navbar from "@/components/navigation/Navbar";
import RightSideBar from "@/components/navigation/navbar/RightSideBar";
import RootProviders from "@/components/providers/root-providers";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
  description: "Full stack app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground overflow-x-hidden">

        {/* BACKGROUND IMAGE */}
        <div className="fixed inset-0 -z-20">
          <img
            src="/images/popbg.png"
            alt="background"
            className="h-full w-full object-cover"
          />
        </div>

        {/* DARK OVERLAY */}
        <div className="fixed inset-0 bg-black/50 -z-10" />

        {/* PROVIDERS (NO AUTH SESSION PASSED) */}
        <RootProviders>

          {/* NAVBAR */}
          <Navbar />

          {/* MAIN LAYOUT */}
          <div className="flex pt-20">

            {/* PAGE CONTENT */}
            <main className="flex-1 px-6 xl:pr-[380px]">
              <div className="mx-auto w-full max-w-7xl">
                {children}
              </div>
            </main>

            {/* RIGHT SIDEBAR */}
            <RightSideBar />

          </div>

        </RootProviders>

      </body>
    </html>
  );
}