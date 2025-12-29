"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Trash2, 
  UserPlus,
  Check,
  X as XIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  avatar?: string;
  status: "active" | "pending";
  joinedAt?: string;
}

const mockTeam: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "owner",
    status: "active",
    joinedAt: "Jan 1, 2024",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "active",
    joinedAt: "Jan 5, 2024",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "member",
    status: "active",
    joinedAt: "Jan 10, 2024",
  },
  {
    id: "4",
    name: "alice@example.com",
    email: "alice@example.com",
    role: "member",
    status: "pending",
  },
];

const roleColors = {
  owner: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  viewer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [search, setSearch] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member");

  const filteredTeam = team.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail,
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
    };

    setTeam([...team, newMember]);
    setInviteEmail("");
    setIsInviting(false);
  };

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeam(team.filter((m) => m.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: TeamMember["role"]) => {
    setTeam(team.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        <button
          onClick={() => setIsInviting(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            <h3 className="font-semibold mb-4">Invite Team Member</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                onClick={handleInvite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Invite
              </button>
              <button
                onClick={() => setIsInviting(false)}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search team members..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Team List */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-gray-100 dark:divide-zinc-800">
        {filteredTeam.map((member) => (
          <div
            key={member.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{member.name}</p>
                  {member.status === "pending" && (
                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                disabled={member.role === "owner"}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${roleColors[member.role]} border-0 outline-none cursor-pointer disabled:cursor-default`}
              >
                <option value="owner" disabled>Owner</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              {member.role !== "owner" && (
                <button
                  onClick={() => handleRemove(member.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Role Descriptions */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Role Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-purple-600 dark:text-purple-400">Owner</p>
            <p className="text-gray-500">Full access, billing, delete workspace</p>
          </div>
          <div>
            <p className="font-medium text-blue-600 dark:text-blue-400">Admin</p>
            <p className="text-gray-500">Manage team, settings, and data</p>
          </div>
          <div>
            <p className="font-medium text-gray-600 dark:text-gray-400">Member</p>
            <p className="text-gray-500">Create, edit, and delete records</p>
          </div>
          <div>
            <p className="font-medium text-green-600 dark:text-green-400">Viewer</p>
            <p className="text-gray-500">View-only access to data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
