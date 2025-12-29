"use client";

import { Clock, Globe } from "lucide-react";

export default function AvailabilityCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Availability</h3>
        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          Edit
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>Mon - Fri, 9:00 AM - 5:00 PM</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <Globe className="h-4 w-4 text-gray-500" />
          <span>Eastern Time (US & Canada)</span>
        </div>

        <div className="pt-2 flex gap-2">
          <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400">
            Buffer: 15m
          </div>
          <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-400">
            Limit: 4/day
          </div>
        </div>
      </div>
    </div>
  );
}
