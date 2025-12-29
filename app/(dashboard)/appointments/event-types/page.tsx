"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Video,
  MoreHorizontal,
  Plus,
  X,
  Check,
  Trash2,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventType {
  id: string;
  title: string;
  duration: string;
  type: string;
  description?: string;
  color: string;
}

const DEFAULT_EVENTS: EventType[] = [
  {
    id: "1",
    title: "15 Minute Meeting",
    duration: "15 min",
    type: "One-on-One",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "30 Minute Meeting",
    duration: "30 min",
    type: "One-on-One",
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "Product Demo",
    duration: "45 min",
    type: "One-on-One",
    color: "bg-orange-500",
  },
];

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>(DEFAULT_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    duration: "30",
    description: "",
  });

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/appointments/event-types");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setEventTypes(data);
          }
        }
      } catch (error) {
        console.error("Error fetching event types:", error);
      }
    };
    fetchEventTypes();
  }, []);

  const handleOpenModal = (event?: EventType) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        duration: event.duration.replace(" min", ""),
        description: event.description || "",
      });
    } else {
      setEditingEvent(null);
      setFormData({ title: "", duration: "30", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      title: formData.title,
      duration: `${formData.duration} min`,
      type: "One-on-One",
      description: formData.description,
      color: editingEvent?.color || "bg-green-500",
    };

    try {
      if (editingEvent) {
        await fetch(`/api/appointments/event-types/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        setEventTypes(eventTypes.map((ev) =>
          ev.id === editingEvent.id
            ? { ...ev, ...eventData }
            : ev
        ));
      } else {
        const response = await fetch("/api/appointments/event-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        const newEvent = await response.json();
        setEventTypes([...eventTypes, { ...eventData, id: newEvent.id || Date.now().toString() }]);
      }
    } catch (error) {
      console.error("Error saving event type:", error);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event type?")) {
      try {
        await fetch(`/api/appointments/event-types/${id}`, {
          method: "DELETE",
        });
        setEventTypes(eventTypes.filter((ev) => ev.id !== id));
      } catch (error) {
        console.error("Error deleting event type:", error);
      }
    }
  };

  const copyLink = (event: EventType) => {
    const slug = event.title.toLowerCase().replace(/\s+/g, "-");
    navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`);
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black min-h-screen text-black dark:text-white relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Event Types</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create and manage your meeting templates.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Event Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((event) => (
          <div
            key={event.id}
            className="group relative p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500/50 transition-all hover:shadow-lg"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => handleDelete(event.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div
              className={`h-1 ${
                event.color || "bg-blue-500"
              } w-full absolute top-0 left-0 rounded-t-xl`}
            />

            <h3 className="text-xl font-bold mb-2 mt-2">{event.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {event.type}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{event.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>Zoom</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button 
                onClick={() => copyLink(event)}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy Link
              </button>
              <button
                onClick={() => handleOpenModal(event)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingEvent ? "Edit Event Type" : "New Event Type"}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g. Discovery Call"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Duration (minutes)
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="A brief description of the meeting..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      {editingEvent ? "Save Changes" : "Create Event"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
