"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Briefcase,
  GitMerge,
  CalendarDays,
  ExternalLink,
  Globe,
  BarChart3,
  CheckSquare,
  Building2,
  BookUser,
} from "lucide-react";
import RealPyramidLogo from "@/components/ui/RealPyramidLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimationToggle } from "@/components/AnimationToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: GitMerge },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  {
    label: "Communication",
    href: "/dashboard/communication",
    icon: MessageSquare,
  },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Contacts", href: "/contacts", icon: BookUser },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="group relative flex h-screen w-20 hover:w-64 flex-col border-r border-black/5 dark:border-white/5 bg-white/10 dark:bg-black/10 backdrop-blur-xl text-black dark:text-white overflow-hidden transition-all duration-500 ease-in-out z-50 shadow-2xl">
      {/* Header */}
      <div className="relative z-20 flex h-20 items-center justify-center group-hover:justify-start group-hover:px-6 transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="min-w-[40px] flex justify-center">
            <RealPyramidLogo />
          </div>
          <span className="text-xl font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute left-16 group-hover:static delay-100">
            LeadCatch
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex-1 space-y-2 px-3 py-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group/item flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white relative"
          >
            <div className="min-w-[24px] flex justify-center">
              <item.icon className="h-5 w-5 transition-colors group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute left-14 delay-75">
              {item.label}
            </span>

            {/* Active Indicator Dot */}
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover/item:translate-x-0">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative z-20 border-t border-black/5 dark:border-white/5 p-3 space-y-2">
        <Link
          href="/"
          className="group/item flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white relative"
        >
          <div className="min-w-[24px] flex justify-center">
            <Globe className="h-4 w-4" />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute left-14 delay-75">
            Public Site
          </span>
        </Link>

        <Link
          href="/login"
          className="group/item flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 relative"
        >
          <div className="min-w-[24px] flex justify-center">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap absolute left-14 delay-75">
            Sign Out
          </span>
        </Link>

        <div className="pt-2 mt-2 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-center group-hover:justify-start gap-3 px-0 group-hover:px-2 transition-all">
            <ThemeToggle className="h-10 w-10 justify-center bg-transparent border-0 hover:bg-black/5 dark:hover:bg-white/10" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400 delay-75 hidden group-hover:block">
              Theme
            </span>
          </div>
          <div className="flex items-center justify-center group-hover:justify-start gap-3 px-0 group-hover:px-2 transition-all">
            <AnimationToggle className="h-10 w-10 border-0 bg-transparent hover:bg-black/5 dark:hover:bg-white/10" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400 delay-75 hidden group-hover:block">
              Animations
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
