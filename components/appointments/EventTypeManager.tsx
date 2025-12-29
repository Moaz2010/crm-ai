"use client";

import { useState } from "react";
import {
  Clock,
  MoreVertical,
  Plus,
  Video,
  MapPin,
  Phone,
  DollarSign,
  Globe,
  Copy,
  Trash2,
  Edit2,
} from "lucide-react";

type EventType = {
  id: string;
  title: string;
  duration: number;
  type: "video" | "in-person" | "phone";
  location: string;
  price: number;
  currency: string;
  bufferBefore: number;
  bufferAfter: number;
  active: boolean;
  color: string;
};

export default function EventTypeManager() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([
    {
      id: "1",
      title: "Discovery Call",
      duration: 30,
      type: "video",
      location: "Zoom",
      price: 0,
      currency: "USD",
      bufferBefore: 0,
      bufferAfter: 15,
      active: true,
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Consultation",
      duration: 60,
      type: "video",
      location: "Google Meet",
      price: 150,
      currency: "USD",
      bufferBefore: 15,
      bufferAfter: 15,
      active: true,
      color: "bg-purple-500",
    },
    {
      id: "3",
      title: "On-site Visit",
      duration: 90,
      type: "in-person",
      location: "Client Office",
      price: 300,
      currency: "USD",
      bufferBefore: 60,
      bufferAfter: 60,
      active: false,
      color: "bg-green-500",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Types</h2>
          <p className="text-gray-400">
            Create and manage your meeting templates
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">
          <Plus className="h-4 w-4" />
          New Event Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {eventTypes.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}

        {/* Create New Card Placeholder */}
        <button className="group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all h-full min-h-[200px]">
          <div className="p-4 rounded-full bg-white/5 group-hover:bg-blue-500/20 text-gray-400 group-hover:text-blue-400 transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-blue-400">
            Create Event Type
          </span>
        </button>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: EventType }) {
  return (
    <div className="group relative p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:shadow-xl hover:shadow-black/20">
      {/* Top Bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1.5 rounded-t-2xl ${
          event.active ? event.color : "bg-gray-700"
        }`}
      />

      <div className="flex justify-between items-start mb-4 mt-2">
        <div>
          <h3
            className={`font-semibold text-lg ${
              event.active ? "text-white" : "text-gray-500"
            }`}
          >
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{event.duration} min</span>
            <span>•</span>
            <span>
              {event.type === "video"
                ? "Video"
                : event.type === "phone"
                ? "Phone"
                : "In-person"}
            </span>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="p-1.5 rounded bg-white/5">
            {event.type === "video" ? (
              <Video className="h-3.5 w-3.5" />
            ) : event.type === "phone" ? (
              <Phone className="h-3.5 w-3.5" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
          </div>
          <span className="truncate">{event.location}</span>
        </div>

        {event.price > 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="p-1.5 rounded bg-white/5">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
            <span>
              {event.currency} {event.price}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <button className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
          <Copy className="h-3 w-3" />
          Copy Link
        </button>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <div
            className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${
              event.active
                ? "bg-green-500/10 text-green-400"
                : "bg-gray-500/10 text-gray-500"
            }`}
          >
            {event.active ? "Active" : "Draft"}
          </div>
        </div>
      </div>
    </div>
  );
}
