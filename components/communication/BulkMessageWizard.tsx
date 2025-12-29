"use client";

import { useState } from "react";
import {
  Users,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
  Send,
  FileText,
  AlertCircle,
} from "lucide-react";

const MOCK_CONTACTS = [
  {
    id: 1,
    name: "Sarah Miller",
    company: "TechFlow",
    email: "sarah@techflow.com",
    selected: false,
  },
  {
    id: 2,
    name: "John Cooper",
    company: "GrowthLabs",
    email: "john@growthlabs.com",
    selected: false,
  },
  {
    id: 3,
    name: "Emma Wilson",
    company: "ScaleUp",
    email: "emma@scaleup.io",
    selected: false,
  },
  {
    id: 4,
    name: "Michael Chen",
    company: "FutureCorp",
    email: "m.chen@future.com",
    selected: false,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    company: "GlobalTech",
    email: "lisa@global.com",
    selected: false,
  },
];

export default function BulkMessageWizard() {
  const [step, setStep] = useState(1);
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [message, setMessage] = useState("");

  const toggleContact = (id: number) => {
    setContacts(
      contacts.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const toggleAll = () => {
    const allSelected = contacts.every((c) => c.selected);
    setContacts(contacts.map((c) => ({ ...c, selected: !allSelected })));
  };

  const selectedCount = contacts.filter((c) => c.selected).length;

  return (
    <div className="h-full flex flex-col p-6">
      {/* Demo Badge */}
      <div className="flex justify-center mb-4">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          📋 Demo Data - Bulk Messaging Preview
        </span>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-blue-400" : "text-gray-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1
                  ? "bg-blue-500/20 border border-blue-500"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              1
            </div>
            <span className="font-medium">Audience</span>
          </div>
          <div className="w-12 h-px bg-white/10" />
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-blue-400" : "text-gray-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2
                  ? "bg-blue-500/20 border border-blue-500"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              2
            </div>
            <span className="font-medium">Compose</span>
          </div>
          <div className="w-12 h-px bg-white/10" />
          <div
            className={`flex items-center gap-2 ${
              step >= 3 ? "text-blue-400" : "text-gray-600"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 3
                  ? "bg-blue-500/20 border border-blue-500"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              3
            </div>
            <span className="font-medium">Review</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {step === 1 && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAll}
                  className="text-gray-400 hover:text-white"
                >
                  {contacts.every((c) => c.selected) ? (
                    <CheckSquare className="h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
                <span className="text-sm font-medium text-gray-300">
                  {selectedCount} selected
                </span>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => toggleContact(contact.id)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                    contact.selected
                      ? "bg-blue-500/10 border border-blue-500/20"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      contact.selected
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-600"
                    }`}
                  >
                    {contact.selected && (
                      <CheckSquare className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-medium text-white">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{contact.name}</div>
                    <div className="text-sm text-gray-500">
                      {contact.company} • {contact.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Compose Message
              </h3>
              <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Load Template
              </button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi {{name}}, ..."
              className="flex-1 w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
            />
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="h-4 w-4" />
              Use {"{{name}}"} or {"{{company}}"} to personalize your message
              automatically.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col h-full p-6 items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <Send className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Send?
            </h3>
            <p className="text-gray-400 max-w-md mb-8">
              You are about to send this message to{" "}
              <span className="text-white font-bold">
                {selectedCount} contacts
              </span>
              . The system will automatically personalize each message.
            </p>

            <div className="bg-black/40 rounded-xl p-4 w-full max-w-md text-left mb-8 border border-white/10">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                Preview
              </div>
              <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {message || "(No message content)"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-6 py-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={step === 1 && selectedCount === 0}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors font-medium"
        >
          {step === 3 ? (
            <>
              <Send className="h-4 w-4" />
              Send Broadcast
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
