"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarsCanvas } from "@/components/ui/Stars";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-50 pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 z-40 flex items-center px-4 justify-between">
        <div className="font-bold text-lg">LeadCatch</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div className="relative z-10 flex h-full w-full pt-16 md:pt-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black transform transition-transform duration-300 ease-in-out md:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar mobile onClose={() => setIsSidebarOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-white/10 dark:bg-black/10 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
