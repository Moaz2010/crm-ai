"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  ChevronRight,
  CreditCard,
  Video,
  Mail,
  Plus,
} from "lucide-react";

export default function CalendarIntegrations() {
  const [integrations, setIntegrations] = useState([
    {
      id: "google-cal",
      name: "Google Calendar",
      icon: Calendar,
      connected: true,
      category: "calendar",
      account: "user@company.com",
    },
    {
      id: "outlook-cal",
      name: "Outlook Calendar",
      icon: Calendar,
      connected: false,
      category: "calendar",
    },
    {
      id: "zoom",
      name: "Zoom",
      icon: Video,
      connected: true,
      category: "video",
      account: "Licensed",
    },
    {
      id: "meet",
      name: "Google Meet",
      icon: Video,
      connected: false,
      category: "video",
    },
    {
      id: "stripe",
      name: "Stripe",
      icon: CreditCard,
      connected: true,
      category: "payment",
      account: "acct_123...",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: CreditCard,
      connected: false,
      category: "payment",
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Integrations</h3>
        <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Calendars */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1">
            Calendars
          </h4>
          {integrations
            .filter((i) => i.category === "calendar")
            .map((integration) => (
              <IntegrationItem
                key={integration.id}
                item={integration}
                onToggle={() => toggleIntegration(integration.id)}
              />
            ))}
        </div>

        {/* Video Conferencing */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1">
            Video Conferencing
          </h4>
          {integrations
            .filter((i) => i.category === "video")
            .map((integration) => (
              <IntegrationItem
                key={integration.id}
                item={integration}
                onToggle={() => toggleIntegration(integration.id)}
              />
            ))}
        </div>

        {/* Payments */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1">
            Payments
          </h4>
          {integrations
            .filter((i) => i.category === "payment")
            .map((integration) => (
              <IntegrationItem
                key={integration.id}
                item={integration}
                onToggle={() => toggleIntegration(integration.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationItem({
  item,
  onToggle,
}: {
  item: any;
  onToggle: () => void;
}) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            item.connected
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/5 text-gray-400"
          }`}
        >
          <item.icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-200">{item.name}</div>
          {item.connected && item.account && (
            <div className="text-xs text-gray-500">{item.account}</div>
          )}
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          item.connected ? "bg-blue-600" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${
            item.connected ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
