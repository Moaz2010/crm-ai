"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Users, Globe, CreditCard, Key } from "lucide-react";

const TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/settings/profile",
  },
  { id: "team", label: "Team", icon: Users, href: "/settings/team" },
  {
    id: "integrations",
    label: "Integrations",
    icon: Globe,
    href: "/settings/integrations",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/settings/billing",
  },
  {
    id: "api-keys",
    label: "API Keys",
    icon: Key,
    href: "/settings/api-keys",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="p-6 space-y-6 min-h-screen text-black dark:text-white">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account preferences and integrations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0 overflow-x-auto pb-2 lg:pb-0">
          <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 min-w-max">
            {TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
