"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Step from "./Step";
import ProgressBar from "./ProgressBar";

import { StarsCanvas } from "@/components/ui/Stars";

// Form Data Interface
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  website: string;
  role: string;
  industry: string;
  industryOther?: string;
  reason: string;
  consent: boolean;
}

const INITIAL_DATA: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  website: "",
  role: "",
  industry: "",
  industryOther: "",
  reason: "",
  consent: false,
};

const QUESTIONS = [
  {
    id: "name",
    title: "Let's start with your name",
    description: "So we know who we're talking to.",
    type: "text-split",
    fields: [
      { name: "firstName", placeholder: "First name", required: true },
      { name: "lastName", placeholder: "Last name", required: true },
    ],
  },
  {
    id: "contact",
    title: "How can we reach you?",
    description: "We'll send the details here.",
    type: "contact-split",
    fields: [
      {
        name: "email",
        placeholder: "name@example.com",
        required: true,
        type: "email",
      },
      {
        name: "phone",
        placeholder: "+1 (555) 000-0000",
        required: true,
        type: "tel",
      },
    ],
  },
  {
    id: "company",
    title: "Tell us about your company",
    description: "We'll use AI to find more info.",
    type: "text-split",
    fields: [
      { name: "companyName", placeholder: "Company Name", required: false },
      { name: "website", placeholder: "Company Website", required: false },
    ],
  },
  {
    id: "role",
    title: "What is your role?",
    description: "Help us prioritize your request.",
    type: "text",
    field: {
      name: "role",
      placeholder: "e.g. Marketing Manager",
      required: false,
    },
  },
  {
    id: "industry",
    title: "Which industry are you in?",
    description: "Select the one that fits best.",
    type: "select",
    field: {
      name: "industry",
      options: ["Technology", "Finance", "Healthcare", "Retail", "Other"],
      required: false,
    },
  },
  {
    id: "reason",
    title: "How can we help you?",
    description: "Briefly describe your interest.",
    type: "textarea",
    field: {
      name: "reason",
      placeholder: "Type your answer here...",
      required: false,
    },
  },
  {
    id: "consent",
    title: "One last thing...",
    description: "We need your permission to process your data.",
    type: "checkbox",
    field: {
      name: "consent",
      label: "I agree to the privacy policy",
      required: true,
    },
  },
];

