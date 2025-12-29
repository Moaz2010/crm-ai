"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "suggestion" | "confirmation";
  data?: any;
}

export default function AIScheduler() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI Scheduling Assistant. I can help you book meetings, resolve conflicts, or manage your calendar. Try saying 'Book a meeting with Sarah next Tuesday'.",
      type: "text",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      let aiResponse: Message;

      if (input.toLowerCase().includes("book")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I found a few slots for that meeting. Which one works best?",
          type: "suggestion",
          data: [
            { day: "Tuesday, Nov 28", time: "10:00 AM" },
            { day: "Tuesday, Nov 28", time: "2:00 PM" },
            { day: "Wednesday, Nov 29", time: "11:00 AM" },
          ],
        };
      } else if (input.toLowerCase().includes("conflict")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I've detected a conflict on Monday at 2 PM. I can move your internal sync to 4 PM to make room for the client call.",
          type: "text",
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I can help with that. Could you provide more details about the duration and attendees?",
          type: "text",
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">AI Assistant</h3>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-gray-400">Online & Ready</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === "assistant" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-4 w-4 text-white" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>

            <div
              className={`flex flex-col gap-2 max-w-[80%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white/10 text-gray-200 rounded-tl-none"
                    : "bg-blue-600 text-white rounded-tr-none"
                }`}
              >
                {msg.content}
              </div>

              {/* Suggestion Chips */}
              {msg.type === "suggestion" && msg.data && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.data.map((slot: any, idx: number) => (
                    <button
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors text-xs text-blue-300"
                      onClick={() => {
                        setInput(`Book for ${slot.day} at ${slot.time}`);
                        handleSend();
                      }}
                    >
                      <Calendar className="h-3 w-3" />
                      {slot.day}
                      <span className="w-px h-3 bg-blue-500/30 mx-1" />
                      <Clock className="h-3 w-3" />
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/10 flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g., 'Book a meeting next week')..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">
          AI can make mistakes. Please verify important details.
        </p>
      </div>
    </div>
  );
}
