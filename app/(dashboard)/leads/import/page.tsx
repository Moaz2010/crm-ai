"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, FileSpreadsheet, CheckCircle2, Loader2, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface ParsedLead {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  location?: string;
  status?: string;
}

export default function LeadImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedLeads, setParsedLeads] = useState<ParsedLead[]>([]);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): ParsedLead[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const leads: ParsedLead[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
      const lead: ParsedLead = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header.includes('first') && header.includes('name')) lead.first_name = value;
        else if (header.includes('last') && header.includes('name')) lead.last_name = value;
        else if (header === 'name' || header === 'full name') {
          const parts = value.split(' ');
          lead.first_name = parts[0] || '';
          lead.last_name = parts.slice(1).join(' ') || '';
        }
        else if (header.includes('email')) lead.email = value;
        else if (header.includes('phone') || header.includes('tel')) lead.phone = value;
        else if (header.includes('company') || header.includes('organization')) lead.company_name = value;
        else if (header.includes('title') || header.includes('position') || header.includes('role')) lead.job_title = value;
        else if (header.includes('location') || header.includes('city') || header.includes('address')) lead.location = value;
        else if (header.includes('status')) lead.status = value;
      });
      
      if (lead.email || lead.first_name || lead.last_name || lead.company_name) {
        leads.push(lead);
      }
    }
    
    return leads;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError(null);
    setImported(false);
    
    try {
      const text = await selectedFile.text();
      const leads = parseCSV(text);
      
      if (leads.length === 0) {
        setError('No valid leads found in the file. Make sure your CSV has headers like "Email", "First Name", "Last Name", etc.');
        return;
      }
      
      setParsedLeads(leads);
    } catch (err) {
      setError('Failed to parse file. Please make sure it is a valid CSV file.');
    }
  };

  const handleImport = async () => {
    if (parsedLeads.length === 0) return;
    
    setImporting(true);
    setError(null);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to import leads');
        return;
      }
      
      let successCount = 0;
      
      for (const lead of parsedLeads) {
        const { error: insertError } = await supabase
          .from('leads')
          .insert({
            user_id: user.id,
            first_name: lead.first_name || '',
            last_name: lead.last_name || '',
            email: lead.email || '',
            phone: lead.phone || '',
            company_name: lead.company_name || '',
            job_title: lead.job_title || '',
            location: lead.location || '',
            status: lead.status || 'new',
            source_platform: 'csv_import',
            score: 50,
          });
        
        if (!insertError) successCount++;
      }
      
      setImportedCount(successCount);
      setImported(true);
      setParsedLeads([]);
      setFile(null);
    } catch (err) {
      setError('Failed to import leads. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'First Name,Last Name,Email,Phone,Company,Job Title,Location,Status\nJohn,Doe,john@example.com,+1234567890,Acme Corp,Sales Manager,New York,new\nJane,Smith,jane@example.com,+0987654321,Tech Inc,CEO,San Francisco,contacted';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/leads" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Leads
          </Link>
          <h1 className="text-3xl font-bold">Import Leads</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Bulk upload contacts from CSV files.
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate} className="gap-2">
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {imported ? (
        <Card className="max-w-3xl">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Import Complete!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Successfully imported {importedCount} leads into your CRM.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/leads">
                <Button>View Leads</Button>
              </Link>
              <Button variant="outline" onClick={() => {
                setImported(false);
                setFile(null);
                setParsedLeads([]);
              }}>
                Import More
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-3xl space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-zinc-900/50"
          >
            {file ? (
              <>
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileSpreadsheet className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {parsedLeads.length} leads found
                </p>
                <Button variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setParsedLeads([]);
                }}>
                  Choose Different File
                </Button>
              </>
            ) : (
              <>
                <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Click to upload or drag and drop
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  CSV files supported (max 10MB)
                </p>
                <Button variant="outline">Select File</Button>
              </>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {parsedLeads.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Preview ({parsedLeads.length} leads)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-zinc-900">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Company</th>
                          <th className="px-4 py-2 text-left">Title</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {parsedLeads.slice(0, 5).map((lead, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2">{lead.first_name} {lead.last_name}</td>
                            <td className="px-4 py-2">{lead.email || '-'}</td>
                            <td className="px-4 py-2">{lead.company_name || '-'}</td>
                            <td className="px-4 py-2">{lead.job_title || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedLeads.length > 5 && (
                      <p className="text-sm text-gray-500 mt-2 px-4">
                        ...and {parsedLeads.length - 5} more leads
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleImport} 
                disabled={importing}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Import {parsedLeads.length} Leads
                  </>
                )}
              </Button>
            </>
          )}

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Tip for better results
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Make sure your file has headers like &quot;Email&quot;, &quot;First Name&quot;, &quot;Last Name&quot;, &quot;Company&quot;, etc. 
                Download our template for the correct format.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