export default function LeadForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validateStep = useCallback(() => {
    const currentQuestion = QUESTIONS[currentStep];
    if (
      currentQuestion.type === "text-split" ||
      currentQuestion.type === "contact-split"
    ) {
      const valid = currentQuestion.fields?.every((field) => {
        const value = (formData as any)[field.name]?.trim();

        if (field.required && (!value || value.length === 0)) {
          return false;
        }

        if (value && value.length > 0) {
          if (field.name === "email") {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }
          if (field.name === "phone") {
            return /^[\d\s+\-()]+$/.test(value) && /\d/.test(value);
          }
        }
        return true;
      });
      return valid;
    }
    if (currentQuestion.type === "email") {
      const email = (formData as any)[currentQuestion.field!.name];
      return email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
    if (currentQuestion.field?.required) {
      const value = (formData as any)[currentQuestion.field!.name];
      if (typeof value === "boolean") return value;
      return value?.trim().length > 0;
    }
    return true;
  }, [currentStep, formData]);

  const handleNext = useCallback(() => {
    if (!validateStep()) {
      const formContainer = document.querySelector(".form-container");
      formContainer?.classList.add("shake");
      setTimeout(() => formContainer?.classList.remove("shake"), 500);
      return;
    }

    if (currentStep < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentStep((prev: number) => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev: number) => prev - 1);
    }
  }, [currentStep]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        if (QUESTIONS[currentStep].type !== "textarea") {
          e.preventDefault();
          handleNext();
        }
      }
    },
    [handleNext, currentStep]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
        <StarsCanvas />
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
          }}
        />

        <div className="relative z-10 text-center max-w-md mx-auto p-8 animate-in zoom-in-95 duration-500">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-6 ring-1 ring-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
              <Check className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
            All done!
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-12 font-light">
            We&apos;ll be in touch shortly.
          </p>

          <div className="space-y-4">
            <a
              href="/dashboard/appointments"
              className="block w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              View Appointments
            </a>
            <a
              href="/dashboard/communication"
              className="block w-full text-gray-500 dark:text-gray-400 py-4 font-medium hover:text-black dark:hover:text-white transition-colors"
            >
              Check Communication
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-black font-sans text-black dark:text-white selection:bg-blue-500/30 transition-colors duration-300">
      <StarsCanvas />

      {/* Spotlight Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
        }}
      />

      {/* Progress Bar */}
      <div className="relative z-10 w-full px-8 pt-8">
        <ProgressBar progress={progress} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-8 perspective-[1000px]">
        <div
          className="form-container w-full max-w-5xl relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <Step key={currentStep} direction={direction}>
              <div className="mb-16 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
                  <span className="text-[12rem] md:text-[20rem] font-bold text-black/[0.02] dark:text-white/[0.02] leading-none select-none font-mono blur-sm">
                    {(currentStep + 1).toString().padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mb-8 text-5xl font-bold md:text-7xl bg-gradient-to-b from-black via-black to-gray-500 dark:from-white dark:via-white dark:to-gray-500 bg-clip-text text-transparent tracking-tight leading-tight">
                  {currentQuestion.title}
                </h2>
                <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 font-light tracking-wide">
                  {currentQuestion.description}
                </p>
              </div>

              <div className="space-y-12 max-w-3xl mx-auto">
                {(currentQuestion.type === "text-split" ||
                  currentQuestion.type === "contact-split") && (
                  <div className="flex flex-col gap-12 sm:flex-row">
                    {currentQuestion.fields?.map((field) => (
                      <div key={field.name} className="group relative w-full">
                        <input
                          type={(field as any).type || "text"}
                          placeholder={field.placeholder}
                          value={(formData as any)[field.name]}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          className="w-full border-b-2 border-black/10 dark:border-white/10 bg-transparent pt-4 pb-8 text-3xl md:text-4xl outline-none transition-all focus:border-blue-500 placeholder:text-black/10 dark:placeholder:text-white/10 text-center font-light leading-relaxed"
                          autoFocus={
                            field.name === currentQuestion.fields![0].name
                          }
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "email" && (
                  <div className="group relative w-full">
                    <input
                      type="email"
                      placeholder={currentQuestion.field?.placeholder}
                      value={(formData as any)[currentQuestion.field!.name]}
                      onChange={(e) =>
                        handleChange(
                          currentQuestion.field!.name,
                          e.target.value
                        )
                      }
                      className="w-full border-b-2 border-black/10 dark:border-white/10 bg-transparent pt-4 pb-8 text-4xl md:text-5xl outline-none transition-all focus:border-blue-500 placeholder:text-black/10 dark:placeholder:text-white/10 text-center font-light leading-relaxed"
                      autoFocus
                    />
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                  </div>
                )}

                {currentQuestion.type === "text" && (
                  <div className="group relative w-full">
                    <input
                      type="text"
                      placeholder={currentQuestion.field?.placeholder}
                      value={(formData as any)[currentQuestion.field!.name]}
                      onChange={(e) =>
                        handleChange(
                          currentQuestion.field!.name,
                          e.target.value
                        )
                      }
                      className="w-full border-b-2 border-black/10 dark:border-white/10 bg-transparent pt-4 pb-8 text-4xl md:text-5xl outline-none transition-all focus:border-blue-500 placeholder:text-black/10 dark:placeholder:text-white/10 text-center font-light leading-relaxed"
                      autoFocus
                    />
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                  </div>
                )}

                {currentQuestion.type === "textarea" && (
                  <div className="group relative w-full">
                    <textarea
                      placeholder={currentQuestion.field?.placeholder}
                      value={(formData as any)[currentQuestion.field!.name]}
                      onChange={(e) =>
                        handleChange(
                          currentQuestion.field!.name,
                          e.target.value
                        )
                      }
                      className="w-full resize-none border-b-2 border-black/10 dark:border-white/10 bg-transparent pt-4 pb-8 text-3xl md:text-4xl outline-none transition-all focus:border-blue-500 placeholder:text-black/10 dark:placeholder:text-white/10 text-center font-light leading-relaxed"
                      rows={2}
                      autoFocus
                    />
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                  </div>
                )}

                {currentQuestion.type === "select" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {currentQuestion.field?.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            handleChange(currentQuestion.field!.name, option);
                            if (option !== "Other") {
                              setTimeout(handleNext, 300);
                            }
                          }}
                          className={cn(
                            "group relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-6 py-4 text-left transition-all hover:border-blue-500 hover:scale-[1.02]",
                            (formData as any)[currentQuestion.field!.name] ===
                              option && "border-blue-500 bg-blue-500/20"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="relative flex items-center justify-between">
                            <span className="text-xl font-light">{option}</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 dark:border-white/20 text-xs text-gray-600 dark:text-gray-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                              {option.charAt(0)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Show input if "Other" is selected */}
                    {(formData as any)[currentQuestion.field!.name] ===
                      "Other" && (
                      <div className="group relative w-full animate-in fade-in slide-in-from-top-4 duration-300">
                        <input
                          type="text"
                          placeholder="Please specify..."
                          value={(formData as any)["industryOther"] || ""}
                          onChange={(e) =>
                            handleChange("industryOther", e.target.value)
                          }
                          className="w-full border-b-2 border-black/10 dark:border-white/10 bg-transparent pt-4 pb-8 text-2xl outline-none transition-all focus:border-blue-500 placeholder:text-black/10 dark:placeholder:text-white/10 text-center font-light leading-relaxed"
                          autoFocus
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                      </div>
                    )}
                  </div>
                )}

                {currentQuestion.type === "checkbox" && (
                  <label className="flex cursor-pointer items-center justify-center gap-8 text-3xl group py-12">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                        (formData as any)[currentQuestion.field!.name]
                          ? "border-blue-500 bg-blue-500 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                          : "border-black/20 dark:border-white/20 group-hover:border-blue-400"
                      )}
                    >
                      {(formData as any)[currentQuestion.field!.name] && (
                        <Check className="h-10 w-10 text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={(formData as any)[currentQuestion.field!.name]}
                      onChange={(e) =>
                        handleChange(
                          currentQuestion.field!.name,
                          e.target.checked
                        )
                      }
                    />
                    <span className="group-hover:text-black dark:group-hover:text-white transition-colors font-light text-gray-600 dark:text-gray-300">
                      {currentQuestion.field?.label}
                    </span>
                  </label>
                )}

                <div className="mt-16 flex items-center justify-center gap-4">
                  <button
                    onClick={handleNext}
                    className="group relative flex items-center gap-4 rounded-full bg-black dark:bg-white px-12 py-6 text-xl font-bold text-white dark:text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : currentStep === QUESTIONS.length - 1
                      ? "Finish"
                      : "Continue"}
                    {!isSubmitting && (
                      <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                    )}
                  </button>
                </div>

                <div className="text-center mt-8">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-mono uppercase tracking-widest">
                    press{" "}
                    <strong className="text-black dark:text-white">
                      Enter ↵
                    </strong>
                  </span>
                </div>
              </div>
            </Step>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-12 right-12 z-20 flex gap-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-black dark:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 disabled:opacity-0"
        >
          <ChevronRight className="h-6 w-6 rotate-180" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === QUESTIONS.length - 1}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-black dark:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 disabled:opacity-0"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
