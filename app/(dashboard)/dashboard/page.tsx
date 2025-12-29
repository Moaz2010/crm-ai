"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Zap,
  Radio,
  Bell,
  Search,
  ChevronRight,
  Target,
} from "lucide-react";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// --- Components ---

function RadarWidget({ leads }: { leads: any[] }) {
  const displayLeads =
    leads.length > 0
      ? leads
      : [
          {
            id: 1,
            name: "Demo Lead",
            score: 85,
            company: "Example Corp",
            status: "Hot",
          },
        ];

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[300px] overflow-hidden rounded-full bg-gradient-to-b from-black/5 to-transparent dark:from-white/5 dark:to-transparent border border-black/10 dark:border-white/10">
      {/* Grid Lines */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-full"
          style={{ margin: `${i * 12}%` }}
        />
      ))}
      <div className="absolute inset-0 border-r border-black/5 dark:border-white/5 w-1/2 h-full left-0" />
      <div className="absolute inset-0 border-b border-black/5 dark:border-white/5 w-full h-1/2 top-0" />

      {/* Scanning Line */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full origin-center"
      >
        <div className="w-1/2 h-1/2 bg-gradient-to-tl from-green-500/10 to-transparent absolute top-0 right-0 rounded-tr-full" />
      </motion.div>

      {/* Blips */}
      {displayLeads.map((lead, i) => (
        <motion.div
          key={lead.id || i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.5, duration: 0.5 }}
          className="absolute group cursor-pointer"
          style={{
            top: `${50 - ((lead.score || 50) - 50)}%`,
            left: `${50 + (i % 2 === 0 ? 20 : -20)}%`,
          }}
        >
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-green-500/20 animate-ping" />
            <div
              className={cn(
                "h-3 w-3 rounded-full border-2 border-white dark:border-black shadow-sm transition-transform hover:scale-150",
                (lead.score || 0) > 80
                  ? "bg-green-500"
                  : (lead.score || 0) > 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
            />
            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 shadow-xl">
              <div className="font-bold">{lead.name || lead.first_name}</div>
              <div className="text-[10px] opacity-80">
                {lead.company || lead.company_name} • Score: {lead.score || "N/A"}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FunnelWidget({ stats }: { stats: any }) {
  const stages = [
    { label: "Impressions", value: 12500, color: "bg-blue-500" },
    { label: "Visitors", value: 8400, color: "bg-indigo-500" },
    { label: "Leads", value: stats.totalLeads || 0, color: "bg-violet-500" },
    {
      label: "Qualified",
      value: Math.floor((stats.totalLeads || 0) * 0.4),
      color: "bg-purple-500",
    },
    { label: "Closed", value: stats.totalDeals || 0, color: "bg-fuchsia-500" },
  ];

  const maxVal = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="flex flex-col gap-4 h-full justify-center py-4">
      {stages.map((stage, i) => (
        <div key={stage.label} className="relative group cursor-pointer">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1 px-2">
            <span className="font-medium group-hover:text-blue-500 transition-colors">
              {stage.label}
            </span>
            <span className="font-mono">{stage.value.toLocaleString()}</span>
          </div>
          <div className="h-6 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stage.value / maxVal) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
              className={cn(
                "h-full absolute left-0 rounded-full opacity-80 group-hover:opacity-100 transition-opacity",
                stage.color
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskWidget({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done, status: t.done ? 'pending' : 'completed' } : t)));
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <motion.div
          layout
          key={task.id}
          onClick={() => toggleTask(task.id)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
            task.status === 'completed' || task.done
              ? "bg-white/5 dark:bg-white/5 border-transparent opacity-50"
              : "bg-white/10 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-blue-500 hover:shadow-md"
          )}
        >
          <div
            className={cn(
              "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
              task.status === 'completed' || task.done
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 dark:border-gray-600 group-hover:border-blue-500"
            )}
          >
            {(task.status === 'completed' || task.done) && <CheckCircle2 className="h-3 w-3" />}
          </div>
          <span
            className={cn(
              "text-sm font-medium transition-all",
              (task.status === 'completed' || task.done) && "line-through text-gray-500"
            )}
          >
            {task.title || task.text}
          </span>
        </motion.div>
      ))}
      <Link
        href="/tasks"
        className="w-full py-3 text-xs font-medium text-gray-500 hover:text-blue-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center"
      >
        + Add New Task
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>({
    totalLeads: 0,
    totalDeals: 0,
    totalRevenue: 0,
    conversionRate: 0,
    recentLeads: [],
    upcomingAppointments: [],
    tasks: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Fetch all stats in parallel
        const [leadsRes, dealsRes, appointmentsRes, tasksRes] = await Promise.all([
          supabase.from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('deals').select('*').eq('user_id', user.id),
          supabase.from('appointments').select('*').eq('user_id', user.id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(5),
          supabase.from('tasks').select('*').eq('user_id', user.id).order('due_date', { ascending: true }).limit(5),
        ]);

        const leads = leadsRes.data || [];
        const deals = dealsRes.data || [];
        const totalRevenue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
        const conversionRate = leads.length > 0 ? ((deals.length / leads.length) * 100).toFixed(1) : "0.0";

        setStats({
          totalLeads: leads.length,
          totalDeals: deals.length,
          totalRevenue,
          conversionRate: parseFloat(conversionRate),
          recentLeads: leads.slice(0, 5),
          upcomingAppointments: appointmentsRes.data || [],
          tasks: (tasksRes.data || []).map(t => ({ ...t, done: t.status === 'completed' })),
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-6 space-y-8 bg-transparent min-h-screen text-black dark:text-white overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6 max-w-[1600px] mx-auto pb-10"
      >
        {/* Top Navigation Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm sticky top-0 z-30 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-gray-900 dark:text-white">
                Mission Control
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Online
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
            {["Overview", "Analytics", "Live"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.toLowerCase()
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-800 border focus:border-blue-500 text-sm focus:outline-none w-48 transition-all text-gray-900 dark:text-white"
                placeholder="Search..."
              />
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black" />
            </button>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Radar & Quick Stats */}
          <div className="md:col-span-4 space-y-6">
            <motion.div variants={itemVariants}>
              <SpotlightCard className="overflow-hidden h-full bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                  <h3 className="font-bold flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <Radio className="h-4 w-4 text-green-500" />
                    Lead Radar
                  </h3>
                  <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    LIVE
                  </span>
                </div>
                <div className="p-6 aspect-square flex items-center justify-center">
                  <RadarWidget leads={stats.recentLeads} />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-800 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Hot ({stats.recentLeads.filter((l: any) => (l.score || 0) > 80).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Warm ({stats.recentLeads.filter((l: any) => (l.score || 0) > 50 && (l.score || 0) <= 80).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Cold ({stats.recentLeads.filter((l: any) => (l.score || 0) <= 50).length})</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <SpotlightCard className="p-5 bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
                  <div className="text-gray-500 text-xs font-medium mb-2">Conversion Rate</div>
                  <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{stats.conversionRate}%</div>
                  <div className="text-green-500 text-xs flex items-center mt-2 font-medium bg-green-500/10 w-fit px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +0.4%
                  </div>
                </SpotlightCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <SpotlightCard className="p-5 bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
                  <div className="text-gray-500 text-xs font-medium mb-2">Avg. Deal Size</div>
                  <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    ${stats.totalDeals > 0 ? Math.round(stats.totalRevenue / stats.totalDeals).toLocaleString() : 0}
                  </div>
                  <div className="text-green-500 text-xs flex items-center mt-2 font-medium bg-green-500/10 w-fit px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> +12%
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          </div>

          {/* Middle Column: Funnel & Activity */}
          <div className="md:col-span-5 space-y-6">
            <motion.div variants={itemVariants}>
              <SpotlightCard className="h-[420px] flex flex-col bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                  <h3 className="font-bold flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <Filter className="h-4 w-4 text-blue-500" />
                    Pipeline Funnel
                  </h3>
                  <Link href="/analytics" className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium">
                    View Report
                  </Link>
                </div>
                <div className="flex-1 p-6">
                  <FunnelWidget stats={stats} />
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SpotlightCard className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                  <h3 className="font-bold flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Live Transmissions
                  </h3>
                </div>
                <div className="p-0">
                  {stats.recentLeads.slice(0, 3).map((lead: any, i: number) => (
                    <div
                      key={lead.id || i}
                      className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        {(lead.first_name || lead.name)?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                          New lead captured: {lead.first_name || lead.name} {lead.last_name || ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{lead.company_name || lead.company || "Unknown Company"}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                  {stats.recentLeads.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">No recent activity. Capture some leads!</div>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          </div>

          {/* Right Column: Tasks & Goals */}
          <div className="md:col-span-3 space-y-6">
            <motion.div variants={itemVariants} className="h-full">
              <SpotlightCard className="h-full bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                  <h3 className="font-bold flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    Priority Tasks
                  </h3>
                  <span className="bg-purple-500/10 text-purple-500 text-xs px-2 py-0.5 rounded-full font-medium">
                    {stats.tasks.filter((t: any) => !t.done).length} Pending
                  </span>
                </div>
                <div className="p-4">
                  <TaskWidget initialTasks={stats.tasks} />
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SpotlightCard className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none shadow-xl shadow-blue-500/20">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider">Monthly Goal</span>
                  </div>
                  <div className="text-4xl font-bold mb-2">{Math.min(Math.round((stats.totalRevenue / 150000) * 100), 100)}%</div>
                  <div className="text-blue-100 text-sm mb-6 flex justify-between">
                    <span>${stats.totalRevenue.toLocaleString()}</span>
                    <span className="opacity-60">$150,000</span>
                  </div>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats.totalRevenue / 150000) * 100, 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
