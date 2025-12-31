'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react';

interface LeadCaptureProps {
  onSuccess?: () => void;
}

export function LeadCapture({ onSuccess }: LeadCaptureProps) {
  const [mode, setMode] = useState<'url' | 'text' | 'manual'>('manual');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    lead?: any;
  } | null>(null);

  // Manual form state
  const [manualForm, setManualForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    location: '',
    linkedinUrl: '',
  });

  const handleManualSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualForm,
          status: 'new',
          sourcePlatform: 'manual',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          success: true,
          message: 'Lead created successfully!',
          lead: data.data,
        });
        setManualForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          jobTitle: '',
          location: '',
          linkedinUrl: '',
        });
        onSuccess?.();
      } else {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create lead');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create lead',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/leads/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: mode === 'url' ? url : undefined,
          text: mode === 'text' ? text : undefined,
        }),
      });

      const data = await response.json();

      // Check if AI returned an error about not being configured
      if (data.data?.error === 'AI not configured') {
        throw new Error('AI is not configured. Please use Manual entry mode or configure OPENAI_API_KEY.');
      }

      if (response.ok && data.data) {
        // Check if the parsed data has actual content
        if (!data.data.firstName && !data.data.email && !data.data.company) {
          throw new Error('Could not extract lead information. Please use Manual entry mode.');
        }
        
        // Create the lead with proper field mapping (API expects camelCase)
        const leadData = {
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          company: data.data.company || '',
          jobTitle: data.data.jobTitle || '',
          location: data.data.location || '',
          linkedinUrl: data.data.linkedinUrl || (mode === 'url' && url.includes('linkedin') ? url : ''),
          website: data.data.website || '',
          status: 'new',
          sourcePlatform: mode === 'url' ? (url.includes('linkedin') ? 'linkedin' : 'website') : 'manual',
        };
        
        const createResponse = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        });

        if (createResponse.ok) {
          setResult({
            success: true,
            message: 'Lead captured and created successfully!',
            lead: data.data,
          });
          onSuccess?.();
        } else {
          const errData = await createResponse.json();
          throw new Error(errData.error || 'Failed to create lead');
        }
      } else {
        throw new Error(data.error || 'Failed to parse lead. Try using Manual entry mode.');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to capture lead. Try using Manual entry mode.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'url' | 'text' | 'manual')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual" className="gap-2">
            <User className="w-4 h-4" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <Globe className="w-4 h-4" />
            URL
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-2">
            <FileText className="w-4 h-4" />
            AI Parse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={manualForm.firstName}
                onChange={(e) => setManualForm({ ...manualForm, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={manualForm.lastName}
                onChange={(e) => setManualForm({ ...manualForm, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={manualForm.email}
              onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+1 555-123-4567"
                value={manualForm.phone}
                onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="CEO"
                value={manualForm.jobTitle}
                onChange={(e) => setManualForm({ ...manualForm, jobTitle: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Acme Corp"
              value={manualForm.company}
              onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="San Francisco, CA"
              value={manualForm.location}
              onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
            />
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">LinkedIn Profile or Website URL</Label>
            <Input
              id="url"
              placeholder="https://linkedin.com/in/johndoe or https://company.com/about"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Paste a LinkedIn profile URL or company website to automatically extract lead information
            </p>
          </div>
        </TabsContent>

        <TabsContent value="text" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Lead Information</Label>
            <Textarea
              id="text"
              placeholder="Paste any text containing lead information...

Example:
John Doe
CEO at Acme Corp
john@acme.com
+1 555-123-4567
San Francisco, CA"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
            />
            <p className="text-xs text-gray-500">
              AI will extract name, email, phone, company, title, and other details
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <div>
              <p
                className={`font-medium ${
                  result.success
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {result.message}
              </p>
              {result.lead && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Name:</strong> {result.lead.name || '-'}</p>
                  <p><strong>Email:</strong> {result.lead.email || '-'}</p>
                  <p><strong>Company:</strong> {result.lead.company || '-'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={mode === 'manual' ? handleManualSubmit : handleCapture}
        disabled={loading || (mode === 'url' ? !url : mode === 'text' ? !text : !manualForm.firstName.trim())}
        className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {mode === 'manual' ? 'Creating Lead...' : 'Processing with AI...'}
          </>
        ) : mode === 'manual' ? (
          <>
            <User className="w-4 h-4" />
            Create Lead
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Capture Lead with AI
          </>
        )}
      </Button>
    </div>
  );
}
