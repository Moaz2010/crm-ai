"use client";

import React from "react";
import { ArrowLeft, Mail, Phone, Globe, Calendar, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <Link href="/leads" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Leads
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-start justify-between mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                JD
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-1">John Doe</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Marketing Manager at Acme Inc.</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>john@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>+1 (555) 000-0000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-gray-400" />
                <a href="#" className="text-blue-500 hover:underline">linkedin.com/in/johndoe</a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs">Cold Lead</span>
                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs">Tech</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </button>
            <button className="flex-1 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Book Meeting
            </button>
          </div>

          <div className="border-b border-gray-200 dark:border-zinc-800">
            <div className="flex gap-6">
              <button className="pb-3 border-b-2 border-blue-500 text-blue-500 font-medium">Activity</button>
              <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-black dark:hover:text-white transition-colors">Notes</button>
              <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-black dark:hover:text-white transition-colors">Emails</button>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center z-10">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-zinc-800 -mt-2" />
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Email Sent</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sent &quot;Introduction to LeadCatch&quot; template.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
