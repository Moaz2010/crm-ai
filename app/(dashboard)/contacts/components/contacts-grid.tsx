'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  company_id: string;
  company?: { name: string };
  lifecycle_stage: string;
  avatar_url: string;
  location: string;
  linkedin_url: string;
}

interface ContactsGridProps {
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

export function ContactsGrid({ filters }: ContactsGridProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.lifecycleStage) params.set('lifecycle_stage', filters.lifecycleStage);

      const response = await fetch(`/api/contacts?${params}`);
      const data = await response.json();
      setContacts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No contacts found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Add your first contact to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <Link href={`/contacts/${contact.id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {contact.first_name?.charAt(0) || contact.email?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {contact.first_name} {contact.last_name}
                  </h3>
                  {contact.title && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.title}
                    </p>
                  )}
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </div>

            <div className="mt-4 space-y-2">
              {contact.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.company?.name && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{contact.company.name}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{contact.location}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary" className={getStageColor(contact.lifecycle_stage)}>
                {contact.lifecycle_stage || 'subscriber'}
              </Badge>
              {contact.linkedin_url && (
                <a
                  href={contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
