"use client";

import { useState } from "react";
import { User, Camera, Save, Mail, Phone, Building, MapPin, Globe } from "lucide-react";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc",
    role: "Sales Manager",
    location: "San Francisco, CA",
    website: "https://acme.com",
    bio: "Experienced sales professional with 10+ years in B2B software.",
    avatar: "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal information
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-500">{profile.role} at {profile.company}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="p-6 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6">
        <h2 className="text-lg font-semibold">Work Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
