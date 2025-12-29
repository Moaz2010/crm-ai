"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimationToggle } from "@/components/AnimationToggle";
import Hero from "@/components/landing/Hero";
import { StarsCanvas } from "@/components/ui/Stars";
import Pricing from "@/components/landing/Pricing";
import { InfiniteMovingCards } from "@/components/landing/InfiniteMovingCards";
import SpotlightCard from "@/components/landing/SpotlightCard";
import CountUp from "@/components/landing/CountUp";
import { motion } from "framer-motion";
import {
  Zap,
  Target,
  Users,
  Calendar,
  BarChart3,
  MessageSquare,
  Shield,
} from "lucide-react";
import { ArrowRight } from "lucide-react";
import RealPyramidLogo from "@/components/ui/RealPyramidLogo";

const TESTIMONIALS = [
  {
    quote: "LeadCatch transformed how we handle appointments. Our booking rate increased by 40% in just 2 months.",
    name: "Sarah Chen",
    title: "VP of Sales, TechCorp",
  },
  {
    quote: "The AI lead scoring is incredibly accurate. We're now closing deals 3x faster than before.",
    name: "Michael Rodriguez",
    title: "CEO, GrowthIO",
  },
  {
    quote: "Finally a CRM that actually works! The automation features saved us 20+ hours per week.",
    name: "Emily Watson",
    title: "Marketing Director, StartupX",
  },
  {
    quote: "Best investment we made this year. The ROI was visible within the first month.",
    name: "James Park",
    title: "Founder, ScaleUp",
  },
];

const FEATURES = [
  {
    icon: Target,
    title: "AI Lead Capture",
    description: "Intelligent forms that qualify leads in real-time with AI scoring and enrichment.",
    colorClass: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Let visitors book directly into your calendar with automated timezone handling.",
    colorClass: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Users,
    title: "Pipeline Management",
    description: "Visual drag-and-drop pipeline with AI-powered deal predictions.",
    colorClass: "bg-green-500/10 text-green-500",
  },
  {
    icon: MessageSquare,
    title: "Unified Communications",
    description: "Email, SMS, and chat all in one place with AI response suggestions.",
    colorClass: "bg-yellow-500/10 text-yellow-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time dashboards with predictive insights and conversion tracking.",
    colorClass: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC2 compliant with end-to-end encryption and granular permissions.",
    colorClass: "bg-cyan-500/10 text-cyan-500",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white relative overflow-hidden">
      {/* Background Stars */}
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/10 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <RealPyramidLogo className="h-10 w-10" />
              <span className="text-xl font-bold">LeadCatch</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Testimonials
              </a>
            </div>

            <div className="flex items-center gap-3">
              <AnimationToggle />
              <ThemeToggle />
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Dashboard Preview Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              <BarChart3 className="h-4 w-4" />
              See It In Action
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your command center for{" "}
              <span className="text-purple-600 dark:text-purple-400">growth</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage leads, close deals, and grow your business - all in one beautiful dashboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard Mockup Container */}
            <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="px-4 py-1 rounded-md bg-white/80 dark:bg-black/80 text-xs text-gray-500 dark:text-gray-400 border border-black/5 dark:border-white/5">
                    app.leadcatch.ai/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Screenshot/Link */}
              <Link href="/dashboard" className="block group">
                <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder content - you can replace with an actual screenshot */}
                  <div className="absolute inset-0 bg-[url('/dashboard-preview.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Fallback visual */}
                  <div className="relative z-10 text-center p-8">
                    <div className="mb-6 flex items-center justify-center gap-4">
                      <div className="h-32 w-48 rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm shadow-xl border border-black/10 dark:border-white/10 flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-blue-500" />
                      </div>
                      <div className="h-32 w-48 rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm shadow-xl border border-black/10 dark:border-white/10 flex items-center justify-center">
                        <Target className="h-16 w-16 text-purple-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-24 w-32 rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm shadow-xl border border-black/10 dark:border-white/10 flex items-center justify-center">
                        <Users className="h-12 w-12 text-green-500" />
                      </div>
                      <div className="h-24 w-32 rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm shadow-xl border border-black/10 dark:border-white/10 flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-orange-500" />
                      </div>
                      <div className="h-24 w-32 rounded-lg bg-white/60 dark:bg-black/60 backdrop-blur-sm shadow-xl border border-black/10 dark:border-white/10 flex items-center justify-center">
                        <MessageSquare className="h-12 w-12 text-pink-500" />
                      </div>
                    </div>
                    <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                      View Live Dashboard
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Floating feature badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -left-4 top-1/4 hidden lg:block"
            >
              <div className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-xl border border-black/10 dark:border-white/10 text-sm font-medium">
                📊 Real-time Analytics
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -right-4 top-1/2 hidden lg:block"
            >
              <div className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-xl border border-black/10 dark:border-white/10 text-sm font-medium">
                🤖 AI-Powered Insights
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute left-1/2 -translate-x-1/2 -bottom-4 hidden lg:block"
            >
              <div className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-xl border border-black/10 dark:border-white/10 text-sm font-medium">
                ⚡ Lightning Fast
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                <CountUp to={10000} duration={2} />+
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Active Users</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                <CountUp to={500} duration={2} />K
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Leads Captured</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                <CountUp to={95} duration={2} />%
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Customer Satisfaction</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                <CountUp to={40} duration={2} />%
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Faster Close Rates</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="text-blue-600 dark:text-blue-400">grow faster</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              A complete suite of tools designed to help you capture leads, manage relationships, and close more deals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <SpotlightCard className="p-8 h-full hover:border-blue-500/50 transition-all">
                  <div className={`h-14 w-14 rounded-2xl ${feature.colorClass.split(" ")[0]} flex items-center justify-center mb-6`}>
                    <feature.icon className={`h-7 w-7 ${feature.colorClass.split(" ")[1]}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-24 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by{" "}
              <span className="text-purple-600 dark:text-purple-400">thousands</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              See what our customers are saying about LeadCatch.
            </p>
          </motion.div>

          <InfiniteMovingCards items={TESTIMONIALS} speed="slow" />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10">
        <Pricing />
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to{" "}
              <span className="text-blue-600 dark:text-blue-400">transform</span>{" "}
              your sales?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of teams already using LeadCatch to capture more leads and close more deals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white text-lg font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-full border border-black/10 dark:border-white/10 text-lg font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                View Demo Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <RealPyramidLogo className="h-8 w-8" />
              <span className="font-bold">LeadCatch</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 LeadCatch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
