'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Mail,
  Phone,
  Globe,
  Sparkles,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  score: number;
  status: string;
  source: string;
  linkedin_url: string;
  website: string;
  created_at: string;
  enriched: boolean;
}

interface LeadsTableProps {
  filters: {
    status: string;
    search: string;
    score_min: number;
  };
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
    converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || colors.new;
};

export function LeadsTable({ filters }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [enriching, setEnriching] = useState<string | null>(null);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchLeads();
  }, [page, filters]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      if (filters.score_min > 0) params.set('score_min', filters.score_min.toString());
      
      const response = await fetch(`/api/leads?${params}`);
      const data = await response.json();
      
      setLeads(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === leads.length) {
      setSelected([]);
    } else {
      setSelected(leads.map((lead) => lead.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleEnrich = async (id: string) => {
    setEnriching(id);
    try {
      await fetch('/api/leads/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: id }),
      });
      await fetchLeads();
    } catch (error) {
      console.error('Failed to enrich lead:', error);
    } finally {
      setEnriching(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      await fetchLeads();
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selected.length === leads.length && leads.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="font-semibold">Lead</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Score</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Source</TableHead>
            <TableHead className="font-semibold">Added</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No leads found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Start capturing leads with AI
                </p>
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selected.includes(lead.id)}
                    onCheckedChange={() => handleSelect(lead.id)}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/leads/${lead.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow">
                      {lead.name?.charAt(0) || 'L'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {lead.name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {lead.company || '-'}
                    </p>
                    {lead.title && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lead.title}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getScoreColor(lead.score || 0)}>
                    {lead.score || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(lead.status)}>
                    {lead.status || 'new'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    {lead.source?.includes('linkedin') ? (
                      <Globe className="w-4 h-4" />
                    ) : lead.source?.includes('email') ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span className="capitalize">{lead.source || 'manual'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  {lead.created_at
                    ? formatDistanceToNow(parseISO(lead.created_at), { addSuffix: true })
                    : '-'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/leads/${lead.id}`}>View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEnrich(lead.id)}
                        disabled={enriching === lead.id}
                      >
                        {enriching === lead.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enriching...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Enrich with AI
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
