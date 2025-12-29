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
} from 'lucide-react';

interface LeadCaptureProps {
  onSuccess?: () => void;
}

export function LeadCapture({ onSuccess }: LeadCaptureProps) {
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    lead?: any;
  } | null>(null);

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

      if (response.ok && data.data) {
        // Create the lead with proper field mapping
        const leadData = {
          first_name: data.data.firstName || '',
          last_name: data.data.lastName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          company_name: data.data.company || '',
          job_title: data.data.jobTitle || '',
          location: data.data.location || '',
          linkedin_url: data.data.linkedinUrl || (mode === 'url' && url.includes('linkedin') ? url : ''),
          website: data.data.website || '',
          score: data.data.leadScore || 50,
          status: 'new',
          source_platform: mode === 'url' ? (url.includes('linkedin') ? 'linkedin' : 'website') : 'manual',
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
        throw new Error(data.error || 'Failed to parse lead');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to capture lead',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'url' | 'text')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="gap-2">
            <Globe className="w-4 h-4" />
            URL / LinkedIn
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-2">
            <FileText className="w-4 h-4" />
            Paste Text
          </TabsTrigger>
        </TabsList>

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
        onClick={handleCapture}
        disabled={loading || (mode === 'url' ? !url : !text)}
        className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing with AI...
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
