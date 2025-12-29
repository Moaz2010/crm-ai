"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Copy,
  AlertCircle,
} from "lucide-react";

type TimeSlot = {
  start: string;
  end: string;
};

type DaySchedule = {
  enabled: boolean;
  slots: TimeSlot[];
};

type Schedule = {
  [key: string]: DaySchedule;
};

type DateOverride = {
  id: string;
  date: string;
  unavailable: boolean;
  slots: TimeSlot[];
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AvailabilitySettings() {
  const [schedule, setSchedule] = useState<Schedule>({
    Monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Friday: { enabled: true, slots: [{ start: "09:00", end: "16:00" }] },
    Saturday: { enabled: false, slots: [] },
    Sunday: { enabled: false, slots: [] },
  });

  const [overrides, setOverrides] = useState<DateOverride[]>([
    {
      id: "1",
      date: "2024-12-25",
      unavailable: true,
      slots: [],
    },
    {
      id: "2",
      date: "2024-12-31",
      unavailable: false,
      slots: [{ start: "09:00", end: "12:00" }],
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Availability</h2>
          <p className="text-gray-400">
            Set your weekly schedule and specific date overrides
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
            Copy to...
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Weekly Hours
        </h3>
        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {DAYS.map((day) => (
            <div
              key={day}
              className="p-4 border-b border-white/5 last:border-0 flex items-start gap-6 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-32 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule[day]?.enabled}
                    onChange={() => {
                      setSchedule((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], enabled: !prev[day].enabled },
                      }));
                    }}
                    className="w-4 h-4 rounded border-gray-600 bg-transparent text-blue-600 focus:ring-offset-black"
                  />
                  <span
                    className={`font-medium ${
                      schedule[day]?.enabled ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {day}
                  </span>
                </label>
              </div>

              <div className="flex-1 space-y-3">
                {schedule[day]?.enabled ? (
                  <>
                    {schedule[day].slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start}
                            className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={slot.end}
                            className="bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                          />
                        </div>
                        <button className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                      <Plus className="h-3 w-3" />
                      Add Interval
                    </button>
                  </>
                ) : (
                  <div className="pt-2 text-sm text-gray-600 italic">
                    Unavailable
                  </div>
                )}
              </div>

              <button className="p-2 rounded-lg hover:bg-white/5 text-gray-600 hover:text-white transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Date Overrides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-purple-400" />
            Date Overrides
          </h3>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
            Add Date Override
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overrides.map((override) => (
            <div
              key={override.id}
              className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between group hover:border-white/10 transition-all"
            >
              <div>
                <div className="font-medium text-white mb-1">
                  {override.date}
                </div>
                {override.unavailable ? (
                  <div className="text-sm text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Unavailable
                  </div>
                ) : (
                  <div className="space-y-1">
                    {override.slots.map((slot, idx) => (
                      <div key={idx} className="text-sm text-gray-400">
                        {slot.start} - {slot.end}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
