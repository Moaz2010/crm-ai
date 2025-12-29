"use client";

import React from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["50 leads/month", "Basic features", "Community support"],
    cta: "Get Started",
    href: "/signup",
  },
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    description: "For growing businesses",
    features: [
      "500 leads/month",
      "Lead enrichment",
      "Scheduling",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter",
    popular: true,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    description: "For scaling teams",
    features: [
      "Unlimited leads",
      "Full waterfall enrichment",
      "AI features",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
  },
  {
    name: "Agency",
    price: "$149",
    period: "/mo",
    description: "For agencies and large teams",
    features: [
      "White-label",
      "Team management",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the plan that fits your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 shadow-sm flex flex-col ${
                tier.popular
                  ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/10"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900"
              }`}
            >
              {tier.popular && (
                <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors ${
                  tier.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
