"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeadCapture } from "./components/lead-capture";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  qualified: "bg-green-500/10 text-green-400 border border-green-500/20",
  meeting_booked: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  lost: "bg-red-500/10 text-red-400 border border-red-500/20",
  converted: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [captureOpen, setCaptureOpen] = useState(false);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) setLeads(data);
      } catch (error) {
        console.error("Failed to load leads:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLeads();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      (lead.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (lead.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (lead.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (lead.company_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      const supabase = createClient();
      await supabase.from('leads').delete().eq('id', id);
      setLeads(leads.filter((lead) => lead.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const handleExport = () => {
    if (leads.length === 0) {
      alert('No leads to export');
      return;
    }
    
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Status', 'Score', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.first_name || '',
        lead.last_name || '',
        lead.email || '',
        lead.phone || '',
        lead.company_name || '',
        lead.job_title || '',
        lead.status || 'new',
        lead.score || 0,
        lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-transparent min-h-screen text-black dark:text-white">
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500" />
            Leads
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            AI-powered lead capture and enrichment
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-2 sm:gap-3"
        >
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <Link href="/leads/import">
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
          </Link>
          <Dialog open={captureOpen} onOpenChange={setCaptureOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/20">
                <Plus className="h-4 w-4" />
                <span>Add Lead</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  AI Lead Capture
                </DialogTitle>
              </DialogHeader>
              <LeadCapture onSuccess={() => {
                setCaptureOpen(false);
                // Reload leads
                window.location.reload();
              }} />
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SpotlightCard className="p-4 sm:p-6 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          {/* Filters & Search */}
          <div className="flex flex-col gap-4 sm:flex-row mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No leads found. Start capturing leads to see them here!
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <Link href={`/leads/${lead.id}`} key={lead.id}>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                          {(lead.first_name || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {lead.first_name} {lead.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          STATUS_COLORS[lead.status] || "bg-gray-500/10 text-gray-500"
                        )}
                      >
                        {lead.status?.replace('_', ' ') || 'New'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>{lead.company_name || 'No company'}</span>
                      <span>Score: {lead.score || 0}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-zinc-900/50 text-gray-600 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Date Added</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No leads found. Start capturing leads to see them here!
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={lead.id}
                        className="group hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link href={`/leads/${lead.id}`} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                              {(lead.first_name || 'U').charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {lead.first_name} {lead.last_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lead.email}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 dark:text-white">
                            {lead.company_name || '-'}
                          </p>
                          <p className="text-xs text-gray-500">{lead.job_title || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                              STATUS_COLORS[lead.status] || "bg-gray-500/10 text-gray-500"
                            )}
                          >
                            {lead.status?.replace('_', ' ') || 'New'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${lead.score || 0}%` }}
                                transition={{
                                  duration: 1,
                                  delay: 0.5 + index * 0.1,
                                }}
                                className={cn(
                                  "h-full rounded-full",
                                  (lead.score || 0) > 80
                                    ? "bg-green-500"
                                    : (lead.score || 0) > 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                )}
                              />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {lead.score || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 dark:border-zinc-800 px-4 sm:px-6 py-4">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                Showing{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {filteredLeads.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {leads.length}
                </span>{" "}
                results
              </p>
              <div className="flex gap-2">
                <button className="rounded-lg border border-gray-200 dark:border-zinc-800 px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                  Previous
                </button>
                <button className="rounded-lg border border-gray-200 dark:border-zinc-800 px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
