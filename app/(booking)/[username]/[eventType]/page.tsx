"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import SpotlightCard from "@/components/landing/SpotlightCard";
import RealPyramidLogo from "@/components/ui/RealPyramidLogo";
import { StarsCanvas } from "@/components/ui/Stars";
import { motion } from "framer-motion";
import { BookingService } from "@/modules/scheduling/services/booking-service";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

const EVENT_TYPES: Record<
  string,
  { title: string; duration: number; description: string }
> = {
  "15min": {
    title: "Quick Chat",
    duration: 15,
    description: "A quick 15-minute intro call.",
  },
  "30min": {
    title: "Discovery Call",
    duration: 30,
    description:
      "Book a time to discuss your project requirements and how we can help you grow.",
  },
  "60min": {
    title: "Deep Dive",
    duration: 60,
    description: "An hour-long session to go deep into strategy and execution.",
  },
};

export default function BookingTypePage({
  params,
}: {
  params: { username: string; eventType: string };
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const eventType = EVENT_TYPES[params.eventType] || {
    title: decodeURIComponent(params.eventType),
    duration: 30,
    description: "A meeting with " + params.username,
  };

  // Mock current date for calendar visualization
  const currentDate = new Date();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleDateSelect = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    setStep(2);
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    try {
      // Parse time string to set hours/minutes on the date object
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + eventType.duration);

      await BookingService.createAppointment({
        title: eventType.title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        guestName: formData.name,
        guestEmail: formData.email,
        type: "One-on-One",
        meetingLink: "https://meet.google.com/abc-defg-hij",
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Booking failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <StarsCanvas />
        </div>

        {/* Logo */}
        <div className="absolute top-6 left-6 z-50">
          <RealPyramidLogo />
        </div>

        <SpotlightCard className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-8 text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-500/20 p-4 ring-1 ring-green-500/50">
              <Check className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
            Meeting Scheduled!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You&apos;ll receive a calendar invitation shortly.
          </p>
          <Link
            href={`/`}
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </SpotlightCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <StarsCanvas />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <RealPyramidLogo />
      </div>

      <SpotlightCard className="w-full max-w-5xl bg-white/90 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] relative z-10">
        {/* Left Sidebar: Meeting Info */}
        <div className="w-full md:w-1/3 bg-gray-50/50 dark:bg-black/40 p-8 text-black dark:text-white border-r border-gray-200 dark:border-white/10 flex flex-col">
          <Link
            href={`/`}
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>

          <div className="mb-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              {params.username}
            </p>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
              {eventType.title}
            </h1>

            <div className="space-y-4 text-gray-600 dark:text-gray-300 mt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{eventType.duration} min</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Google Meet</span>
              </div>
            </div>
          </div>

          <div className="mt-auto text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            <p>{eventType.description}</p>
          </div>
        </div>

        {/* Right Content: Calendar & Form */}
        <div className="flex-1 p-8 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-transparent">
          {step === 1 ? (
            <div className="flex flex-col md:flex-row gap-8 h-full">
              {/* Calendar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-black dark:text-white">
                    {currentDate.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-black dark:text-white">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-black dark:text-white">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-gray-400 dark:text-gray-500 font-medium py-2 uppercase text-xs tracking-wider"
                      >
                        {d}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDate?.getDate() === day;
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        className={`
                          h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                          ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                              : "hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full md:w-48 border-l border-gray-200 dark:border-white/10 pl-8"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                    {selectedDate.toLocaleDateString("default", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          w-full py-2 px-4 rounded-lg border text-sm font-medium transition-all
                          ${
                            selectedTime === time
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                              : "border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 bg-white dark:bg-black/20"
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {selectedTime && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleConfirm}
                      className="mt-6 w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
                    >
                      Next
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-md mx-auto"
            >
              <button
                onClick={() => setStep(1)}
                className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Calendar
              </button>

              <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
                Enter Details
              </h2>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSchedule();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-lg bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full rounded-lg bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    placeholder="Anything else we should know?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Event"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
}
