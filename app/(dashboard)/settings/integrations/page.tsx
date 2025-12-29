"use client";

import { useState } from "react";
import { 
  Search, 
  Link2, 
  Check, 
  X as XIcon, 
  ExternalLink,
  Calendar,
  Mail,
  MessageSquare,
  Zap,
  Database,
  BarChart3
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  connected: boolean;
  popular?: boolean;
}

const integrations: Integration[] = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync appointments with Google Calendar",
    icon: <Calendar className="h-6 w-6" />,
    category: "Calendar",
    connected: true,
    popular: true,
  },
  {
    id: "outlook",
    name: "Outlook Calendar",
    description: "Connect your Outlook calendar",
    icon: <Calendar className="h-6 w-6" />,
    category: "Calendar",
    connected: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send emails directly from the CRM",
    icon: <Mail className="h-6 w-6" />,
    category: "Email",
    connected: true,
    popular: true,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sync contacts with email campaigns",
    icon: <Mail className="h-6 w-6" />,
    category: "Email",
    connected: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications in Slack",
    icon: <MessageSquare className="h-6 w-6" />,
    category: "Communication",
    connected: false,
    popular: true,
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Create Zoom meetings automatically",
    icon: <ExternalLink className="h-6 w-6" />,
    category: "Meetings",
    connected: true,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5,000+ apps",
    icon: <Zap className="h-6 w-6" />,
    category: "Automation",
    connected: false,
    popular: true,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Two-way sync with Salesforce",
    icon: <Database className="h-6 w-6" />,
    category: "CRM",
    connected: false,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Import/export HubSpot data",
    icon: <Database className="h-6 w-6" />,
    category: "CRM",
    connected: false,
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track lead source attribution",
    icon: <BarChart3 className="h-6 w-6" />,
    category: "Analytics",
    connected: false,
  },
];

const categories = ["All", "Calendar", "Email", "Communication", "Meetings", "Automation", "CRM", "Analytics"];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [localIntegrations, setLocalIntegrations] = useState(integrations);

  const toggleConnection = async (id: string) => {
    setLocalIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  };

  const filteredIntegrations = localIntegrations.filter((int) => {
    const matchesSearch = int.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || int.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Connect your favorite tools and services
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Connected Integrations */}
      {localIntegrations.some((int) => int.connected) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Connected</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations
              .filter((int) => int.connected)
              .map((integration) => (
                <div
                  key={integration.id}
                  className="p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleConnection(integration.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    Connected
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations
            .filter((int) => !int.connected)
            .map((integration) => (
              <div
                key={integration.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800">
                      {integration.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{integration.name}</h3>
                        {integration.popular && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleConnection(integration.id)}
                  className="mt-4 w-full py-2 rounded-lg border border-gray-200 dark:border-zinc-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Link2 className="h-4 w-4" />
                  Connect
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
