"use client";

import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    description:
      "Perfect for individuals and small teams just getting started.",
    features: [
      "Up to 100 leads/month",
      "Basic Calendar Integration",
      "1 User Seat",
      "Email Support",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    description: "For growing teams that need more power and flexibility.",
    features: [
      "Unlimited leads",
      "Advanced AI Qualification",
      "5 User Seats",
      "Priority Support",
      "Custom Branding",
      "Zapier Integration",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "Tailored solutions for large organizations with specific needs.",
    features: [
      "Unlimited everything",
      "Dedicated Success Manager",
      "SSO & Advanced Security",
      "Custom AI Models",
      "SLA Support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

type PricingProps = {
  color?: "blue" | "purple";
};

export default function Pricing({ color = "blue" }: PricingProps) {
  const styles = {
    blue: {
      activeCard:
        "bg-blue-600/10 border-blue-500 shadow-2xl shadow-blue-500/20",
      badge: "bg-blue-500",
      checkBg: "bg-blue-500/20",
      checkText: "text-blue-500",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    purple: {
      activeCard:
        "bg-purple-600/10 border-purple-500 shadow-2xl shadow-purple-500/20",
      badge: "bg-purple-500",
      checkBg: "bg-purple-500/20",
      checkText: "text-purple-500",
      button: "bg-purple-600 hover:bg-purple-700",
    },
  };

  const currentStyle = styles[color];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees. Cancel
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                tier.popular
                  ? currentStyle.activeCard
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-lg dark:shadow-none"
              }`}
            >
              {tier.popular && (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 ${currentStyle.badge} text-white px-4 py-1 rounded-full text-sm font-bold`}
                >
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-black dark:text-white">
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-gray-600 dark:text-gray-400">
                      /month
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div
                      className={`h-5 w-5 rounded-full ${currentStyle.checkBg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Check className={`h-3 w-3 ${currentStyle.checkText}`} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  tier.popular
                    ? `${currentStyle.button} text-white`
                    : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
