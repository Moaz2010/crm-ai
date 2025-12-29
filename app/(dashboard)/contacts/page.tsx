'use client';

import { useState } from 'react';
import { UserCircle, Plus, Upload, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactsGrid } from './components/contacts-grid';
import { ContactsTable } from './components/contacts-table';
import { ContactsFilters } from './components/contacts-filters';
import { CreateContactDialog } from './components/create-contact-dialog';

export default function ContactsPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [filters, setFilters] = useState({ search: '', lifecycleStage: '' });
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-cyan-500" />
            Contacts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your contacts and relationships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('grid')}
              className="rounded-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={view === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('table')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ContactsFilters filters={filters} onFiltersChange={setFilters} />

      {/* Content */}
      {view === 'grid' ? (
        <ContactsGrid filters={filters} />
      ) : (
        <ContactsTable filters={filters} />
      )}

      {/* Create Dialog */}
      <CreateContactDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
