'use client';

import { useEffect, useState } from 'react';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  company?: { name: string };
  lifecycle_stage: string;
  created_at: string;
}

interface ContactsTableProps {
  filters: { search: string; lifecycleStage: string };
}

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    subscriber: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    lead: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    opportunity: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    customer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    evangelist: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return colors[stage] || colors.subscriber;
};

export function ContactsTable({ filters }: ContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchContacts();
  }, [page, filters]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (filters.search) params.set('search', filters.search);
      if (filters.lifecycleStage) params.set('lifecycle_stage', filters.lifecycleStage);

      const response = await fetch(`/api/contacts?${params}`);
      const data = await response.json();
      setContacts(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === contacts.length) {
      setSelected([]);
    } else {
      setSelected(contacts.map((c) => c.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
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
                checked={selected.length === contacts.length && contacts.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Stage</TableHead>
            <TableHead className="font-semibold">Added</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No contacts found</p>
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell>
                  <Checkbox
                    checked={selected.includes(contact.id)}
                    onCheckedChange={() => handleSelect(contact.id)}
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/contacts/${contact.id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-medium shadow">
                      {contact.first_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {contact.first_name} {contact.last_name}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {contact.company?.name || '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    {contact.phone || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStageColor(contact.lifecycle_stage)}>
                    {contact.lifecycle_stage || 'subscriber'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  {contact.created_at
                    ? formatDistanceToNow(parseISO(contact.created_at), { addSuffix: true })
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                      <DropdownMenuItem>Add Deal</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
