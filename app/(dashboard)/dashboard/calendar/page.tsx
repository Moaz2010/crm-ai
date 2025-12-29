"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "@/components/landing/SpotlightCard";
import { cn } from "@/lib/utils";
import { BookingService } from "@/modules/scheduling/services/booking-service";
import { Appointment } from "@/modules/scheduling/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Add Appointment Modal State
  const [isAdding, setIsAdding] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    guestName: "",
    guestEmail: "",
    time: "09:00",
    duration: "30",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const data = await BookingService.getUpcomingAppointments();
    setAppointments(data);
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    // Construct start and end times
    const [hours, minutes] = newAppointment.time.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(
      startTime.getTime() + parseInt(newAppointment.duration) * 60000
    );

    await BookingService.createAppointment({
      title: newAppointment.title,
      guestName: newAppointment.guestName,
      guestEmail: newAppointment.guestEmail || "manual@entry.com",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      type: "One-on-One",
    });

    await fetchAppointments();
    setIsAdding(false);
    setNewAppointment({
      title: "",
      guestName: "",
      guestEmail: "",
      time: "09:00",
      duration: "30",
    });
  };

  const handleDeleteAppointment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this appointment?")) {
      await BookingService.deleteAppointment(id);
      await fetchAppointments();
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Add empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)
    );
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) =>
      isSameDay(new Date(apt.startTime), date)
    );
  };

  const calendarDays = getDaysInMonth(currentDate);
  const selectedDayAppointments = selectedDate
    ? getAppointmentsForDay(selectedDate)
    : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage your schedule.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-1">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-bold min-w-[140px] text-center">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <SpotlightCard className="p-6 bg-white dark:bg-black border-black/5 dark:border-white/5">
            <div className="grid grid-cols-7 mb-4">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square" />
                  );
                }

                const dayAppointments = getAppointmentsForDay(date);
                const isSelected =
                  selectedDate && isSameDay(date, selectedDate);
                const isToday = isSameDay(date, new Date());

                return (
                  <motion.button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-all",
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                        : isToday
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <span className="text-sm font-bold">{date.getDate()}</span>
                    {dayAppointments.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isSelected ? "bg-white" : "bg-blue-500"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </SpotlightCard>
        </div>

        {/* Selected Day Details */}
        <div>
          <SpotlightCard className="p-6 h-full bg-white dark:bg-black border-black/5 dark:border-white/5 flex flex-col">
            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select a date"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedDayAppointments.length} appointments scheduled
                </p>
              </div>
              {selectedDate && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors text-blue-600 dark:text-blue-400"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar max-h-[500px]">
              {selectedDayAppointments.length > 0 ? (
                selectedDayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-500/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm">{apt.title}</h4>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteAppointment(apt.id, e)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Appointment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <Clock className="h-3 w-3" />
                      {new Date(apt.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(apt.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                        {apt.guestName.charAt(0)}
                      </div>
                      <span className="text-xs font-medium">
                        {apt.guestName}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
                  <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                  <p>No appointments for this day.</p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                  >
                    Add one now
                  </button>
                </div>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-bold">New Appointment</h3>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 text-sm font-medium">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Event Title
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Strategy Meeting"
                    value={newAppointment.title}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Time
                    </label>
                    <input
                      required
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          time: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Duration (min)
                    </label>
                    <select
                      value={newAppointment.duration}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          duration: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Guest Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newAppointment.guestName}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        guestName: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
                >
                  Schedule Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
