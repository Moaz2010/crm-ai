"use client";

import { useState } from "react";
import {
  Plus,
  FileText,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Search,
} from "lucide-react";

interface Template {
  id: string;
  title: string;
  subject: string;
  content: string;
  type: "email" | "sms";
  lastUsed: string;
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: "1",
    title: "Initial Outreach",
    subject: "Quick question about [Company]",
    content:
      "Hi [Name], I noticed you're leading the sales team at [Company]...",
    type: "email",
    lastUsed: "2 days ago",
  },
  {
    id: "2",
    title: "Meeting Follow-up",
    subject: "Great chatting today",
    content: "Thanks for taking the time to connect. As discussed...",
    type: "email",
    lastUsed: "Yesterday",
  },
  {
    id: "3",
    title: "SMS Reminder",
    subject: "",
    content: "Hi [Name], just a reminder about our call in 1 hour.",
    type: "sms",
    lastUsed: "1 week ago",
  },
  {
    id: "4",
    title: "Proposal Sent",
    subject: "Proposal for [Project]",
    content: "I've attached the proposal we discussed. Let me know if...",
    type: "email",
    lastUsed: "3 days ago",
  },
];

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Templates</h2>
          <p className="text-gray-400">Manage your email and SMS templates</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📋 Demo Data
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pb-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:shadow-xl hover:shadow-black/20 flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${
                    template.type === "email"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {template.type}
                </span>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <h3 className="font-semibold text-white mb-1">{template.title}</h3>
            {template.subject && (
              <p className="text-sm text-gray-400 mb-2 truncate">
                Subject:{" "}
                <span className="text-gray-300">{template.subject}</span>
              </p>
            )}

            <div className="flex-1 bg-black/20 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 line-clamp-3 font-mono">
                {template.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
              <span className="text-xs text-gray-600">
                Used {template.lastUsed}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-blue-400 transition-colors">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button className="group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all min-h-[250px]">
          <div className="p-4 rounded-full bg-white/5 group-hover:bg-blue-500/20 text-gray-400 group-hover:text-blue-400 transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-blue-400">
            Create New Template
          </span>
        </button>
      </div>
    </div>
  );
}
