"use client";

import {
  Calendar,
  Video,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const MOCK_BOOKINGS = [
  {
    id: 1,
    title: "Product Demo with TechCorp",
    attendee: "Sarah Miller",
    time: "10:00 AM - 10:45 AM",
    date: "Today",
    status: "confirmed",
    type: "Video Call",
  },
  {
    id: 2,
    title: "Discovery Call",
    attendee: "James Wilson",
    time: "2:00 PM - 2:30 PM",
    date: "Today",
    status: "pending",
    type: "Phone Call",
  },
  {
    id: 3,
    title: "Q3 Strategy Review",
    attendee: "Internal Team",
    time: "11:00 AM - 12:00 PM",
    date: "Tomorrow",
    status: "confirmed",
    type: "In-Person",
  },
];

export default function UpcomingBookings() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-400" />
          Upcoming Bookings
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📋 Demo
          </span>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            View Calendar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {MOCK_BOOKINGS.map((booking) => (
          <div
            key={booking.id}
            className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex flex-col items-center min-w-[60px] text-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {booking.date}
              </span>
              <span className="text-sm font-mono text-white mt-1">
                {booking.time.split(" - ")[0]}
              </span>
            </div>

            <div className="h-10 w-[1px] bg-white/10" />

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white truncate">{booking.title}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Video className="h-3 w-3" /> {booking.type}
                </span>
                <span>•</span>
                <span>with {booking.attendee}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {booking.status === "confirmed" ? (
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              )}
              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
