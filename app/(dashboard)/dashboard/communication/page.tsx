"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Check,
  Clock,
  Star,
  Archive,
  Trash2,
} from "lucide-react";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { cn } from "@/lib/utils";

const CONVERSATIONS = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    avatar: "SJ",
    color: "bg-blue-500",
    lastMessage: "Thanks for the proposal. When can we schedule a demo?",
    time: "10:30 AM",
    unread: 2,
    type: "email",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "StartUp Labs",
    avatar: "MC",
    color: "bg-purple-500",
    lastMessage: "I'll have to check with my team regarding the budget.",
    time: "Yesterday",
    unread: 0,
    type: "linkedin",
    status: "waiting",
  },
  {
    id: 3,
    name: "Emma Wilson",
    company: "Design Studio",
    avatar: "EW",
    color: "bg-pink-500",
    lastMessage: "Can you send over the API documentation?",
    time: "Yesterday",
    unread: 0,
    type: "email",
    status: "active",
  },
  {
    id: 4,
    name: "James Brown",
    company: "Consulting Co",
    avatar: "JB",
    color: "bg-orange-500",
    lastMessage: "Missed call",
    time: "2 days ago",
    unread: 1,
    type: "phone",
    status: "missed",
  },
];

const MESSAGES = [
  {
    id: 1,
    sender: "me",
    content:
      "Hi Sarah, thanks for your interest! Here is the proposal we discussed.",
    time: "10:00 AM",
  },
  {
    id: 2,
    sender: "Sarah Johnson",
    content: "Thanks for the proposal. When can we schedule a demo?",
    time: "10:30 AM",
  },
];

export default function CommunicationPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [messageInput, setMessageInput] = useState("");

  const selectedConversation = CONVERSATIONS.find((c) => c.id === selectedId);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
              <Filter className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                "p-4 rounded-xl cursor-pointer transition-all border border-transparent",
                selectedId === conv.id
                  ? "bg-white dark:bg-white/10 border-gray-200 dark:border-white/10 shadow-sm"
                  : "hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full ${conv.color} flex items-center justify-center text-white font-bold text-sm relative`}
                  >
                    {conv.avatar}
                    {conv.type === "linkedin" && (
                      <div className="absolute -bottom-1 -right-1 bg-[#0077b5] rounded-full p-0.5 border-2 border-white dark:border-black">
                        <MessageSquare className="h-2 w-2 text-white" />
                      </div>
                    )}
                    {conv.type === "email" && (
                      <div className="absolute -bottom-1 -right-1 bg-gray-500 rounded-full p-0.5 border-2 border-white dark:border-black">
                        <Mail className="h-2 w-2 text-white" />
                      </div>
                    )}
                    {conv.type === "phone" && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-black">
                        <Phone className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{conv.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {conv.company}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{conv.time}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">
                {conv.lastMessage}
              </p>
              {conv.unread > 0 && (
                <div className="mt-2 flex justify-end">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {conv.unread} new
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
          <div className="flex items-center gap-4">
            <div
              className={`h-10 w-10 rounded-full ${selectedConversation?.color} flex items-center justify-center text-white font-bold text-sm`}
            >
              {selectedConversation?.avatar}
            </div>
            <div>
              <h2 className="font-bold">{selectedConversation?.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                {selectedConversation?.company} •{" "}
                <span className="text-green-500">Online</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500">
              <Star className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500">
              <Archive className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500">
              <Trash2 className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 dark:bg-black/20">
          <div className="flex justify-center">
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
              Today
            </span>
          </div>
          {MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-4 max-w-[80%]",
                msg.sender === "me" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white",
                  msg.sender === "me"
                    ? "bg-gray-900 dark:bg-white dark:text-black"
                    : selectedConversation?.color
                )}
              >
                {msg.sender === "me" ? "Me" : selectedConversation?.avatar}
              </div>
              <div
                className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.sender === "me"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 rounded-tl-none"
                )}
              >
                <p>{msg.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-2 opacity-70 text-right",
                    msg.sender === "me" ? "text-blue-100" : "text-gray-400"
                  )}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10">
          <div className="flex items-end gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-xl border border-gray-200 dark:border-white/10 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2 text-sm"
              rows={1}
              style={{ minHeight: "40px" }}
            />
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <Smile className="h-5 w-5" />
            </button>
            <button
              className={cn(
                "p-2 rounded-lg transition-all",
                messageInput.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-xs text-gray-400">
              Press <kbd className="font-sans">Enter</kbd> to send
            </p>
            <div className="flex gap-2">
              <button className="text-xs text-gray-500 hover:text-blue-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Schedule Send
              </button>
              <button className="text-xs text-gray-500 hover:text-blue-500 flex items-center gap-1">
                <Check className="h-3 w-3" /> Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
