"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Users,
  FileText,
  Zap,
  Search,
  Plus,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { StarsCanvas } from "@/components/ui/Stars";
import SpotlightCard from "@/components/landing/SpotlightCard";
import ConversationList from "@/components/communication/ConversationList";
import MessageThread from "@/components/communication/MessageThread";
import TemplateManager from "@/components/communication/TemplateManager";
import BulkMessageWizard from "@/components/communication/BulkMessageWizard";

export default function CommunicationModule() {
  const [activeView, setActiveView] = useState<"inbox" | "templates" | "bulk">(
    "inbox"
  );
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >("1");

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Top Navigation Bar */}
      <nav className="border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-6 w-px bg-black/10 dark:bg-white/10" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Communication Hub
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-medium">
              <Zap className="h-3 w-3" />
              AI Assistant Ready
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8 relative z-10 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-full min-h-0">
            <SpotlightCard
              disableSpotlight
              className="p-2 !bg-white/60 dark:!bg-black/40 !border-black/10 dark:!border-white/5 shrink-0 h-fit backdrop-blur-md"
            >
              <div className="space-y-1">
                <button
                  onClick={() => setActiveView("inbox")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeView === "inbox"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  Inbox
                  <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                </button>
                <button
                  onClick={() => setActiveView("templates")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeView === "templates"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Templates
                </button>
                <button
                  onClick={() => setActiveView("bulk")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeView === "bulk"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Bulk Messaging
                </button>
              </div>
            </SpotlightCard>

            {activeView === "inbox" && (
              <SpotlightCard
                disableSpotlight
                className="flex-1 !p-0 !bg-white/60 dark:!bg-black/40 !border-black/10 dark:!border-white/5 overflow-hidden flex flex-col min-h-0 backdrop-blur-md"
              >
                <ConversationList
                  selectedId={selectedConversationId}
                  onSelect={setSelectedConversationId}
                />
              </SpotlightCard>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 h-full min-h-0 flex flex-col">
            <SpotlightCard
              disableSpotlight
              className="h-full !p-0 !bg-white/60 dark:!bg-black/40 !border-black/10 dark:!border-white/5 overflow-hidden flex flex-col backdrop-blur-md"
            >
              {activeView === "inbox" && (
                <MessageThread conversationId={selectedConversationId} />
              )}
              {activeView === "templates" && <TemplateManager />}
              {activeView === "bulk" && <BulkMessageWizard />}
            </SpotlightCard>
          </div>
        </div>
      </main>
    </div>
  );
}
