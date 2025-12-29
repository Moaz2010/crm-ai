"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Wand2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIAssistantProps {
  onGenerate: (text: string) => void;
  onClose: () => void;
}

export default function AIAssistant({ onGenerate, onClose }: AIAssistantProps) {
  const [tone, setTone] = useState<"professional" | "friendly" | "urgent">(
    "professional"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAction = (action: string) => {
    setIsGenerating(true);
    // Simulate AI delay
    setTimeout(() => {
      let text = "";
      if (action === "follow-up") {
        text =
          "Hi [Name],\n\nI wanted to circle back on our conversation from earlier. Have you had a chance to review the proposal? I'd love to answer any questions you might have.\n\nBest,\n[Your Name]";
      } else if (action === "cold") {
        text =
          "Hi [Name],\n\nI noticed your company is growing fast and I believe we can help you scale your sales operations. Would you be open to a 10-minute chat next week?\n\nCheers,\n[Your Name]";
      } else if (action === "confirm") {
        text =
          "Hi [Name],\n\nJust confirming our meeting for tomorrow at 2 PM. Looking forward to it!\n\nThanks,\n[Your Name]";
      }

      onGenerate(text);
      setIsGenerating(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
    >
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-400">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium text-sm">AI Assistant</span>
        </div>
        <div className="flex gap-1">
          {(["professional", "friendly", "urgent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-medium transition-colors ${
                tone === t
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 animate-pulse">
              Drafting your message...
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-2">Generate a draft:</p>
            <button
              onClick={() => handleAction("follow-up")}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group"
            >
              <div className="p-2 rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200">
                  Follow-up Email
                </div>
                <div className="text-xs text-gray-500">
                  Check in on a previous conversation
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAction("cold")}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group"
            >
              <div className="p-2 rounded-md bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                <Wand2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200">
                  Cold Outreach
                </div>
                <div className="text-xs text-gray-500">
                  First contact with a new lead
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAction("confirm")}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group"
            >
              <div className="p-2 rounded-md bg-green-500/10 text-green-400 group-hover:bg-green-500/20">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200">
                  Meeting Confirmation
                </div>
                <div className="text-xs text-gray-500">
                  Confirm details for an upcoming call
                </div>
              </div>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
