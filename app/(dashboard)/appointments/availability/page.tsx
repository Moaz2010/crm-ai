"use client";

import { useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Save,
  Calendar as CalendarIcon,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type TimeSlot = {
  start: string;
  end: string;
};

type Availability = {
  [key: string]: {
    enabled: boolean;
    slots: TimeSlot[];
  };
};

const INITIAL_AVAILABILITY: Availability = {
  Monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  Tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  Wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  Thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  Friday: { enabled: true, slots: [{ start: "09:00", end: "16:00" }] },
  Saturday: { enabled: false, slots: [] },
  Sunday: { enabled: false, slots: [] },
};

export default function AvailabilityPage() {
  const [availability, setAvailability] =
    useState<Availability>(INITIAL_AVAILABILITY);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots:
          !prev[day].enabled && prev[day].slots.length === 0
            ? [{ start: "09:00", end: "17:00" }]
            : prev[day].slots,
      },
    }));
  };

  const addSlot = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateSlot = (
    day: string,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    setAvailability((prev) => {
      const newSlots = [...prev[day].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return {
        ...prev,
        [day]: { ...prev[day], slots: newSlots },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/appointments/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability }),
      });
      if (!response.ok) throw new Error("Failed to save");
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Design your perfect week. Set when you&apos;re free to meet.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-black dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-black hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Week Grid */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-2 bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-2xl">
            <div className="grid grid-cols-1 gap-2">
              {DAYS.map((day) => (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex items-center justify-between p-4 rounded-xl transition-all border",
                    selectedDay === day
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full transition-colors",
                        availability[day].enabled
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                          : "bg-gray-300 dark:bg-gray-700"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium",
                        selectedDay === day
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {day}
                    </span>
                  </div>
                  {availability[day].enabled ? (
                    <span className="text-xs font-mono text-gray-500">
                      {availability[day].slots.length} slots
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Off</span>
                  )}

                  {selectedDay === day && (
                    <motion.div
                      layoutId="activeDay"
                      className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-8 min-h-[500px] flex flex-col bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-2xl">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                      <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedDay}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configure your hours for this day
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDay(selectedDay)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      availability[selectedDay].enabled
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    {availability[selectedDay].enabled ? (
                      <>
                        <Check className="h-4 w-4" /> Available
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" /> Unavailable
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  {!availability[selectedDay].enabled ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20">
                      <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        You&apos;re unavailable on {selectedDay}s
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                        Enjoy your time off! Or enable this day to start
                        accepting bookings.
                      </p>
                      <button
                        onClick={() => toggleDay(selectedDay)}
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        Enable {selectedDay}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availability[selectedDay].slots.map((slot, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-blue-500/50 transition-colors shadow-sm"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Clock className="h-5 w-5" />
                          </div>

                          <div className="flex-1 flex items-center gap-4">
                            <div className="flex-1">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) =>
                                  updateSlot(
                                    selectedDay,
                                    index,
                                    "start",
                                    e.target.value
                                  )
                                }
                                className="w-full bg-transparent font-mono text-lg font-medium focus:outline-none text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert-0"
                              />
                            </div>
                            <div className="text-gray-300 dark:text-gray-700">
                              →
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) =>
                                  updateSlot(
                                    selectedDay,
                                    index,
                                    "end",
                                    e.target.value
                                  )
                                }
                                className="w-full bg-transparent font-mono text-lg font-medium focus:outline-none text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:invert-0"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => removeSlot(selectedDay, index)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </motion.div>
                      ))}

                      <button
                        onClick={() => addSlot(selectedDay)}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <Plus className="h-5 w-5" />
                        Add Another Interval
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
