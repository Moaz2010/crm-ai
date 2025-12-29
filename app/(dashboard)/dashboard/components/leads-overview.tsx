'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Globe, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  score: number;
  status: string;
  source: string;
  created_at: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (score >= 60) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    contacted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    nurturing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return colors[status] || colors.new;
};

const getSourceIcon = (source: string) => {
  if (source?.includes('linkedin')) return <Globe className="w-3 h-3" />;
  if (source?.includes('email')) return <Mail className="w-3 h-3" />;
  if (source?.includes('phone')) return <Phone className="w-3 h-3" />;
  return <Sparkles className="w-3 h-3" />;
};

export function LeadsOverview() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads?limit=5&sort=created_at&order=desc');
        const data = await response.json();
        setLeads(data.data || []);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Recent Leads
        </CardTitle>
        <Link href="/leads">
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No leads yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start capturing leads with AI
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-lg">
                  {lead.name?.charAt(0) || 'L'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {lead.name || 'Unknown'}
                    </h4>
                    {lead.source && (
                      <span className="text-gray-400">
                        {getSourceIcon(lead.source)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {lead.company || lead.email || 'No details'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor(lead.status)}>
                    {lead.status || 'new'}
                  </Badge>
                  {lead.score > 0 && (
                    <Badge variant="secondary" className={getScoreColor(lead.score)}>
                      {lead.score}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
