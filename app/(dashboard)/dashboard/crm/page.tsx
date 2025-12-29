"use client";

import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
} from "lucide-react";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { motion } from "framer-motion";

const STATS = [
  {
    label: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Active Leads",
    value: "1,240",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Conversion Rate",
    value: "2.4%",
    change: "-0.5%",
    trend: "down",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    label: "Avg. Deal Size",
    value: "$8,400",
    change: "+5.1%",
    trend: "up",
    icon: Activity,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const LEADS = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    status: "Negotiation",
    value: "$12,500",
    lastContact: "2h ago",
    avatar: "SJ",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "StartUp Labs",
    status: "New Lead",
    value: "$5,000",
    lastContact: "5h ago",
    avatar: "MC",
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Emma Wilson",
    company: "Design Studio",
    status: "Proposal",
    value: "$8,200",
    lastContact: "1d ago",
    avatar: "EW",
    color: "bg-pink-500",
  },
  {
    id: 4,
    name: "James Brown",
    company: "Consulting Co",
    status: "Qualified",
    value: "$15,000",
    lastContact: "2d ago",
    avatar: "JB",
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    company: "Global Trade",
    status: "Contacted",
    value: "$22,000",
    lastContact: "3d ago",
    avatar: "LA",
    color: "bg-green-500",
  },
];

const PIPELINE_STAGES = [
  { name: "New Lead", count: 45, value: "$225k", color: "bg-blue-500" },
  { name: "Contacted", count: 28, value: "$140k", color: "bg-purple-500" },
  { name: "Qualified", count: 15, value: "$180k", color: "bg-orange-500" },
  { name: "Proposal", count: 8, value: "$120k", color: "bg-pink-500" },
  { name: "Negotiation", count: 4, value: "$85k", color: "bg-green-500" },
];

export default function CRMPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your relationships and track your pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <Filter className="h-5 w-5 text-gray-500" />
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, index) => (
          <SpotlightCard
            key={index}
            className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </SpotlightCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          <SpotlightCard className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Pipeline Health</h2>
              <button className="text-sm text-blue-500 hover:underline">
                View Full Pipeline
              </button>
            </div>

            <div className="space-y-6">
              {PIPELINE_STAGES.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {stage.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {stage.value} ({stage.count})
                    </span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / 50) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full ${stage.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="space-y-6">
          <SpotlightCard className="p-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all group text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Log Call
                </span>
              </button>
              <button className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all group text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </span>
              </button>
              <button className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-transparent hover:border-orange-200 dark:hover:border-orange-800 transition-all group text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3 group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meeting
                </span>
              </button>
              <button className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-green-50 dark:hover:bg-green-900/20 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all group text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task
                </span>
              </button>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Recent Leads Table */}
      <SpotlightCard className="overflow-hidden bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Leads</h2>
          <button className="text-sm text-blue-500 hover:underline">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {LEADS.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full ${lead.color} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {lead.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lead.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        lead.status === "Qualified"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : lead.status === "New Lead"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : lead.status === "Negotiation"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lead.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {lead.lastContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightCard>
    </div>
  );
}
