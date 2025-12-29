"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  BarChart3,
  Calendar,
  Shield,
  Globe,
  Users,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Briefcase,
  GitMerge,
  CalendarDays,
  LogIn,
  UserPlus,
  Play,
  Pause,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/landing/Hero";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { InfiniteMovingCards } from "@/components/landing/InfiniteMovingCards";
import Pricing from "@/components/landing/Pricing";
import { StarsCanvas } from "@/components/ui/Stars";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import CardSwap, { Card } from "@/components/landing/CardSwap";
import CountUp from "@/components/landing/CountUp";
import LogoLoop from "@/components/landing/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiGithub,
  SiLinkedin,
  SiInstagram,
} from "react-icons/si";
import { FaTwitter } from "react-icons/fa";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimationToggle } from "@/components/AnimationToggle";
import RealPyramidLogo from "@/components/ui/RealPyramidLogo";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

export default function LandingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const APP_LINKS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/dashboard/leads", icon: Users },
    { label: "CRM Core", href: "/dashboard/crm", icon: Briefcase },
    { label: "Pipeline", href: "/dashboard/pipeline", icon: GitMerge },
    { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    {
      label: "Communication",
      href: "/communication",
      icon: MessageSquare,
    },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-500/30 relative transition-colors duration-300">
      <StarsCanvas />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-white/10 dark:bg-black/10 backdrop-blur-xl transition-colors duration-300">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <RealPyramidLogo />
            <span className="bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              LeadCatch
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/solutions/appointments"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-black dark:hover:text-white"
            >
              Appointments
            </Link>
            <Link
              href="/solutions/communication"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-black dark:hover:text-white"
            >
              Communication
            </Link>
            <Link
              href="/roast"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-black dark:hover:text-white flex items-center gap-1"
            >
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Roast My Page
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-black dark:hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-black dark:bg-white px-6 py-2.5 text-sm font-bold text-white dark:text-black transition-transform hover:scale-105 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Get Started
            </Link>
            <div className="flex items-center gap-2">
              <AnimationToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Sidebar / Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[70] h-full w-[300px] bg-white dark:bg-black border-l border-black/10 dark:border-white/10 p-6 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-black dark:text-white">
                  Menu
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Auth Section */}
                <div className="space-y-3">
                  <div className="flex justify-end mb-2">
                    <ThemeToggle />
                  </div>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 py-3 font-medium text-black dark:text-white transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    <LogIn className="h-4 w-4" />
                    Log In
                  </Link>
                </div>

                {/* App Links */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Platform
                  </h3>
                  <div className="space-y-2">
                    {APP_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Public Links */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Resources
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/roast"
                      className="block px-4 py-2 text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Roast My Page (Free Tool)
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Features
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Testimonials
                    </Link>
                    <Link
                      href="/book/johndoe"
                      className="block px-4 py-2 text-blue-400 hover:text-blue-300"
                    >
                      Book a Demo
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Hero />

      {/* Dashboard Preview Section */}
      <section className="py-32 relative z-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Live Demo
              </div>

              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Workflow that <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  feels like magic
                </span>
              </h2>

              <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                Stop wrestling with clunky CRMs. Experience a fluid, intelligent
                interface that adapts to your sales process and helps you close
                deals faster.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/appointments"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full font-bold hover:bg-white/10 transition-all hover:border-white/20"
                >
                  View Interactive Demo
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-xs`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p>Trusted by 1000+ sales teams</p>
              </div>
            </div>

            {/* Right Column: Card Stack */}
            <div className="h-[500px] relative flex items-center justify-center">
              <CardSwap verticalDistance={25} delay={2000} pauseOnHover={true}>
                {/* Card 1: Reliable */}
                <Card>
                  <div className="h-full flex flex-col bg-[#0a0a0a]">
                    {/* Window Header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                      </div>
                      <div className="ml-4 px-3 py-1 rounded-md bg-white/10 text-xs font-mono text-gray-400 flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        <span>Reliable</span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[120px] font-bold text-white/10 group-hover:text-white/20 transition-colors select-none">
                          1
                        </span>
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="h-2 w-24 bg-blue-500/50 rounded-full mb-4" />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-white/10 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Card 2: Customizable */}
                <Card>
                  <div className="h-full flex flex-col bg-[#0a0a0a]">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                      </div>
                      <div className="ml-4 px-3 py-1 rounded-md bg-white/10 text-xs font-mono text-gray-400 flex items-center gap-2">
                        <Settings className="w-3 h-3" />
                        <span>Customizable</span>
                      </div>
                    </div>
                    <div className="flex-1 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-600/20 opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[120px] font-bold text-white/10 group-hover:text-white/20 transition-colors select-none">
                          2
                        </span>
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="h-2 w-24 bg-emerald-500/50 rounded-full mb-4" />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-white/10 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Card 3: Smooth */}
                <Card>
                  <div className="h-full flex flex-col bg-[#0a0a0a]">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                      </div>
                      <div className="ml-4 px-3 py-1 rounded-md bg-white/10 text-xs font-mono text-gray-400 flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        <span>Smooth</span>
                      </div>
                    </div>
                    <div className="flex-1 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[120px] font-bold text-white/10 group-hover:text-white/20 transition-colors select-none">
                          3
                        </span>
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="h-2 w-24 bg-orange-500/50 rounded-full mb-4" />
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-white/10 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with 3D Tilt Effect */}
      <section className="relative py-32 z-10">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Everything you need to{" "}
              <span className="text-blue-500">scale</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed to help you capture, qualify, and
              convert leads faster than ever before.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: "Instant Scheduling",
                desc: "Turn interested visitors into booked meetings instantly. No more back-and-forth emails.",
              },
              {
                icon: Zap,
                title: "Smart Qualification",
                desc: "AI asks the right questions before booking to ensure you only meet with qualified prospects.",
              },
              {
                icon: BarChart3,
                title: "Booking Analytics",
                desc: "Track show rates, conversion metrics, and pipeline value in real-time.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Bank-grade encryption and SOC2 compliance ensuring your customer data is always safe.",
              },
              {
                icon: Globe,
                title: "Global Availability",
                desc: "Smart timezone detection and multi-language support for global teams.",
              },
              {
                icon: Users,
                title: "Team Round-Robin",
                desc: "Automatically distribute meetings fairly across your sales team based on availability.",
              },
            ].map((feature, i) => (
              <CardContainer key={i} className="inter-var py-0">
                <CardBody className="bg-gray-50 dark:bg-gray-900/50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                  <CardItem
                    translateZ="50"
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10"
                  >
                    <feature.icon className="h-7 w-7 text-blue-500" />
                  </CardItem>
                  <CardItem
                    as="h3"
                    translateZ="60"
                    className="mb-3 text-xl font-bold text-neutral-800 dark:text-white"
                  >
                    {feature.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="40"
                    className="leading-relaxed text-neutral-600 dark:text-gray-400 text-sm max-w-sm"
                  >
                    {feature.desc}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-transparent relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-blue-900/10 blur-[100px]" />
        <div className="container mx-auto px-6 relative z-10 mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-400">
            See what our customers have to say about LeadCatch.
          </p>
        </div>
        <InfiniteMovingCards
          items={[
            {
              quote:
                "LeadCatch transformed our sales process. We're booking 3x more meetings with half the effort.",
              name: "Sarah Johnson",
              title: "VP of Sales at TechFlow",
            },
            {
              quote:
                "The AI qualification is a game changer. My team only talks to serious prospects now.",
              name: "Michael Chen",
              title: "Founder of GrowthLabs",
            },
            {
              quote:
                "Implementation was seamless. We were up and running in less than an hour.",
              name: "Emily Davis",
              title: "Operations Director at ScaleUp",
            },
            {
              quote:
                "Best investment we made this year. The ROI was positive within the first month.",
              name: "David Wilson",
              title: "CEO of FutureCorp",
            },
            {
              quote:
                "The scheduling features are incredibly robust. Handles our global team perfectly.",
              name: "Lisa Anderson",
              title: "Head of Sales at GlobalTech",
            },
          ]}
          direction="right"
          speed="slow"
        />
      </section>

      {/* Stats Section */}
      <section className="border-y border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] py-24 z-10 relative">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 text-center md:grid-cols-3">
            {[
              { value: 3, suffix: "x", label: "More Meetings Booked" },
              { value: 90, suffix: "%", label: "Reduction in No-Shows" },
              { value: 15, suffix: "k+", label: "Appointments Scheduled" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="mb-2 text-5xl font-bold text-black dark:text-white md:text-6xl flex justify-center items-baseline">
                  <CountUp
                    from={0}
                    to={stat.value}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div className="relative z-10">
        <Pricing />
      </div>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32 z-10">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="container mx-auto relative z-10 px-6 text-center">
          <h2 className="mb-8 text-4xl font-bold md:text-6xl text-black dark:text-white">
            Ready to fill your calendar?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            Join thousands of high-growth teams using LeadCatch to automate
            their scheduling.
          </p>
          <Link
            href="/capture"
            className="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-10 py-5 text-xl font-bold text-white dark:text-black transition-all hover:scale-105 hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            Start Booking Now
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 relative z-10 border-t border-black/10 dark:border-white/10 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 text-sm text-gray-500 uppercase tracking-wider">
            Powered by Modern Tech
          </div>
          <LogoLoop
            logos={techLogos}
            speed={40}
            direction="left"
            logoHeight={32}
            gap={40}
            hoverSpeed={0}
            scaleOnHover
            fadeOut={false}
            ariaLabel="Technology partners"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/5 pt-20 pb-10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-6">
                <RealPyramidLogo />
                <span className="text-black dark:text-white">LeadCatch</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                San Francisco, CA.
                <br />© 2025 LeadCatch Inc.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-400"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-black dark:hover:text-white"
                  aria-label="GitHub"
                >
                  <SiGithub className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-pink-500"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-black dark:text-white mb-6">
                Product
              </h3>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-black dark:text-white mb-6">
                Company
              </h3>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-black dark:text-white mb-6">
                Legal
              </h3>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Acceptable Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
