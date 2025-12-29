"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lock,
  Flame,
  Globe,
  Loader2,
} from "lucide-react";
import { StarsCanvas } from "@/components/ui/Stars";
import Link from "next/link";

export default function RoastPage() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<"input" | "analyzing" | "gate" | "result">("input");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

  const ANALYSIS_STEPS = [
    "Connecting to site...",
    "Scanning hero section...",
    "Analyzing value proposition...",
    "Checking call-to-action...",
    "Detecting clarity issues...",
    "Generating roast...",
  ];

  const startAnalysis = () => {
    if (!url) return;
    setStep("analyzing");
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setAnalysisProgress(progress);

      if (progress % 20 === 0 && progress < 100) {
        setCurrentAnalysisStep((prev) => prev + 1);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep("gate"), 500);
      }
    }, 50);
  };

  const unlockResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep("result");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      <StarsCanvas />

      <nav className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
            <Flame className="h-5 w-5" />
          </div>
          <span>RoastMyPage</span>
        </Link>
      </nav>

      <main className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col items-center justify-center py-20">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-medium text-sm mb-4">
                <Flame className="h-4 w-4" />
                AI Conversion Auditor
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Is your landing page{" "}
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  killing sales?
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Paste your URL. Our AI will brutally analyze your copy, design, and offer, then tell you exactly how to fix it.
              </p>

              <div className="max-w-xl mx-auto mt-12 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 p-2 shadow-2xl">
                  <div className="pl-4 text-gray-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-startup.com"
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === "Enter" && startAnalysis()}
                  />
                  <button
                    onClick={startAnalysis}
                    disabled={!url}
                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Roast It
                  </button>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Actionable Fixes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Brutally Honest</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-md text-center space-y-8"
            >
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" />
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="289.02652413026095"
                    strokeDashoffset={289.02652413026095 * (1 - analysisProgress / 100)}
                    className="text-orange-500 transition-all duration-200 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{analysisProgress}%</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Analyzing...</h2>
                <p className="text-gray-500 h-6">{ANALYSIS_STEPS[currentAnalysisStep]}</p>
              </div>

              <div className="space-y-2 max-w-xs mx-auto text-left">
                {ANALYSIS_STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm transition-colors ${
                      i < currentAnalysisStep
                        ? "text-green-500"
                        : i === currentAnalysisStep
                        ? "text-orange-500 font-medium"
                        : "text-gray-300 dark:text-gray-700"
                    }`}
                  >
                    {i < currentAnalysisStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : i === currentAnalysisStep ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-current opacity-20" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "gate" && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-800 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-600" />

              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                We found <span className="font-bold text-red-500">3 critical errors</span> that are hurting your conversion rate.
              </p>

              <form onSubmit={unlockResults} className="space-y-4">
                <div className="text-left">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Where should we send the report?
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ceo@startup.com"
                    className="w-full mt-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="h-5 w-5" />
                  Unlock My Roast
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-400">
                We&apos;ll also send you a weekly tip on CRO. Unsubscribe anytime.
              </p>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                  <h3 className="text-gray-500 font-medium mb-4">Conversion Score</h3>
                  <div className="relative mb-4">
                    <div className="text-7xl font-black bg-gradient-to-br from-orange-500 to-red-600 bg-clip-text text-transparent">62</div>
                    <div className="text-xl text-gray-400 font-medium">/ 100</div>
                  </div>
                  <div className="px-4 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-bold">
                    Needs Improvement
                  </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Flame className="h-32 w-32" />
                  </div>

                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    The Conversion Killer
                  </h3>

                  <div className="space-y-6 relative z-10">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-1 uppercase tracking-wider">Problem</p>
                      <p className="text-lg font-medium">&quot;Your headline is vague and self-centered.&quot;</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                        You&apos;re saying &quot;We build software&quot; instead of telling the user what problem you solve for <em>them</em>.
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-4">
                      <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-1 uppercase tracking-wider">The Fix</p>
                      <p className="text-lg font-medium">&quot;Automate your sales follow-ups and close 3x more deals.&quot;</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                        This focuses on the benefit (closing deals) and the mechanism (automation). It&apos;s specific and desirable.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Want to fix this automatically?</p>
                    <Link href="/signup" className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
                      Try LeadCatch Free <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
