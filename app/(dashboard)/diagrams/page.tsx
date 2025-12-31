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
  MessageCircle,
  Send,
  Sparkles,
  Loader2,
  Bot,
  User,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
} from "lucide-react";
import {
  ERDDiagram,
  SequenceDiagram,
  DFDDiagram,
  UseCaseDiagram,
  ClassDiagram,
  DiagramType,
} from "@/components/diagrams/DiagramComponents";

// AI Chat Message Interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Simple markdown renderer for chat messages
const renderMarkdown = (text: string | undefined | null): React.ReactNode => {
  // Handle undefined/null/empty text
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lines = text.split("\n");
  
  return lines.map((line, lineIndex) => {
    // Skip code block markers
    if (line.startsWith("```")) {
      return null;
    }

    // Process inline formatting
    let elements: React.ReactNode[] = [];

    // Process bold **text**
    const boldParts = line.split(/\*\*([^*]+)\*\*/g);
    if (boldParts.length > 1) {
      elements = boldParts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={`bold-${lineIndex}-${i}`} className="font-bold">{part}</strong>;
        }
        return part;
      }).filter(Boolean);
    } else {
      // Process italic *text*
      const italicParts = line.split(/\*([^*]+)\*/g);
      if (italicParts.length > 1) {
        elements = italicParts.map((part, i) => {
          if (i % 2 === 1) {
            return <em key={`italic-${lineIndex}-${i}`} className="italic">{part}</em>;
          }
          return part;
        }).filter(Boolean);
      } else {
        // Process inline code `code`
        const codeParts = line.split(/`([^`]+)`/g);
        if (codeParts.length > 1) {
          elements = codeParts.map((part, i) => {
            if (i % 2 === 1) {
              return (
                <code key={`code-${lineIndex}-${i}`} className="bg-gray-700 text-green-400 px-1.5 py-0.5 rounded text-xs font-mono">
                  {part}
                </code>
              );
            }
            return part;
          }).filter(Boolean);
        } else {
          elements = [line];
        }
      }
    }

    // Handle bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      return (
        <div key={`line-${lineIndex}`} className="flex items-start gap-2 my-1">
          <span className="text-blue-400 mt-0.5">•</span>
          <span>{elements.length > 0 ? elements : line.slice(2)}</span>
        </div>
      );
    }

    // Handle numbered lists
    const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      return (
        <div key={`line-${lineIndex}`} className="flex items-start gap-2 my-1">
          <span className="text-blue-400 font-medium min-w-[1.5rem]">{numberedMatch[1]}.</span>
          <span>{numberedMatch[2]}</span>
        </div>
      );
    }

    // Handle headers
    if (line.startsWith("### ")) {
      return <h4 key={`line-${lineIndex}`} className="font-bold text-sm mt-3 mb-1">{line.slice(4)}</h4>;
    }
    if (line.startsWith("## ")) {
      return <h3 key={`line-${lineIndex}`} className="font-bold text-base mt-3 mb-1">{line.slice(3)}</h3>;
    }
    if (line.startsWith("# ")) {
      return <h2 key={`line-${lineIndex}`} className="font-bold text-lg mt-3 mb-1">{line.slice(2)}</h2>;
    }

    // Empty line = paragraph break
    if (line.trim() === "") {
      return <div key={`line-${lineIndex}`} className="h-2" />;
    }

    return (
      <span key={`line-${lineIndex}`}>
        {elements.length > 0 ? elements : line}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

// AI Chat Bubble Component
const AIChatBubble = ({ diagramType, diagramTitle, isDarkMode }: { diagramType: string; diagramTitle: string; isDarkMode: boolean }) => {
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
            className={`fixed bottom-24 right-6 z-50 w-96 h-[500px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${
              isDarkMode 
                ? "bg-gray-900 border-gray-700" 
                : "bg-white border-gray-200"
            }`}
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
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isDarkMode ? "bg-gray-900" : "bg-gray-50"
            }`}>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
                  }`}>
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Hi! I'm your Diagram Assistant
                  </h4>
                  <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
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
                          className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            isDarkMode 
                              ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50" 
                              : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                          }`}
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
                      }`}>
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-200 rounded-bl-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{renderMarkdown(msg.content)}</div>
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
                  }`}>
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className={`rounded-2xl rounded-bl-md px-4 py-3 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              isDarkMode 
                ? "border-gray-700 bg-gray-800" 
                : "border-gray-200 bg-gray-50"
            }`}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about this diagram..."
                  className={`flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? "bg-gray-900 border-gray-600 text-white placeholder-gray-500" 
                      : "border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
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
              <p className={`text-xs text-center mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                Powered by GPT-4o-mini
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface DiagramInfo {
  id: DiagramType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  darkBgColor: string;
}

const diagrams: DiagramInfo[] = [
  {
    id: "erd",
    title: "Entity Relationship Diagram",
    description: "Database schema showing entities, attributes, and relationships",
    icon: <Database className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    darkBgColor: "bg-blue-900/30 hover:bg-blue-900/50",
  },
  {
    id: "usecase",
    title: "Use Case Diagram",
    description: "System functionality from user perspective with actors and use cases",
    icon: <Users className="w-5 h-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
    darkBgColor: "bg-green-900/30 hover:bg-green-900/50",
  },
  {
    id: "sequence",
    title: "Sequence Diagram",
    description: "Object interactions arranged in time sequence",
    icon: <GitBranch className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    darkBgColor: "bg-purple-900/30 hover:bg-purple-900/50",
  },
  {
    id: "dfd",
    title: "Data Flow Diagram",
    description: "Flow of data through the system processes",
    icon: <Workflow className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    darkBgColor: "bg-orange-900/30 hover:bg-orange-900/50",
  },
  {
    id: "class",
    title: "Class Diagram",
    description: "System structure showing classes, attributes, methods, and relationships",
    icon: <BoxesIcon className="w-5 h-5" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    darkBgColor: "bg-pink-900/30 hover:bg-pink-900/50",
  },
];

// Get diagram component with dark mode support
const getDiagramComponent = (type: DiagramType, isDarkMode: boolean) => {
  const props = { isDarkMode };
  switch (type) {
    case "erd":
      return <ERDDiagram {...props} />;
    case "sequence":
      return <SequenceDiagram {...props} />;
    case "dfd":
      return <DFDDiagram {...props} showLevelSelector={true} />;
    case "usecase":
      return <UseCaseDiagram {...props} />;
    case "class":
      return <ClassDiagram {...props} />;
    default:
      return <ERDDiagram {...props} />;
  }
};

const diagramDescriptions: Record<DiagramType, { title: string; points: string[] }> = {
  erd: {
    title: "Entity Relationship Diagram (ERD)",
    points: [
      "Shows database entities: User, Lead, Company, Contact, Activity, Tag",
      "Primary keys (PK) and Foreign keys (FK) clearly marked",
      "Cardinality: 1 (one), N (many) relationships with crow's foot notation",
      "Color-coded entities for visual distinction",
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
    title: "Data Flow Diagram (Level 1)",
    points: [
      "Processes shown as rounded rectangles with ID numbers (1.0-5.0)",
      "External entities as plain rectangles (User, Admin, External APIs)",
      "Data stores shown as open-ended rectangles (D1, D2)",
      "Labeled arrows show data flow direction",
    ],
  },
  class: {
    title: "Class Diagram",
    points: [
      "Classes with attributes (-) and methods (+)",
      "<<interface>> EnrichmentProvider with implementations",
      "<<enumeration>> LeadStatus with possible values",
      "Inheritance shown with hollow arrow heads",
      "Associations: uses relationships between classes",
    ],
  },
};

export default function DiagramsPage() {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>("erd");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Zoom and Pan state for fullscreen
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom when changing diagrams or closing fullscreen
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [selectedDiagram, isFullscreen]);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      e.preventDefault();
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const currentDescription = diagramDescriptions[selectedDiagram];

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
    <div className={`min-h-screen p-8 transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gray-950" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              LeadCatch Architecture Diagrams
            </h1>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              System documentation with UML diagrams
            </p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
                : "bg-white hover:bg-gray-100 text-gray-600 shadow-sm border border-gray-200"
            }`}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className={`rounded-xl shadow-sm border p-4 sticky top-8 ${
              isDarkMode 
                ? "bg-gray-900 border-gray-800" 
                : "bg-white border-gray-200"
            }`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Diagrams
              </h2>
              <nav className="space-y-2">
                {diagrams.map((diagram) => (
                  <button
                    key={diagram.id}
                    onClick={() => setSelectedDiagram(diagram.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      selectedDiagram === diagram.id
                        ? isDarkMode
                          ? `${diagram.darkBgColor} ${diagram.color} ring-2 ring-offset-2 ring-offset-gray-900`
                          : `${diagram.bgColor} ${diagram.color} ring-2 ring-offset-2`
                        : isDarkMode
                        ? "hover:bg-gray-800 text-gray-300"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className={selectedDiagram === diagram.id ? diagram.color : isDarkMode ? "text-gray-500" : "text-gray-400"}>
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
              <div className={`mt-6 pt-6 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h3 className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {currentDescription.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {currentDescription.points.map((point, i) => (
                    <li key={i} className={`flex items-start gap-2 text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <span className="text-blue-500 mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className={`mt-6 pt-6 border-t space-y-2 ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
                <button
                  onClick={handleDownload}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDarkMode 
                      ? "text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700" 
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download SVG
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                  Fullscreen
                </button>
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
              className={`rounded-xl shadow-sm border overflow-hidden ${
                isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
              }`}
            >
              <div className={`p-4 border-b ${
                isDarkMode ? "border-gray-800 bg-gray-800/50" : "border-gray-200 bg-gray-50"
              }`}>
                <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {diagrams.find((d) => d.id === selectedDiagram)?.title}
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {diagrams.find((d) => d.id === selectedDiagram)?.description}
                </p>
              </div>
              <div
                id="diagram-container"
                className={`p-8 min-h-[600px] ${
                  isDarkMode ? "bg-gray-950" : "bg-white"
                }`}
              >
                <div className="w-full flex flex-col items-center">
                  {getDiagramComponent(selectedDiagram, isDarkMode)}
                </div>
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
            className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200"
            }`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {diagrams.find((d) => d.id === selectedDiagram)?.title}
              </h2>
              <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span className="font-medium">Close</span>
                </button>
              </div>
            </div>

            {/* Diagram Area with Zoom/Pan */}
            <div 
              className={`flex-1 overflow-hidden flex items-center justify-center ${
                isDarkMode ? "bg-gray-950" : "bg-gray-50"
              } ${isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"}`}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                className="max-w-6xl w-full p-8 select-none transition-transform duration-75"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                  transformOrigin: 'center center',
                  pointerEvents: isDragging ? 'none' : 'auto',
                }}
              >
                {getDiagramComponent(selectedDiagram, isDarkMode)}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className={`flex items-center justify-center gap-4 p-4 border-t ${
              isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
            }`}>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className={`p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDarkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <div className={`px-4 py-2 rounded-lg min-w-[80px] text-center ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
              }`}>
                <span className="font-medium">{Math.round(zoom * 100)}%</span>
              </div>
              
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className={`p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDarkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              
              <div className={`w-px h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`} />
              
              <button
                onClick={handleResetZoom}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Reset View"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              {zoom > 1 && (
                <div className={`flex items-center gap-2 ml-4 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <Move className="w-4 h-4" />
                  <span>Drag to pan</span>
                </div>
              )}
              
              <div className={`ml-auto text-xs ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}>
                Scroll to zoom
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Bubble */}
      <AIChatBubble
        diagramType={selectedDiagram}
        diagramTitle={diagrams.find((d) => d.id === selectedDiagram)?.title || "diagram"}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
