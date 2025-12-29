"use client";

import React, { useState } from "react";
import {
  Link as LinkIcon,
  FileText,
  Globe,
  Sparkles,
  Check,
  Loader2,
  Building2,
  Mail,
  Linkedin,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StarsCanvas } from "@/components/ui/Stars";

export default function LeadCapturePage() {
  const [activeTab, setActiveTab] = useState("url");
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [capturedData, setCapturedData] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!capturedData) return;

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: capturedData.name?.split(' ')[0] || '',
          last_name: capturedData.name?.split(' ').slice(1).join(' ') || '',
          email: capturedData.email || '',
          company: capturedData.company,
          job_title: capturedData.role,
          linkedin_url: capturedData.linkedin,
          location: capturedData.location,
          source: 'ai_capture',
          status: 'new',
          score: capturedData.confidenceScore || 50,
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
          setCapturedData(null);
          setInputValue("");
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to save lead:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!inputValue) return;

    setIsAnalyzing(true);
    setAnalysisStep(0);

    const steps = [
      "Fetching page content...",
      "Parsing structure...",
      "Extracting contact details...",
      "Enriching with public data...",
      "Finalizing profile...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalysisStep(currentStep);
      }
    }, 800);

    try {
      const response = await fetch('/api/leads/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab === 'url' ? 'url' : 'text',
          content: inputValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCapturedData(data);
      }
      setAnalysisStep(steps.length);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 relative overflow-hidden transition-colors duration-300">
      <StarsCanvas />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Lead Capture
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Paste a URL or text, and let our AI extract and enrich the details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              {[
                { id: "url", label: "Website / LinkedIn", icon: Globe },
                { id: "text", label: "Paste Text", icon: FileText },
                { id: "manual", label: "Manual", icon: LinkIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-black text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                {activeTab === "url" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Profile or Company URL
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity blur-lg" />
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                          className="relative w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 py-4 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        AI will extract name, role, company, and contact info.
                      </p>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Analyze & Capture
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {activeTab === "text" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Raw Text
                      </label>
                      <textarea
                        rows={8}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Paste email signature, bio, or any text here..."
                        className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 py-4 outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                    <button
                      onClick={handleAnalyze}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      <Sparkles className="h-5 w-5" />
                      Process Text
                    </button>
                  </motion.div>
                )}

                {activeTab === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input type="text" className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3" placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input type="text" className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input type="email" className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3" placeholder="john@company.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input type="text" className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3" placeholder="Acme Inc." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Job Title</label>
                      <input type="text" className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3" placeholder="Marketing Manager" />
                    </div>
                    <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors">
                      <Check className="h-5 w-5 inline mr-2" />
                      Save Lead
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      <span className="font-medium text-blue-500">AI Processing</span>
                    </div>
                    <div className="space-y-2">
                      {["Fetching page content...", "Parsing structure...", "Extracting contact details...", "Enriching with public data...", "Finalizing profile..."].map((step, index) => (
                        <div
                          key={step}
                          className={`flex items-center gap-3 text-sm transition-colors ${
                            index < analysisStep ? "text-green-500" : index === analysisStep ? "text-blue-400" : "text-gray-600"
                          }`}
                        >
                          {index < analysisStep ? <Check className="h-4 w-4" /> : <div className={`h-1.5 w-1.5 rounded-full ${index === analysisStep ? "bg-blue-400 animate-pulse" : "bg-gray-600"}`} />}
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {capturedData ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
                  <div className="h-full rounded-2xl border border-green-500/20 bg-green-500/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 text-xs font-bold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {capturedData.confidenceScore || 75}% Confidence
                      </div>
                    </div>

                    <div className="mb-6 pt-8">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
                        {capturedData.name?.charAt(0) || 'L'}
                      </div>
                      <h3 className="text-2xl font-bold">{capturedData.name || "Unknown Name"}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{capturedData.role || capturedData.job_title}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>{capturedData.company || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{capturedData.email || "No email found"}</span>
                      </div>
                      {capturedData.linkedin && (
                        <div className="flex items-center gap-3 text-sm">
                          <Linkedin className="h-4 w-4 text-gray-400" />
                          <span className="text-blue-500">{capturedData.linkedin}</span>
                        </div>
                      )}
                      {capturedData.location && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{capturedData.location}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={isSaved}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSaved ? (
                        <>
                          <Check className="h-5 w-5" />
                          Saved Successfully!
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          Save to Leads
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to Capture</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Results will appear here after analysis.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
