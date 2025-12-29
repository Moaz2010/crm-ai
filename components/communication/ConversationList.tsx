"use client";

import { Search, Circle } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  type: "email" | "sms";
  avatarColor: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Sarah Miller",
    lastMessage: "That time works perfectly for me.",
    time: "10:30 AM",
    unread: true,
    type: "email",
    avatarColor: "bg-blue-500",
  },
  {
    id: "2",
    name: "John Cooper",
    lastMessage: "Can you send over the pricing PDF?",
    time: "Yesterday",
    unread: false,
    type: "sms",
    avatarColor: "bg-green-500",
  },
  {
    id: "3",
    name: "Emma Wilson",
    lastMessage: "Thanks for the quick follow-up!",
    time: "Yesterday",
    unread: false,
    type: "email",
    avatarColor: "bg-purple-500",
  },
  {
    id: "4",
    name: "Michael Chen",
    lastMessage: "I'll need to reschedule our call.",
    time: "Mon",
    unread: true,
    type: "sms",
    avatarColor: "bg-orange-500",
  },
  {
    id: "5",
    name: "David Kim",
    lastMessage: "Let's schedule a demo for Friday.",
    time: "Mon",
    unread: false,
    type: "email",
    avatarColor: "bg-pink-500",
  },
  {
    id: "6",
    name: "Sarah Jenkins",
    lastMessage: "I received the invoice, thanks.",
    time: "Sun",
    unread: false,
    type: "email",
    avatarColor: "bg-indigo-500",
  },
  {
    id: "7",
    name: "Robert Fox",
    lastMessage: "Can we add another user?",
    time: "Sun",
    unread: true,
    type: "sms",
    avatarColor: "bg-cyan-500",
  },
  {
    id: "8",
    name: "James Wilson",
    lastMessage: "Meeting confirmed.",
    time: "Sat",
    unread: false,
    type: "email",
    avatarColor: "bg-teal-500",
  },
  {
    id: "9",
    name: "Mary Garcia",
    lastMessage: "Please send the updated contract.",
    time: "Sat",
    unread: false,
    type: "email",
    avatarColor: "bg-red-500",
  },
  {
    id: "10",
    name: "Patricia Moore",
    lastMessage: "Thanks for your help!",
    time: "Fri",
    unread: false,
    type: "sms",
    avatarColor: "bg-yellow-500",
  },
];

export default function ConversationList({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📋 Demo Data
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {MOCK_CONVERSATIONS.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full p-4 flex items-start gap-3 border-b border-white/5 transition-colors hover:bg-white/5 ${
              selectedId === conv.id
                ? "bg-white/5 border-l-2 border-l-blue-500"
                : "border-l-2 border-l-transparent"
            }`}
          >
            <div
              className={`h-10 w-10 rounded-full ${conv.avatarColor} flex items-center justify-center text-white font-medium text-sm shrink-0`}
            >
              {conv.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium truncate ${
                    conv.unread ? "text-white" : "text-gray-400"
                  }`}
                >
                  {conv.name}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {conv.time}
                </span>
              </div>
              <p
                className={`text-xs truncate ${
                  conv.unread ? "text-gray-300 font-medium" : "text-gray-500"
                }`}
              >
                {conv.lastMessage}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    conv.type === "email"
                      ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                      : "border-green-500/30 text-green-400 bg-green-500/10"
                  }`}
                >
                  {conv.type.toUpperCase()}
                </span>
                {conv.unread && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
