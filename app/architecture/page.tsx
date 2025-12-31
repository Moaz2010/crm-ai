"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Send, 
  Loader2,
  Moon,
  Sun,
  Database,
  GitBranch,
  Workflow,
  Users,
  Code2
} from "lucide-react";
import {
  ERDDiagram,
  SequenceDiagram,
  DFDDiagram,
  UseCaseDiagram,
  ClassDiagram,
  DiagramType,
} from "@/components/diagrams/DiagramComponents";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Diagram data
const diagrams = [
  {
    id: "erd" as DiagramType,
    title: "Entity Relationship Diagram",
    description: "Database schema showing entities, attributes, and relationships for the LeadCatch module",
    icon: Database,
  },
  {
    id: "sequence" as DiagramType,
    title: "Sequence Diagram",
    description: "Interaction flow between system components during lead capture and processing",
    icon: GitBranch,
  },
  {
    id: "dfd" as DiagramType,
    title: "Data Flow Diagram",
    description: "Level 1 DFD showing data movement through LeadCatch processes",
    icon: Workflow,
  },
  {
    id: "usecase" as DiagramType,
    title: "Use Case Diagram",
    description: "System actors and their interactions with LeadCatch functionality",
    icon: Users,
  },
  {
    id: "class" as DiagramType,
    title: "Class Diagram",
    description: "Object-oriented structure of the LeadCatch module classes and interfaces",
    icon: Code2,
  },
];

// Get diagram component by type
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

