"use client";

import { useState } from "react";
import { CreditCard, Check, Zap, Building, Users } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For individuals getting started",
    features: [
      "Up to 100 contacts",
      "Basic lead capture",
      "Email support",
      "1 user",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing teams",
    features: [
      "Up to 5,000 contacts",
      "AI lead enrichment",
      "Appointment scheduling",
      "Priority support",
      "5 users",
      "API access",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large organizations",
    features: [
      "Unlimited contacts",
      "Advanced AI features",
      "Custom integrations",
      "Dedicated support",
      "Unlimited users",
      "SSO & SAML",
      "Custom contracts",
    ],
    current: false,
  },
];

const invoices = [
  { id: "INV-001", date: "Jan 1, 2024", amount: "$49.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2023", amount: "$49.00", status: "Paid" },
  { id: "INV-003", date: "Nov 1, 2023", amount: "$49.00", status: "Paid" },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("Professional");

  return (
    <div className="p-6 space-y-8 max-w-6xl">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold">Billing</h1>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📋 Demo Data
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold">Professional Plan</h2>
              <p className="text-sm text-gray-500">$49/month • Renews on Feb 1, 2024</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl border transition-all ${
                plan.current
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                  : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  plan.current
                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 cursor-default"
                    : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-950 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
            Update
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium">{invoice.id}</p>
                <p className="text-sm text-gray-500">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{invoice.amount}</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                  {invoice.status}
                </span>
                <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
