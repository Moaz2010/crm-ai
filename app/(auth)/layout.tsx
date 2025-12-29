import React from "react";
import { StarsCanvas } from "@/components/ui/Stars";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full z-0">
        <StarsCanvas />
      </div>
      <div className="relative z-10 w-full flex justify-center p-4">
        {children}
      </div>
    </div>
  );
}
