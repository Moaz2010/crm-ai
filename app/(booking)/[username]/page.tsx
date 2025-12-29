"use client";

import Link from "next/link";
import { Clock, ChevronRight, ArrowLeft, Calendar, Star } from "lucide-react";
import RealPyramidLogo from "@/components/ui/RealPyramidLogo";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { StarsCanvas } from "@/components/ui/Stars";
import { motion } from "framer-motion";

const EVENT_TYPES = [
  {
    id: "15min",
    title: "Quick Chat",
    duration: 15,
    description: "A quick 15-minute intro call to say hello.",
    color: "bg-blue-500",
    icon: Star,
  },
  {
    id: "30min",
    title: "Discovery Call",
    duration: 30,
    description:
      "Book a time to discuss your project requirements and how we can help you grow.",
    color: "bg-purple-500",
    icon: Calendar,
  },
  {
    id: "60min",
    title: "Deep Dive",
    duration: 60,
    description: "An hour-long session to go deep into strategy and execution.",
    color: "bg-orange-500",
    icon: Clock,
  },
];

export default function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white flex flex-col relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <StarsCanvas />
      </div>
      {/* Header with Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white dark:bg-black/50 p-2 rounded-xl border border-black/5 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform">
            <RealPyramidLogo />
          </div>
          <span className="font-bold text-lg tracking-tight opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
            LeadCatch
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl"
            >
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 flex items-center justify-center text-4xl font-bold text-white shadow-lg mx-auto lg:mx-0">
                {params.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-4xl font-bold mb-2 text-center lg:text-left">
                {decodeURIComponent(params.username)}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-center lg:text-left mb-6">
                Welcome to my scheduling page. I&apos;m excited to connect with
                you!
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Usually replies within 2 hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>Book up to 2 weeks in advance</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Event Types Grid */}
          <div className="lg:col-span-8 flex flex-col justify-center gap-4">
            {EVENT_TYPES.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link href={`/${params.username}/${type.id}`}>
                  <SpotlightCard className="p-6 bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div
                        className={`h-16 w-16 rounded-2xl ${type.color} bg-opacity-10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <type.icon
                          className={`h-8 w-8 ${type.color.replace(
                            "bg-",
                            "text-"
                          )}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {type.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                          {type.description}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">
                          <Clock className="h-3 w-3" />
                          {type.duration} minutes
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-0 -z-10 opacity-50 hidden dark:block">
        <div className="h-[500px] w-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-50 hidden dark:block">
        <div className="h-[500px] w-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
