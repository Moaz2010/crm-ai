'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Link2,
  Key,
  Mail,
  Globe,
  Calendar,
  Zap,
  Save,
  Upload,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: true,
    newLead: true,
    dealClosed: true,
    appointmentReminder: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user metadata
        const metadata = user.user_metadata || {};
        setProfile({
          firstName: metadata.first_name || '',
          lastName: metadata.last_name || '',
          email: user.email || '',
          phone: metadata.phone || '',
          bio: metadata.bio || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          bio: profile.bio,
        },
      });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    const first = profile.firstName?.[0] || '';
    const last = profile.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Link2 className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={profile.email}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself" 
                    className="resize-none"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2" onClick={saveProfile} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://acme.com" />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="123 Business St, City, State 12345" className="resize-none" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <Label>Email Notifications</Label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-500" />
                      <Label>Push Notifications</Label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Report</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get a weekly summary of your activity
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Lead Alerts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when new leads are captured
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newLead}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newLead: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deal Closed</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when deals are closed
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dealClosed}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, dealClosed: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminders before scheduled appointments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.appointmentReminder}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminder: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="space-y-4">
            {[
              {
                name: 'Google Calendar',
                description: 'Sync appointments with Google Calendar',
                icon: Calendar,
                connected: true,
              },
              {
                name: 'Apollo.io',
                description: 'Enrich leads with Apollo data',
                icon: Zap,
                connected: false,
              },
              {
                name: 'Clearbit',
                description: 'Company and contact enrichment',
                icon: Building2,
                connected: false,
              },
              {
                name: 'Slack',
                description: 'Get notifications in Slack',
                icon: Bell,
                connected: true,
              },
            ].map((integration) => (
              <Card key={integration.name}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <integration.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Button variant={integration.connected ? 'outline' : 'default'}>
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password regularly for security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="gap-2">
                  <Key className="w-4 h-4" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Two-factor authentication is enabled
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your account is protected with 2FA
                    </p>
                  </div>
                </div>
                <Button variant="outline">Manage</Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
