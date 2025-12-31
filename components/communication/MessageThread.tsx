"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Send,
  Sparkles,
  Smile,
} from "lucide-react";
import AIAssistant from "./AIAssistant";
import { AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "me" | "them";
  content: string;
  time: string;
  type: "text" | "image";
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "them",
    content:
      "Hi there! I was looking at your pricing page and had a few questions about the Enterprise plan.",
    time: "10:30 AM",
    type: "text",
  },
  {
    id: "2",
    sender: "me",
    content:
      "Hello! I'd be happy to help with that. What specific features are you interested in?",
    time: "10:32 AM",
    type: "text",
  },
  {
    id: "3",
    sender: "them",
    content:
      "Mostly interested in the API access and the custom integrations. Do you have documentation for that?",
    time: "10:35 AM",
    type: "text",
  },
  {
    id: "4",
    sender: "me",
    content:
      "Yes, absolutely. We have comprehensive API documentation available at docs.leadcatch.com. It covers all our endpoints and authentication methods.",
    time: "10:36 AM",
    type: "text",
  },
  {
    id: "5",
    sender: "them",
    content:
      "Perfect, I'll share that with my dev team. One more thing - do you offer volume discounts for the Enterprise plan?",
    time: "10:40 AM",
    type: "text",
  },
  {
    id: "6",
    sender: "me",
    content:
      "We do! For teams larger than 20 seats, we offer a 15% discount. How large is your sales team currently?",
    time: "10:42 AM",
    type: "text",
  },
  {
    id: "7",
    sender: "them",
    content: "We have about 25 SDRs right now, looking to grow to 40 by Q4.",
    time: "10:45 AM",
    type: "text",
  },
  {
    id: "8",
    sender: "me",
    content:
      "That's great growth! In that case, you'd definitely qualify for the volume discount. I can put together a custom quote for you if you'd like.",
    time: "10:46 AM",
    type: "text",
  },
  {
    id: "9",
    sender: "them",
    content:
      "That would be helpful. Could you include the implementation timeline in the quote as well?",
    time: "10:50 AM",
    type: "text",
  },
  {
    id: "10",
    sender: "me",
    content:
      "Will do. I'll have that sent over to your email by end of day today.",
    time: "10:52 AM",
    type: "text",
  },
];

export default function MessageThread({
  conversationId,
}: {
  conversationId: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [showAI, setShowAI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages from localStorage for the conversation
  useEffect(() => {
    if (conversationId && typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem(`messages_${conversationId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages(MOCK_MESSAGES);
      }
    }
  }, [conversationId]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      content: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputValue("");
    
    // Save to localStorage
    if (conversationId && typeof window !== 'undefined') {
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(updatedMessages));
    }

    // Simulate a response after 1-2 seconds (demo behavior)
    setTimeout(() => {
      const responses = [
        "Thanks for the message! I'll get back to you shortly.",
        "Got it, let me check on that.",
        "Perfect, I'll review this and follow up.",
        "That sounds good to me!",
        "Let me think about that and get back to you.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "them",
        content: randomResponse,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
      };
      const withResponse = [...updatedMessages, responseMsg];
      setMessages(withResponse);
      if (conversationId && typeof window !== 'undefined') {
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(withResponse));
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <div className="p-4 rounded-full bg-white/5 mb-4">
          <Sparkles className="h-8 w-8 text-gray-600" />
        </div>
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            S
          </div>
          <div>
            <h3 className="font-semibold text-white">Sarah Miller</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📋 Demo Data
          </span>
          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <Phone className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <Video className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] ${
                msg.sender === "me" ? "items-end" : "items-start"
              } flex flex-col gap-1`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "me"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white/10 text-gray-200 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-500 px-1">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`p-2 rounded-lg transition-colors ${
              showAI
                ? "bg-purple-500/20 text-purple-400"
                : "hover:bg-white/5 text-gray-400 hover:text-purple-400"
            }`}
          >
            <Sparkles className="h-5 w-5" />
          </button>

          <div className="flex-1 min-h-[44px] relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full h-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-gray-500 resize-none py-3 max-h-32 custom-scrollbar"
              style={{ height: "auto" }}
              rows={1}
            />
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Paperclip className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Smile className="h-4 w-4" />
            </button>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors ml-1"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-600">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showAI && (
          <AIAssistant
            onClose={() => setShowAI(false)}
            onGenerate={(text) => setInputValue(text)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
