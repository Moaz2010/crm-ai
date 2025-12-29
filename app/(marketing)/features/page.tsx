"use client";

import React from "react";
import { Zap, Calendar, Users, Brain, BarChart, Shield } from "lucide-react";

const FEATURES = [
  {
    title: "LeadCatch",
    description:
      "Capture leads from anywhere on the web with our intelligent browser extension and API.",
    icon: Zap,
  },
  {
    title: "Smart Scheduling",
    description:
      "AI-powered appointment scheduling that eliminates the back-and-forth emails.",
    icon: Calendar,
  },
  {
    title: "CRM Core",
    description:
      "A robust CRM to manage your contacts, deals, and pipeline in one place.",
    icon: Users,
  },
  {
    title: "AI Enrichment",
    description:
      "Automatically enrich lead profiles with data from social media and public sources.",
    icon: Brain,
  },
  {
    title: "Analytics",
    description:
      "Deep insights into your conversion rates, pipeline velocity, and team performance.",
    icon: BarChart,
  },
  {
    title: "Enterprise Security",
    description:
      "Bank-grade security and compliance to keep your data safe and secure.",
    icon: Shield,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold mb-6">
            Powerful Features for Modern Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to capture, nurture, and close more deals,
            powered by artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-blue-500/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
