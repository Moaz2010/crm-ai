"use client";

import { useState } from "react";
import { Key, Plus, Copy, Eye, EyeOff, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  permissions: string[];
}

const mockKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "crm_live_sk_1234567890abcdef",
    created: "2024-01-15",
    lastUsed: "2024-01-20",
    permissions: ["read", "write"],
  },
  {
    id: "2",
    name: "Development Key",
    key: "crm_test_sk_abcdef1234567890",
    created: "2024-01-10",
    permissions: ["read"],
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `crm_live_sk_${Math.random().toString(36).substring(2, 18)}`,
      created: new Date().toISOString().split("T")[0],
      permissions: ["read", "write"],
    };
    
    setKeys([...keys, newKey]);
    setNewKeyName("");
    setIsCreating(false);
  };

  const deleteKey = (id: string) => {
    if (confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      setKeys(keys.filter((k) => k.id !== id));
    }
  };

  const regenerateKey = (id: string) => {
    if (confirm("Are you sure you want to regenerate this API key? The old key will stop working immediately.")) {
      setKeys(keys.map((k) =>
        k.id === id
          ? { ...k, key: `crm_live_sk_${Math.random().toString(36).substring(2, 18)}` }
          : k
      ));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">API Keys</h1>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              📋 Demo Data
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your API keys for external integrations
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Create Key
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            <h3 className="font-semibold mb-4">Create New API Key</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name (e.g., Production API)"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={createKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {keys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800">
                  <Key className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{apiKey.name}</h3>
                  <p className="text-sm text-gray-500">Created {apiKey.created}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => regenerateKey(apiKey.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  title="Regenerate Key"
                >
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => deleteKey(apiKey.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                  title="Delete Key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-zinc-950 rounded-lg font-mono text-sm">
              <span className="flex-1 overflow-hidden">
                {showKey === apiKey.id ? apiKey.key : "•".repeat(32)}
              </span>
              <button
                onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded"
              >
                {showKey === apiKey.id ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey.key)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span>Permissions: {apiKey.permissions.join(", ")}</span>
              {apiKey.lastUsed && <span>Last used: {apiKey.lastUsed}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
