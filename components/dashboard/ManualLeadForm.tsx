"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Step from "@/components/Step";
import ProgressBar from "@/components/ProgressBar";

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
  winProbability: number;
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
  winProbability: 50,
  consent: false,
};

const QUESTIONS = [
  {
    id: "name",
    title: "Lead Name",
    description: "Who is this lead?",
    type: "text-split",
    fields: [
      { name: "firstName", placeholder: "First name", required: true },
      { name: "lastName", placeholder: "Last name", required: true },
    ],
  },
  {
    id: "contact",
    title: "Contact Details",
    description: "How can we reach them?",
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
    title: "Company Information",
    description: "Where do they work?",
    type: "text-split",
    fields: [
      { name: "companyName", placeholder: "Company Name", required: false },
      { name: "website", placeholder: "Company Website", required: false },
    ],
  },
  {
    id: "role",
    title: "Role & Industry",
    description: "What do they do?",
    type: "text",
    field: {
      name: "role",
      placeholder: "e.g. Marketing Manager",
      required: false,
    },
  },
  {
    id: "probability",
    title: "Win Probability",
    description: "What is the likelihood of closing this deal?",
    type: "percentage",
    field: {
      name: "winProbability",
      required: true,
    },
  },
];

export default function ManualLeadForm({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateStep = useCallback(() => {
    const currentQuestion = QUESTIONS[currentStep];
    if (
      currentQuestion.type === "text-split" ||
      currentQuestion.type === "contact-split"
    ) {
      const valid = currentQuestion.fields?.every((field) => {
        if (field.required) {
          return (formData as any)[field.name]?.trim().length > 0;
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
      if (typeof value === "number") return true;
      if (typeof value === "boolean") return value;
      return value?.trim().length > 0;
    }
    return true;
  }, [currentStep, formData]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    // Save to localStorage
    const newLead = {
      id: Date.now(),
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      company: formData.companyName,
      role: formData.role,
      status: "New",
      score: formData.winProbability,
      date: new Date().toISOString().split("T")[0],
    };

    const existingLeads = JSON.parse(localStorage.getItem("leads") || "[]");
    localStorage.setItem("leads", JSON.stringify([newLead, ...existingLeads]));

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);

    if (onComplete) {
      setTimeout(onComplete, 2000);
    }
  }, [formData, onComplete]);

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
  }, [currentStep, validateStep, handleSubmit]);

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

  if (isSuccess) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white dark:bg-black/50 text-black dark:text-white rounded-2xl">
        <div className="text-center max-w-md mx-auto p-8 animate-in zoom-in-95 duration-500">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-6 ring-1 ring-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
              <Check className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
            Lead Added!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 font-light">
            The lead has been saved to your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="relative flex h-[600px] w-full flex-col overflow-hidden bg-white dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/10 font-sans text-black dark:text-white selection:bg-blue-500/30 transition-colors duration-300">
      {/* Progress Bar */}
      <div className="relative z-10 w-full px-8 pt-8">
        <ProgressBar progress={progress} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-8 perspective-[1000px]">
        <div
          className="form-container w-full max-w-3xl relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <Step key={currentStep} direction={direction}>
              <div className="mb-12 text-center relative">
                <h2 className="mb-4 text-4xl font-bold bg-gradient-to-b from-black via-black to-gray-500 dark:from-white dark:via-white dark:to-gray-500 bg-clip-text text-transparent tracking-tight leading-tight">
                  {currentQuestion.title}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-light tracking-wide">
                  {currentQuestion.description}
                </p>
              </div>

              <div className="space-y-8 max-w-2xl mx-auto">
                {(currentQuestion.type === "text-split" ||
                  currentQuestion.type === "contact-split") && (
                  <div className="flex flex-col gap-8 sm:flex-row">
                    {currentQuestion.fields?.map((field) => (
                      <div key={field.name} className="group relative w-full">
                        <input
                          type={(field as any).type || "text"}
                          placeholder={field.placeholder}
                          value={(formData as any)[field.name]}
                          onChange={(e) =>
                            handleChange(field.name, e.target.value)
                          }
                          className="w-full border-b-2 border-black/10 dark:border-white/10 bg-transparent pt-4 pb-4 text-2xl outline-none transition-all focus:border-blue-500 placeholder:text-black/10 dark:placeholder:text-white/10 text-center font-light leading-relaxed"
                          autoFocus={
                            field.name === currentQuestion.fields![0].name
                          }
                        />
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                      </div>
                    ))}
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
                      className="w-full border-b-2 border-black/10 dark:border-white/10 bg-transparent pt-4 pb-4 text-3xl outline-none transition-all focus:border-blue-500 placeholder:text-black/10 dark:placeholder:text-white/10 text-center font-light leading-relaxed"
                      autoFocus
                    />
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                  </div>
                )}

                {currentQuestion.type === "percentage" && (
                  <div className="w-full space-y-8">
                    <div className="text-center text-6xl font-bold text-blue-500">
                      {formData.winProbability}%
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.winProbability}
                      onChange={(e) =>
                        handleChange("winProbability", parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Low Probability</span>
                      <span>High Probability</span>
                    </div>
                  </div>
                )}

                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={handleNext}
                    className="group relative flex items-center gap-4 rounded-full bg-black dark:bg-white px-10 py-4 text-lg font-bold text-white dark:text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : currentStep === QUESTIONS.length - 1
                      ? "Save Lead"
                      : "Continue"}
                    {!isSubmitting && (
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                    )}
                  </button>
                </div>
              </div>
            </Step>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-black dark:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 disabled:opacity-0"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
      </div>
    </div>
  );
}
