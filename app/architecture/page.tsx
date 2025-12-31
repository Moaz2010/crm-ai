"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Users,
  GitBranch,
  Workflow,
  BoxesIcon,
  ChevronRight,
  Download,
  Maximize2,
  Info,
  X,
  ArrowLeft,
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
  Bot,
  User,
} from "lucide-react";
import Link from "next/link";

// AI Chat Message Interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// AI Chat Bubble Component
const AIChatBubble = ({ diagramType, diagramTitle }: { diagramType: string; diagramTitle: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset chat when diagram changes
  useEffect(() => {
    setMessages([]);
  }, [diagramType]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/diagrams/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          diagramType,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = {
    erd: [
      "What are the main entities?",
      "Explain the relationships",
      "What is a foreign key?",
    ],
    usecase: [
      "Who are the actors?",
      "What does <<include>> mean?",
      "Explain the system boundary",
    ],
    sequence: [
      "What are activation boxes?",
      "Explain the message flow",
      "What do dashed arrows mean?",
    ],
    dfd: [
      "What is Process 0?",
      "What are external entities?",
      "Explain the data flows",
    ],
    class: [
      "What is an interface?",
      "Explain the + and - symbols",
      "What is inheritance?",
    ],
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">Diagram Assistant</h3>
                <p className="text-blue-100 text-xs">Ask me about the {diagramTitle}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Hi! I'm your Diagram Assistant</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    I can help you understand the {diagramTitle}. Try asking:
                  </p>
                  <div className="space-y-2">
                    {(suggestedQuestions[diagramType as keyof typeof suggestedQuestions] || []).map(
                      (question, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInput(question);
                            inputRef.current?.focus();
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          {question}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this diagram..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Powered by GPT-4o-mini</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

type DiagramType = "erd" | "usecase" | "sequence" | "dfd" | "class";

interface DiagramInfo {
  id: DiagramType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const diagrams: DiagramInfo[] = [
  {
    id: "erd",
    title: "Entity Relationship Diagram",
    description: "Database schema showing entities, attributes, and relationships",
    icon: <Database className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    id: "usecase",
    title: "Use Case Diagram",
    description: "System functionality from user perspective with actors and use cases",
    icon: <Users className="w-5 h-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    id: "sequence",
    title: "Sequence Diagram",
    description: "Object interactions arranged in time sequence",
    icon: <GitBranch className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    id: "dfd",
    title: "Data Flow Diagram",
    description: "Flow of data through the system processes",
    icon: <Workflow className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
  {
    id: "class",
    title: "Class Diagram",
    description: "System structure showing classes, attributes, methods, and relationships",
    icon: <BoxesIcon className="w-5 h-5" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
  },
];

// ============ SVG DIAGRAM COMPONENTS ============

// Sequence Diagram Component
const SequenceDiagram = () => {
  const participants = [
    { name: "User", x: 80 },
    { name: "Frontend", x: 230 },
    { name: "API Server", x: 380 },
    { name: "LeadService", x: 530 },
    { name: "Database", x: 680 },
  ];

  const messages: Array<{
    from: number;
    to: number;
    label: string;
    y: number;
    dashed?: boolean;
    activate?: number;
    deactivate?: number;
    self?: boolean;
  }> = [
    { from: 0, to: 1, label: "1: Enter Lead URL", y: 100, activate: 1 },
    { from: 1, to: 2, label: "2: POST /api/leads/parse", y: 130, activate: 2 },
    { from: 2, to: 3, label: "3: parseLead(url)", y: 160, activate: 3 },
    { from: 3, to: 4, label: "4: Check duplicate", y: 190, activate: 4 },
    { from: 4, to: 3, label: "5: No duplicate", y: 220, dashed: true, deactivate: 4 },
    { from: 3, to: 2, label: "6: Parsed data", y: 250, dashed: true, deactivate: 3 },
    { from: 2, to: 4, label: "7: INSERT lead", y: 280, activate: 4 },
    { from: 4, to: 2, label: "8: Lead created", y: 310, dashed: true, deactivate: 4 },
    { from: 2, to: 1, label: "9: Success response", y: 340, dashed: true, deactivate: 2 },
    { from: 1, to: 0, label: "10: Show new lead", y: 370, dashed: true, deactivate: 1 },
    // Enrichment flow
    { from: 0, to: 1, label: "11: Click Enrich", y: 420, activate: 1 },
    { from: 1, to: 2, label: "12: POST /api/leads/enrich", y: 450, activate: 2 },
    { from: 2, to: 3, label: "13: enrichLead(id)", y: 480, activate: 3 },
    { from: 3, to: 4, label: "14: Get lead data", y: 510, activate: 4 },
    { from: 4, to: 3, label: "15: Lead data", y: 540, dashed: true, deactivate: 4 },
    { from: 3, to: 3, label: "16: Call External APIs", y: 570, self: true },
    { from: 3, to: 4, label: "17: UPDATE lead", y: 610, activate: 4 },
    { from: 4, to: 3, label: "18: Updated", y: 640, dashed: true, deactivate: 4 },
    { from: 3, to: 2, label: "19: Enriched lead", y: 670, dashed: true, deactivate: 3 },
    { from: 2, to: 1, label: "20: Success response", y: 700, dashed: true, deactivate: 2 },
    { from: 1, to: 0, label: "21: Show enriched data", y: 730, dashed: true, deactivate: 1 },
  ];

  // Calculate activation boxes
  const activations: { participant: number; startY: number; endY: number }[] = [];
  const activeStarts: { [key: number]: number } = {};

  messages.forEach((msg) => {
    if (msg.activate !== undefined) {
      activeStarts[msg.activate] = msg.y - 10;
    }
    if (msg.deactivate !== undefined && activeStarts[msg.deactivate] !== undefined) {
      activations.push({
        participant: msg.deactivate,
        startY: activeStarts[msg.deactivate],
        endY: msg.y + 10,
      });
      delete activeStarts[msg.deactivate];
    }
  });

  return (
    <svg viewBox="0 0 780 780" className="w-full h-full">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
        </marker>
        <marker id="arrowhead-dashed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
      </defs>

      {/* Title */}
      <text x="390" y="25" textAnchor="middle" className="text-lg font-bold" fill="#1f2937">
        Sequence Diagram - LeadCatch System
      </text>

      {/* Participant boxes */}
      {participants.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 50} y={40} width={100} height={35} fill="white" stroke="#374151" strokeWidth="2" />
          <text x={p.x} y={62} textAnchor="middle" className="text-sm font-semibold" fill="#1f2937">
            {p.name}
          </text>
          {/* Lifeline */}
          <line x1={p.x} y1={75} x2={p.x} y2={760} stroke="#374151" strokeWidth="1" strokeDasharray="5,5" />
        </g>
      ))}

      {/* Activation boxes */}
      {activations.map((act, i) => (
        <rect
          key={i}
          x={participants[act.participant].x - 8}
          y={act.startY}
          width={16}
          height={act.endY - act.startY}
          fill="white"
          stroke="#374151"
          strokeWidth="1.5"
        />
      ))}

      {/* Messages */}
      {messages.map((msg, i) => {
        const fromX = participants[msg.from].x;
        const toX = participants[msg.to].x;
        const isLeftToRight = toX > fromX;

        if (msg.self) {
          // Self-call arrow
          return (
            <g key={i}>
              <path
                d={`M ${fromX + 8} ${msg.y} H ${fromX + 40} V ${msg.y + 25} H ${fromX + 8}`}
                fill="none"
                stroke="#374151"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
              />
              <text x={fromX + 45} y={msg.y + 10} className="text-xs" fill="#374151">
                {msg.label}
              </text>
            </g>
          );
        }

        return (
          <g key={i}>
            <line
              x1={isLeftToRight ? fromX + 8 : fromX - 8}
              y1={msg.y}
              x2={isLeftToRight ? toX - 8 : toX + 8}
              y2={msg.y}
              stroke={msg.dashed ? "#6b7280" : "#374151"}
              strokeWidth="1.5"
              strokeDasharray={msg.dashed ? "5,3" : "none"}
              markerEnd={msg.dashed ? "url(#arrowhead-dashed)" : "url(#arrowhead)"}
            />
            <text
              x={(fromX + toX) / 2}
              y={msg.y - 5}
              textAnchor="middle"
              className="text-xs"
              fill="#374151"
            >
              {msg.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// DFD Diagram Component
const DFDDiagram = () => {
  const centerX = 400;
  const centerY = 300;
  const radius = 70;

  const entities = [
    { name: "User", x: 100, y: 150 },
    { name: "Admin", x: 100, y: 450 },
    { name: "Apollo.io", x: 700, y: 100 },
    { name: "Clearbit", x: 700, y: 250 },
    { name: "Hunter.io", x: 700, y: 400 },
    { name: "OpenAI", x: 700, y: 550 },
  ];

  const flows = [
    { from: "User", to: "center", label: "Lead URL", fromPos: { x: 160, y: 150 }, toPos: { x: centerX - radius, y: centerY - 40 } },
    { from: "User", to: "center", label: "Manual Entry", fromPos: { x: 160, y: 170 }, toPos: { x: centerX - radius, y: centerY } },
    { from: "center", to: "User", label: "Lead List", fromPos: { x: centerX - radius, y: centerY + 40 }, toPos: { x: 160, y: 190 } },
    { from: "Admin", to: "center", label: "Configuration", fromPos: { x: 160, y: 450 }, toPos: { x: centerX - radius, y: centerY + 60 } },
    { from: "center", to: "Admin", label: "Reports", fromPos: { x: centerX - radius, y: centerY + 80 }, toPos: { x: 160, y: 470 } },
    { from: "center", to: "Apollo", label: "Enrich Request", fromPos: { x: centerX + radius, y: centerY - 60 }, toPos: { x: 640, y: 100 } },
    { from: "Apollo", to: "center", label: "Contact Data", fromPos: { x: 640, y: 120 }, toPos: { x: centerX + radius, y: centerY - 40 } },
    { from: "center", to: "Clearbit", label: "Company Query", fromPos: { x: centerX + radius, y: centerY - 20 }, toPos: { x: 640, y: 250 } },
    { from: "Clearbit", to: "center", label: "Company Info", fromPos: { x: 640, y: 270 }, toPos: { x: centerX + radius, y: centerY } },
    { from: "center", to: "Hunter", label: "Email Query", fromPos: { x: centerX + radius, y: centerY + 20 }, toPos: { x: 640, y: 400 } },
    { from: "Hunter", to: "center", label: "Email Data", fromPos: { x: 640, y: 420 }, toPos: { x: centerX + radius, y: centerY + 40 } },
    { from: "center", to: "OpenAI", label: "Score Request", fromPos: { x: centerX + radius, y: centerY + 60 }, toPos: { x: 640, y: 550 } },
    { from: "OpenAI", to: "center", label: "AI Score", fromPos: { x: 640, y: 570 }, toPos: { x: centerX + radius, y: centerY + 80 } },
  ];

  return (
    <svg viewBox="0 0 800 650" className="w-full h-full">
      <defs>
        <marker id="dfd-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
        </marker>
      </defs>

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" className="text-lg font-bold" fill="#1f2937">
        Data Flow Diagram (Level 0) - LeadCatch System
      </text>

      {/* Central Process Circle */}
      <circle cx={centerX} cy={centerY} r={radius} fill="white" stroke="#374151" strokeWidth="2" />
      <text x={centerX} y={centerY - 15} textAnchor="middle" className="text-sm font-bold" fill="#1f2937">
        0
      </text>
      <text x={centerX} y={centerY + 5} textAnchor="middle" className="text-sm font-semibold" fill="#1f2937">
        LeadCatch
      </text>
      <text x={centerX} y={centerY + 22} textAnchor="middle" className="text-sm font-semibold" fill="#1f2937">
        System
      </text>

      {/* External Entities */}
      {entities.map((entity, i) => (
        <g key={i}>
          <rect
            x={entity.x - 50}
            y={entity.y - 20}
            width={100}
            height={40}
            fill="white"
            stroke="#374151"
            strokeWidth="2"
          />
          <text x={entity.x} y={entity.y + 5} textAnchor="middle" className="text-sm font-semibold" fill="#1f2937">
            {entity.name}
          </text>
        </g>
      ))}

      {/* Data Flows */}
      {flows.map((flow, i) => (
        <g key={i}>
          <line
            x1={flow.fromPos.x}
            y1={flow.fromPos.y}
            x2={flow.toPos.x}
            y2={flow.toPos.y}
            stroke="#374151"
            strokeWidth="1.5"
            markerEnd="url(#dfd-arrow)"
          />
          <text
            x={(flow.fromPos.x + flow.toPos.x) / 2}
            y={(flow.fromPos.y + flow.toPos.y) / 2 - 5}
            textAnchor="middle"
            className="text-xs"
            fill="#4b5563"
          >
            {flow.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ERD Diagram Component
const ERDDiagram = () => {
  const entities = [
    {
      name: "USER",
      x: 100,
      y: 50,
      attributes: ["id: uuid PK", "email: string", "full_name: string", "created_at: timestamp"],
    },
    {
      name: "LEAD",
      x: 350,
      y: 50,
      attributes: [
        "id: uuid PK",
        "user_id: uuid FK",
        "company_id: uuid FK",
        "first_name: string",
        "last_name: string",
        "email: string",
        "lead_score: int",
        "status: enum",
      ],
    },
    {
      name: "COMPANY",
      x: 600,
      y: 50,
      attributes: ["id: uuid PK", "name: string", "domain: string", "industry: string", "size: string"],
    },
    {
      name: "CONTACT",
      x: 100,
      y: 320,
      attributes: ["id: uuid PK", "lead_id: uuid FK", "type: enum", "value: string", "is_primary: bool"],
    },
    {
      name: "ACTIVITY",
      x: 350,
      y: 320,
      attributes: ["id: uuid PK", "lead_id: uuid FK", "type: enum", "description: text", "created_at: timestamp"],
    },
    {
      name: "TAG",
      x: 600,
      y: 320,
      attributes: ["id: uuid PK", "name: string", "color: string"],
    },
  ];

  const relationships = [
    { from: { x: 200, y: 120 }, to: { x: 270, y: 120 }, label: "creates", fromCard: "1", toCard: "N" },
    { from: { x: 480, y: 120 }, to: { x: 520, y: 120 }, label: "belongs_to", fromCard: "N", toCard: "1" },
    { from: { x: 350, y: 220 }, to: { x: 350, y: 290 }, label: "has", fromCard: "1", toCard: "N" },
    { from: { x: 200, y: 350 }, to: { x: 270, y: 200 }, label: "has", fromCard: "N", toCard: "1" },
    { from: { x: 480, y: 200 }, to: { x: 520, y: 350 }, label: "tagged", fromCard: "N", toCard: "N" },
  ];

  return (
    <svg viewBox="0 0 750 520" className="w-full h-full">
      {/* Title */}
      <text x="375" y="25" textAnchor="middle" className="text-lg font-bold" fill="#1f2937">
        Entity Relationship Diagram - LeadCatch System
      </text>

      {/* Entities */}
      {entities.map((entity, i) => {
        const height = 30 + entity.attributes.length * 18;
        return (
          <g key={i}>
            {/* Entity header */}
            <rect x={entity.x - 80} y={entity.y} width={160} height={28} fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
            <text x={entity.x} y={entity.y + 19} textAnchor="middle" className="text-sm font-bold" fill="white">
              {entity.name}
            </text>
            {/* Entity body */}
            <rect
              x={entity.x - 80}
              y={entity.y + 28}
              width={160}
              height={height - 28}
              fill="white"
              stroke="#1e40af"
              strokeWidth="2"
            />
            {/* Attributes */}
            {entity.attributes.map((attr, j) => (
              <text
                key={j}
                x={entity.x - 70}
                y={entity.y + 48 + j * 18}
                className="text-xs"
                fill="#374151"
              >
                {attr}
              </text>
            ))}
          </g>
        );
      })}

      {/* Relationships */}
      {relationships.map((rel, i) => (
        <g key={i}>
          <line x1={rel.from.x} y1={rel.from.y} x2={rel.to.x} y2={rel.to.y} stroke="#374151" strokeWidth="1.5" />
          <text
            x={(rel.from.x + rel.to.x) / 2}
            y={(rel.from.y + rel.to.y) / 2 - 5}
            textAnchor="middle"
            className="text-xs italic"
            fill="#4b5563"
          >
            {rel.label}
          </text>
          <text x={rel.from.x + 5} y={rel.from.y - 5} className="text-xs font-semibold" fill="#1f2937">
            {rel.fromCard}
          </text>
          <text x={rel.to.x - 10} y={rel.to.y - 5} className="text-xs font-semibold" fill="#1f2937">
            {rel.toCard}
          </text>
        </g>
      ))}
    </svg>
  );
};

// Use Case Diagram Component
const UseCaseDiagram = () => {
  const actors = [
    { name: "User", x: 80, y: 200 },
    { name: "Admin", x: 80, y: 400 },
    { name: "System", x: 700, y: 300 },
  ];

  const useCases = [
    { name: "Parse Lead from URL", x: 300, y: 100 },
    { name: "Manual Lead Entry", x: 300, y: 180 },
    { name: "View Lead List", x: 300, y: 260 },
    { name: "Enrich Lead", x: 500, y: 180 },
    { name: "Score Lead", x: 500, y: 260 },
    { name: "Export Leads", x: 300, y: 340 },
    { name: "Manage Settings", x: 300, y: 420 },
    { name: "Generate Reports", x: 300, y: 500 },
    { name: "Call External APIs", x: 500, y: 340 },
    { name: "AI Analysis", x: 500, y: 420 },
  ];

  const connections = [
    { actor: 0, useCase: 0 },
    { actor: 0, useCase: 1 },
    { actor: 0, useCase: 2 },
    { actor: 0, useCase: 3 },
    { actor: 0, useCase: 5 },
    { actor: 1, useCase: 6 },
    { actor: 1, useCase: 7 },
    { actor: 2, useCase: 8 },
    { actor: 2, useCase: 9 },
  ];

  const includes = [
    { from: 3, to: 8, label: "<<include>>" },
    { from: 4, to: 9, label: "<<include>>" },
  ];

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      {/* Title */}
      <text x="400" y="30" textAnchor="middle" className="text-lg font-bold" fill="#1f2937">
        Use Case Diagram - LeadCatch System
      </text>

      {/* System boundary */}
      <rect x="200" y="60" width="400" height="500" fill="none" stroke="#374151" strokeWidth="2" strokeDasharray="10,5" rx="10" />
      <text x="400" y="80" textAnchor="middle" className="text-sm font-semibold" fill="#4b5563">
        LeadCatch System
      </text>

      {/* Actors (stick figures) */}
      {actors.map((actor, i) => (
        <g key={i}>
          {/* Head */}
          <circle cx={actor.x} cy={actor.y - 25} r={12} fill="white" stroke="#374151" strokeWidth="2" />
          {/* Body */}
          <line x1={actor.x} y1={actor.y - 13} x2={actor.x} y2={actor.y + 15} stroke="#374151" strokeWidth="2" />
          {/* Arms */}
          <line x1={actor.x - 15} y1={actor.y} x2={actor.x + 15} y2={actor.y} stroke="#374151" strokeWidth="2" />
          {/* Legs */}
          <line x1={actor.x} y1={actor.y + 15} x2={actor.x - 12} y2={actor.y + 35} stroke="#374151" strokeWidth="2" />
          <line x1={actor.x} y1={actor.y + 15} x2={actor.x + 12} y2={actor.y + 35} stroke="#374151" strokeWidth="2" />
          {/* Name */}
          <text x={actor.x} y={actor.y + 55} textAnchor="middle" className="text-sm font-semibold" fill="#1f2937">
            {actor.name}
          </text>
        </g>
      ))}

      {/* Use Cases (ovals) */}
      {useCases.map((uc, i) => (
        <g key={i}>
          <ellipse cx={uc.x} cy={uc.y} rx={80} ry={25} fill="white" stroke="#374151" strokeWidth="2" />
          <text x={uc.x} y={uc.y + 5} textAnchor="middle" className="text-xs" fill="#1f2937">
            {uc.name}
          </text>
        </g>
      ))}

      {/* Actor to Use Case connections */}
      {connections.map((conn, i) => {
        const actor = actors[conn.actor];
        const uc = useCases[conn.useCase];
        return (
          <line
            key={i}
            x1={actor.x + 20}
            y1={actor.y}
            x2={uc.x - 80}
            y2={uc.y}
            stroke="#374151"
            strokeWidth="1"
          />
        );
      })}

      {/* Include relationships */}
      {includes.map((inc, i) => {
        const from = useCases[inc.from];
        const to = useCases[inc.to];
        return (
          <g key={i}>
            <line
              x1={from.x + 80}
              y1={from.y}
              x2={to.x - 80}
              y2={to.y}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="5,3"
            />
            <text
              x={(from.x + to.x) / 2 + 40}
              y={(from.y + to.y) / 2 - 5}
              textAnchor="middle"
              className="text-xs italic"
              fill="#4b5563"
            >
              {inc.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Class Diagram Component
const ClassDiagram = () => {
  const classes = [
    {
      name: "LeadService",
      x: 200,
      y: 50,
      stereotype: "",
      attributes: ["- leads: Lead[]", "- enrichmentProvider: EnrichmentProvider"],
      methods: ["+parseLead(url): Lead", "+enrichLead(id): Lead", "+scoreLead(id): number", "+getLeads(): Lead[]"],
    },
    {
      name: "Lead",
      x: 500,
      y: 50,
      stereotype: "",
      attributes: [
        "- id: string",
        "- firstName: string",
        "- lastName: string",
        "- email: string",
        "- score: number",
        "- status: LeadStatus",
      ],
      methods: ["+getFullName(): string", "+updateScore(score): void", "+enrich(data): void"],
    },
    {
      name: "EnrichmentProvider",
      x: 200,
      y: 320,
      stereotype: "<<interface>>",
      attributes: [],
      methods: ["+enrich(lead): EnrichmentData", "+getProviderName(): string"],
    },
    {
      name: "ApolloProvider",
      x: 80,
      y: 480,
      stereotype: "",
      attributes: ["- apiKey: string"],
      methods: ["+enrich(lead): EnrichmentData", "+getProviderName(): string"],
    },
    {
      name: "ClearbitProvider",
      x: 320,
      y: 480,
      stereotype: "",
      attributes: ["- apiKey: string"],
      methods: ["+enrich(lead): EnrichmentData", "+getProviderName(): string"],
    },
    {
      name: "LeadStatus",
      x: 500,
      y: 320,
      stereotype: "<<enumeration>>",
      attributes: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"],
      methods: [],
    },
  ];

  return (
    <svg viewBox="0 0 700 620" className="w-full h-full">
      {/* Title */}
      <text x="350" y="25" textAnchor="middle" className="text-lg font-bold" fill="#1f2937">
        Class Diagram - LeadCatch System
      </text>

      {/* Classes */}
      {classes.map((cls, i) => {
        const hasStereotype = cls.stereotype !== "";
        const headerHeight = hasStereotype ? 45 : 28;
        const attrHeight = Math.max(cls.attributes.length * 16 + 8, 25);
        const methodHeight = cls.methods.length > 0 ? Math.max(cls.methods.length * 16 + 8, 25) : 0;

        return (
          <g key={i}>
            {/* Class header */}
            <rect
              x={cls.x - 90}
              y={cls.y}
              width={180}
              height={headerHeight}
              fill={hasStereotype ? (cls.stereotype.includes("interface") ? "#fef3c7" : "#dbeafe") : "#e0e7ff"}
              stroke="#374151"
              strokeWidth="2"
            />
            {hasStereotype ? (
              <>
                <text x={cls.x} y={cls.y + 17} textAnchor="middle" className="text-xs italic" fill="#4b5563">
                  {cls.stereotype}
                </text>
                <text x={cls.x} y={cls.y + 35} textAnchor="middle" className="text-sm font-bold" fill="#1f2937">
                  {cls.name}
                </text>
              </>
            ) : (
              <text x={cls.x} y={cls.y + 19} textAnchor="middle" className="text-sm font-bold" fill="#1f2937">
                {cls.name}
              </text>
            )}

            {/* Attributes section */}
            <rect
              x={cls.x - 90}
              y={cls.y + headerHeight}
              width={180}
              height={attrHeight}
              fill="white"
              stroke="#374151"
              strokeWidth="2"
            />
            {cls.attributes.map((attr, j) => (
              <text
                key={j}
                x={cls.x - 82}
                y={cls.y + headerHeight + 17 + j * 16}
                className="text-xs"
                fill="#374151"
              >
                {attr}
              </text>
            ))}

            {/* Methods section */}
            {cls.methods.length > 0 && (
              <>
                <rect
                  x={cls.x - 90}
                  y={cls.y + headerHeight + attrHeight}
                  width={180}
                  height={methodHeight}
                  fill="white"
                  stroke="#374151"
                  strokeWidth="2"
                />
                {cls.methods.map((method, j) => (
                  <text
                    key={j}
                    x={cls.x - 82}
                    y={cls.y + headerHeight + attrHeight + 17 + j * 16}
                    className="text-xs"
                    fill="#374151"
                  >
                    {method}
                  </text>
                ))}
              </>
            )}
          </g>
        );
      })}

      {/* Relationships */}
      {/* LeadService uses Lead */}
      <line x1={290} y1={100} x2={410} y2={100} stroke="#374151" strokeWidth="1.5" />
      <text x={350} y={90} textAnchor="middle" className="text-xs" fill="#4b5563">
        uses
      </text>

      {/* LeadService uses EnrichmentProvider */}
      <line x1={200} y1={200} x2={200} y2={290} stroke="#374151" strokeWidth="1.5" />
      <text x={215} y={250} className="text-xs" fill="#4b5563">
        uses
      </text>

      {/* Lead uses LeadStatus */}
      <line x1={500} y1={230} x2={500} y2={290} stroke="#374151" strokeWidth="1.5" />

      {/* Inheritance arrows (providers implement interface) */}
      <line x1={80} y1={450} x2={170} y2={400} stroke="#374151" strokeWidth="1.5" strokeDasharray="5,3" />
      <line x1={320} y1={450} x2={230} y2={400} stroke="#374151" strokeWidth="1.5" strokeDasharray="5,3" />
      <polygon points="170,400 160,410 180,410" fill="white" stroke="#374151" strokeWidth="1.5" />
      <polygon points="230,400 220,410 240,410" fill="white" stroke="#374151" strokeWidth="1.5" />
    </svg>
  );
};

// ============ DIAGRAM MAPPING ============
const DiagramComponents: Record<DiagramType, React.FC> = {
  erd: ERDDiagram,
  usecase: UseCaseDiagram,
  sequence: SequenceDiagram,
  dfd: DFDDiagram,
  class: ClassDiagram,
};

const diagramDescriptions: Record<DiagramType, { title: string; points: string[] }> = {
  erd: {
    title: "Entity Relationship Diagram (ERD)",
    points: [
      "Shows database entities: User, Lead, Company, Contact, Activity, Tag",
      "Primary keys (PK) and Foreign keys (FK) clearly marked",
      "Cardinality: 1 (one), N (many) relationships",
      "Attributes with data types for each entity",
    ],
  },
  usecase: {
    title: "Use Case Diagram",
    points: [
      "Actors: User, Admin, System (stick figures)",
      "Use cases shown as ovals inside system boundary",
      "<<include>> for mandatory sub-functionality",
      "Lines connect actors to their use cases",
    ],
  },
  sequence: {
    title: "Sequence Diagram",
    points: [
      "Shows lead capture and enrichment workflow over time",
      "5 participants: User, Frontend, API Server, LeadService, Database",
      "Activation boxes (rectangles) show processing duration",
      "Numbered messages (1-21) show order of interactions",
      "Solid arrows for requests, dashed arrows for responses",
    ],
  },
  dfd: {
    title: "Data Flow Diagram (Level 0)",
    points: [
      "Central process circle: LeadCatch System (labeled 0)",
      "External entities as rectangles around the process",
      "Labeled arrows show data flow direction",
      "Inputs: Lead URL, Manual Entry, Configuration",
      "Outputs: Lead List, Reports, API calls",
    ],
  },
  class: {
    title: "Class Diagram",
    points: [
      "Classes with attributes (-) and methods (+)",
      "<<interface>> EnrichmentProvider with implementations",
      "<<enumeration>> LeadStatus with possible values",
      "Inheritance shown with dashed lines and hollow arrows",
      "Associations: uses relationships between classes",
    ],
  },
};

export default function DiagramsPage() {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>("erd");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentDescription = diagramDescriptions[selectedDiagram];
  const DiagramComponent = DiagramComponents[selectedDiagram];

  const handleDownload = () => {
    const svgElement = document.querySelector("#diagram-container svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedDiagram}-diagram.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">LeadCatch Architecture</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download SVG
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                Fullscreen
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Diagrams
              </h2>
              <nav className="space-y-2">
                {diagrams.map((diagram) => (
                  <button
                    key={diagram.id}
                    onClick={() => setSelectedDiagram(diagram.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      selectedDiagram === diagram.id
                        ? `${diagram.bgColor} ${diagram.color} ring-2 ring-offset-2 ring-${diagram.color.split("-")[1]}-300`
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className={selectedDiagram === diagram.id ? diagram.color : "text-gray-400"}>
                      {diagram.icon}
                    </span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{diagram.title}</div>
                    </div>
                    {selectedDiagram === diagram.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Description Panel */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">{currentDescription.title}</h3>
                </div>
                <ul className="space-y-2">
                  {currentDescription.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-blue-500 mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={selectedDiagram}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  {diagrams.find((d) => d.id === selectedDiagram)?.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {diagrams.find((d) => d.id === selectedDiagram)?.description}
                </p>
              </div>
              <div
                id="diagram-container"
                className="p-8 bg-white min-h-[600px] flex items-center justify-center"
              >
                <DiagramComponent />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {diagrams.find((d) => d.id === selectedDiagram)?.title}
              </h2>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
              <div className="max-w-6xl w-full">
                <DiagramComponent />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Bubble */}
      <AIChatBubble
        diagramType={selectedDiagram}
        diagramTitle={diagrams.find((d) => d.id === selectedDiagram)?.title || "diagram"}
      />
    </div>
  );
}
