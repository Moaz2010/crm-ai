"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimationToggle } from "@/components/AnimationToggle";
import {
  Calendar,
  MessageSquare,
  Users,
  GitMerge,
  BookOpen,
  ArrowRight,
  Zap,
  BarChart3,
  Shield,
  Globe,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StarsCanvas } from "@/components/ui/Stars";
import SpotlightCard from "@/components/landing/SpotlightCard";

function extractName(raw?: string | null) {
  if (!raw) return null;
  const byName = raw.trim();
  if (byName.includes("@")) {
    const before = byName.split("@")[0];
    return before
      .split(/[._\- ]+/)
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ""))
      .join(" ");
  }
  return byName
    .split(/[._\- ]+/)
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ""))
    .join(" ");
}

function WelcomeContent() {
  const search = useSearchParams();
  const email = search?.get("email");
  const nameParam = search?.get("name");
  const name = extractName(nameParam ?? email) ?? "there";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-white dark:bg-black text-black dark:text-white transition-colors relative overflow-hidden">
      <StarsCanvas />
      <div className="max-w-6xl mx-auto space-y-24 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold tracking-tight mb-2">
              Hello,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                {name}
              </span>{" "}
              👋
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md">
              Your mission control is ready. Here&apos;s what&apos;s happening
              today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <AnimationToggle />
              <ThemeToggle />
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </header>

        {/* Detailed Offerings Section */}
        <section className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
              <Zap className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Everything you need to grow
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
              A complete suite of tools designed to help you capture leads,
              manage relationships, and close more deals.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Booking Card */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="p-8 h-full hover:border-blue-500/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Smart Booking</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Share your personalized link and let AI handle the scheduling.
                  No more back-and-forth emails.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Custom availability rules
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Automated reminders
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    Team round-robin
                  </li>
                </ul>
              </SpotlightCard>
            </motion.div>

            {/* Communication Card */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="p-8 h-full hover:border-purple-500/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <MessageSquare className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Unified Inbox</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Manage all your conversations in one place. Email, SMS, and
                  WhatsApp seamlessly integrated.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    Multi-channel support
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    AI response suggestions
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    Shared team inbox
                  </li>
                </ul>
              </SpotlightCard>
            </motion.div>

            {/* CRM Card */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="p-8 h-full hover:border-green-500/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Intelligent CRM</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Track every interaction and deal automatically. Never lose a
                  lead in the cracks again.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Automatic lead capture
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Rich contact profiles
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Activity timeline
                  </li>
                </ul>
              </SpotlightCard>
            </motion.div>

            {/* Pipeline Card */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="p-8 h-full hover:border-orange-500/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                  <GitMerge className="h-7 w-7 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Visual Pipeline</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Drag-and-drop deals through your sales stages. Visualize your
                  revenue flow instantly.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    Customizable stages
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    Deal value tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    Probability forecasting
                  </li>
                </ul>
              </SpotlightCard>
            </motion.div>

            {/* Analytics Card */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="p-8 h-full hover:border-pink-500/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Real-time Analytics</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Know your numbers inside out. Track conversion rates, booking
                  volume, and team performance.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-pink-500" />
                    Conversion metrics
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-pink-500" />
                    Revenue reports
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-pink-500" />
                    Exportable data
                  </li>
                </ul>
              </SpotlightCard>
            </motion.div>

            {/* Security Card */}
            <motion.div variants={itemVariants}>
              <SpotlightCard className="p-8 h-full hover:border-indigo-500/50 transition-colors">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Your data is safe with us. We use bank-grade encryption and
                  comply with global standards.
                </p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    SOC2 Compliant
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    Data encryption
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    Role-based access
                  </li>
                </ul>
              </SpotlightCard>
            </motion.div>

            {/* Settings Card (New) */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 lg:col-span-3"
            >
              <SpotlightCard className="p-8 h-full hover:border-gray-500/50 transition-colors flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="h-14 w-14 rounded-2xl bg-gray-500/10 flex items-center justify-center mb-6">
                    <Settings className="h-7 w-7 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    Settings & Customization
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                    Configure your workspace to match your brand. Manage team
                    members, billing, and integrations all in one place.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/dashboard/settings/profile"
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings/team"
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Team Members
                    </Link>
                    <Link
                      href="/dashboard/settings/billing"
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Billing
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </motion.div>
        </section>

        {/* Helpful Shortcuts */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl border border-black/5 dark:border-white/5 p-8 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors">
            <h3 className="font-bold text-lg mb-3">Get Started</h3>
            <p className="text-sm text-gray-500 mb-6">
              Create a booking page, import contacts, or schedule your first
              meeting in a few clicks.
            </p>
            <div className="flex gap-3">
              <Link
                href="/capture"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Create Capture
              </Link>
              <Link
                href="/appointments"
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                Appointments
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 dark:border-white/5 p-8 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors">
            <h3 className="font-bold text-lg mb-3">Tips</h3>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  Use the <strong>Play</strong> button to pause background
                  animations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  Toggle <strong>Dark Mode</strong> for better night viewing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Click any card in the slide bar to jump directly.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-black/5 dark:border-white/5 p-8 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors">
            <h3 className="font-bold text-lg mb-3">Support</h3>
            <p className="text-sm text-gray-500 mb-6">
              Need help? Visit the help center or message our team — we&apos;re
              here to help you get value fast.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Contact Support <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <React.Suspense fallback={null}>
      <WelcomeContent />
    </React.Suspense>
  );
}
