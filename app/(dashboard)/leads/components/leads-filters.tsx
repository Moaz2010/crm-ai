'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface LeadsFiltersProps {
  filters: {
    status: string;
    search: string;
    score_min: number;
  };
  onFiltersChange: (filters: any) => void;
}

export function LeadsFilters({ filters, onFiltersChange }: LeadsFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value === 'all' ? '' : value });
  };

  const handleScoreChange = (value: string) => {
    onFiltersChange({ ...filters, score_min: value === 'all' ? 0 : parseInt(value) });
  };

  const clearFilters = () => {
    onFiltersChange({ status: '', search: '', score_min: 0 });
  };

  const hasFilters = filters.status || filters.search || filters.score_min > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search leads..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="qualified">Qualified</SelectItem>
          <SelectItem value="nurturing">Nurturing</SelectItem>
          <SelectItem value="converted">Converted</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>

      {/* Score Filter */}
      <Select
        value={filters.score_min > 0 ? filters.score_min.toString() : 'all'}
        onValueChange={handleScoreChange}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Min Score" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Scores</SelectItem>
          <SelectItem value="80">80+ (Hot)</SelectItem>
          <SelectItem value="60">60+ (Warm)</SelectItem>
          <SelectItem value="40">40+ (Cold)</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
