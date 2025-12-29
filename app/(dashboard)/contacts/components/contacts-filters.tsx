'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface ContactsFiltersProps {
  filters: { search: string; lifecycleStage: string };
  onFiltersChange: (filters: any) => void;
}

export function ContactsFilters({ filters, onFiltersChange }: ContactsFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStageChange = (value: string) => {
    onFiltersChange({ ...filters, lifecycleStage: value === 'all' ? '' : value });
  };

  const clearFilters = () => {
    onFiltersChange({ search: '', lifecycleStage: '' });
  };

  const hasFilters = filters.search || filters.lifecycleStage;

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search contacts..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={filters.lifecycleStage || 'all'} onValueChange={handleStageChange}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Lifecycle Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="subscriber">Subscriber</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
          <SelectItem value="opportunity">Opportunity</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="evangelist">Evangelist</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
