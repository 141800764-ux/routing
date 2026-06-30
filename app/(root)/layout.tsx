import React from "react";
import Navbar from "@/components/navigation/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="background-light850_dark100">
      <Navbar />

      <div className="flex">
        <div className="flex-1">
          {children}
        </div>
      </div>
    </main>
  );
}