// Markdown renderer for chat messages
const renderMarkdown = (text: string) => {
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let keyIndex = 0;

  // Handle code blocks first
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let processedText = "";
  const codeBlocks: { placeholder: string; content: string; language: string }[] = [];

  while ((match = codeBlockRegex.exec(remaining)) !== null) {
    processedText += remaining.slice(lastIndex, match.index);
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push({
      placeholder,
      content: match[2],
      language: match[1] || "text",
    });
    processedText += placeholder;
    lastIndex = match.index + match[0].length;
  }
  processedText += remaining.slice(lastIndex);

  // Split by lines for better rendering
  const lines = processedText.split("\n");
  
  return lines.map((line, lineIndex) => {
    // Check for code block placeholder
    const codeBlockMatch = line.match(/__CODE_BLOCK_(\d+)__/);
    if (codeBlockMatch) {
      const block = codeBlocks[parseInt(codeBlockMatch[1])];
      return (
        <pre key={`code-${lineIndex}`} className="bg-gray-800 text-green-400 p-3 rounded-lg my-2 overflow-x-auto text-sm">
          <code>{block.content}</code>
        </pre>
      );
    }

    // Process inline formatting
    let processed = line;
    const elements: (string | JSX.Element)[] = [];
    
    // Bold: **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIdx = 0;
    let boldMatch;
    
    while ((boldMatch = boldRegex.exec(processed)) !== null) {
      if (boldMatch.index > lastIdx) {
        elements.push(processed.slice(lastIdx, boldMatch.index));
      }
      elements.push(
        <strong key={`bold-${lineIndex}-${boldMatch.index}`} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
      lastIdx = boldMatch.index + boldMatch[0].length;
    }
    
    if (lastIdx < processed.length) {
      elements.push(processed.slice(lastIdx));
    }
    
    // If no formatting was applied, use original
    if (elements.length === 0) {
      elements.push(processed);
    }

    return (
      <span key={`line-${lineIndex}`}>
        {elements}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
};

export default function ArchitecturePage() {
  const [currentDiagram, setCurrentDiagram] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your architecture assistant. Ask me anything about the LeadCatch module diagrams, system design, or implementation details!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      inputRef.current?.focus();
    }
  }, [isChatOpen]);

  const nextDiagram = () => {
    setCurrentDiagram((prev) => (prev + 1) % diagrams.length);
  };

  const prevDiagram = () => {
    setCurrentDiagram((prev) => (prev - 1 + diagrams.length) % diagrams.length);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/diagrams/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          currentDiagram: diagrams[currentDiagram].title,
          diagramContext: diagrams[currentDiagram].description,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentDiagramData = diagrams[currentDiagram];
  const IconComponent = currentDiagramData.icon;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gray-950 text-white" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    }`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-sm sticky top-0 z-40 ${
        isDarkMode 
          ? "bg-gray-900/90 border-gray-800" 
          : "bg-white/80 border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
              }`}>
                <IconComponent className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  LeadCatch Architecture
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  System Design & Documentation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Diagram Navigation */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {diagrams.map((diagram, index) => {
            const Icon = diagram.icon;
            return (
              <button
                key={diagram.id}
                onClick={() => setCurrentDiagram(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentDiagram === index
                    ? isDarkMode
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-blue-600 text-white shadow-lg"
                    : isDarkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{diagram.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Diagram Card */}
        <motion.div
          key={currentDiagram}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl shadow-xl overflow-hidden ${
            isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
          }`}
        >
          {/* Diagram Header */}
          <div className={`px-6 py-4 border-b ${
            isDarkMode ? "border-gray-800" : "border-gray-100"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {currentDiagramData.title}
                </h2>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {currentDiagramData.description}
                </p>
              </div>
              <div className={`text-sm font-medium ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}>
                {currentDiagram + 1} / {diagrams.length}
              </div>
            </div>
          </div>

          {/* Diagram Content */}
          <div className={`relative ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            {/* Navigation Arrows */}
            <button
              onClick={prevDiagram}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all ${
                isDarkMode 
                  ? "bg-gray-800 hover:bg-gray-700 text-white" 
                  : "bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextDiagram}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg transition-all ${
                isDarkMode 
                  ? "bg-gray-800 hover:bg-gray-700 text-white" 
                  : "bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* SVG Diagram */}
            <div className="p-8 overflow-auto min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDiagramData.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex flex-col items-center"
                >
                  {getDiagramComponent(currentDiagramData.id, isDarkMode)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="font-medium">Close</span>
            </button>

            {/* Dark Mode Toggle in Fullscreen */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="absolute top-4 left-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Navigation in Fullscreen */}
            <button
              onClick={prevDiagram}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextDiagram}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Diagram Title */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white text-center">
              <h2 className="text-xl font-bold">{currentDiagramData.title}</h2>
              <p className="text-sm text-gray-400">{currentDiagram + 1} / {diagrams.length}</p>
            </div>

            {/* Fullscreen Diagram */}
            <div className={`w-full h-full flex flex-col items-center justify-center p-16 pt-24 ${
              isDarkMode ? "bg-gray-950" : "bg-gray-900"
            }`}>
              <div className="w-full max-w-6xl">
                {getDiagramComponent(currentDiagramData.id, true)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`absolute bottom-16 right-0 w-96 rounded-2xl shadow-2xl overflow-hidden ${
                isDarkMode 
                  ? "bg-gray-900 border border-gray-800" 
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Chat Header */}
              <div className={`px-4 py-3 flex items-center justify-between ${
                isDarkMode ? "bg-gray-800" : "bg-blue-600"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">Architecture Assistant</h3>
                    <p className="text-white/70 text-xs">Ask about the diagrams</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className={`h-80 overflow-y-auto p-4 space-y-3 ${
                isDarkMode ? "bg-gray-900" : "bg-gray-50"
              }`}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-200 rounded-bl-md"
                          : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{renderMarkdown(msg.content)}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`px-4 py-2 rounded-2xl rounded-bl-md ${
                      isDarkMode ? "bg-gray-800" : "bg-white shadow-sm"
                    }`}>
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className={`p-3 border-t ${
                isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
              }`}>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about the architecture..."
                    className={`flex-1 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? "bg-gray-800 text-white placeholder-gray-500" 
                        : "bg-gray-100 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-4 rounded-full shadow-lg transition-colors ${
            isChatOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  );
}
