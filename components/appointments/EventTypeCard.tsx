"use client";

import { Clock, Copy, MoreHorizontal, Users, Video } from "lucide-react";
import { useState } from "react";

interface EventTypeProps {
  title: string;
  duration: number;
  type: "One-on-One" | "Group" | "Round Robin";
  url: string;
  color: string;
}

export default function EventTypeCard({
  title,
  duration,
  type,
  url,
  color,
}: EventTypeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
      <div className={`absolute top-0 left-0 h-1 w-full ${color}`} />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Clock className="h-3 w-3" /> {duration} min • {type}
          </p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleCopy}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy Link"}
        </button>
        <div className="flex -space-x-2">
          {/* Mock avatars for team members if applicable */}
          <div className="h-8 w-8 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-xs">
            You
          </div>
        </div>
      </div>
    </div>
  );
}
