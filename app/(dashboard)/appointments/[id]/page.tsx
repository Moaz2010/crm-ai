"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Video, User, Mail, MapPin, RefreshCw, X as XIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Appointment {
  id: string;
  title: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  duration: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingLink?: string;
  attendee: {
    name: string;
    email: string;
    avatar?: string;
  };
  notes?: string;
  questions?: Array<{ question: string; answer: string }>;
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAppointment(data);
        } else {
          // Mock data for demo
          setAppointment({
            id: params.id as string,
            title: "Product Demo",
            status: "confirmed",
            duration: 30,
            date: "Friday, November 24, 2025",
            startTime: "10:00 AM",
            endTime: "10:30 AM",
            location: "Zoom Meeting",
            meetingLink: "https://zoom.us/j/123456789",
            attendee: {
              name: "John Doe",
              email: "john@example.com",
            },
            questions: [
              { question: "What is your company size?", answer: "50-100 employees" },
              { question: "What are you looking to achieve?", answer: "Improve sales pipeline visibility" }
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [params.id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    setCancelling(true);
    try {
      await fetch(`/api/appointments/${params.id}/cancel`, {
        method: "POST",
      });
      router.push("/appointments");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setCancelling(false);
    }
  };

  const handleReschedule = () => {
    router.push(`/appointments/${params.id}/reschedule`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Appointment not found</p>
        <Link href="/appointments" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <Link
        href="/appointments"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Calendar
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">{appointment.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <span>•</span>
                <span>{appointment.duration} min</span>
              </div>
            </div>
            {appointment.status !== "cancelled" && appointment.status !== "completed" && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <XIcon className="h-4 w-4" />
                  Cancel
                </button>
                <button 
                  onClick={handleReschedule}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reschedule
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Date & Time
              </h3>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{appointment.date}</p>
                  <p className="text-sm text-gray-500">{appointment.startTime} - {appointment.endTime}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Location
              </h3>
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{appointment.location}</p>
                  {appointment.meetingLink && (
                    <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-zinc-800 pt-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Attendee
            </h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                {appointment.attendee.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium">{appointment.attendee.name}</p>
                <p className="text-sm text-gray-500">{appointment.attendee.email}</p>
              </div>
              <a 
                href={`mailto:${appointment.attendee.email}`}
                className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-400" />
              </a>
            </div>

            {appointment.questions && appointment.questions.length > 0 && (
              <div className="mt-6 space-y-3">
                {appointment.questions.map((q, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800">
                    <p className="text-sm font-medium mb-1">{q.question}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{q.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {appointment.notes && (
            <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 mt-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{appointment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
