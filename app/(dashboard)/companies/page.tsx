'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Building2, MapPin, Globe, Users, MoreHorizontal, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Company {
  id: string;
  name: string;
  website?: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  contacts?: { count: number }[];
  deals?: { count: number }[];
  logo_url?: string;
  totalDealValue?: number;
}

const industries = ['Technology', 'Software', 'Research', 'Analytics', 'Cloud Services', 'Finance', 'Healthcare'];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    domain: '',
    industry: '',
    size: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const result = await response.json();
        setCompanies(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompany.name.trim()) return;
    setSaving(true);
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany),
      });
      if (response.ok) {
        const result = await response.json();
        setCompanies([result.data, ...companies]);
        setIsDialogOpen(false);
        setNewCompany({ name: '', domain: '', industry: '', size: '', location: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating company:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      (company.website || company.domain || '').toLowerCase().includes(search.toLowerCase());
    const matchesIndustry =
      industryFilter === 'all' || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const getContactCount = (c: Company) => c.contacts?.[0]?.count || 0;
  const getDealCount = (c: Company) => c.deals?.[0]?.count || 0;

  const stats = {
    total: companies.length,
    totalContacts: companies.reduce((sum, c) => sum + getContactCount(c), 0),
    totalDeals: companies.reduce((sum, c) => sum + getDealCount(c), 0),
    totalValue: companies.reduce((sum, c) => sum + (c.totalDealValue || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Companies</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your company accounts and relationships
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Create a new company record
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter company name" 
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input 
                  id="domain" 
                  placeholder="company.com" 
                  value={newCompany.domain}
                  onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={newCompany.industry} onValueChange={(v) => setNewCompany({ ...newCompany, industry: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select value={newCompany.size} onValueChange={(v) => setNewCompany({ ...newCompany, size: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="10-50">10-50</SelectItem>
                      <SelectItem value="50-100">50-100</SelectItem>
                      <SelectItem value="100-500">100-500</SelectItem>
                      <SelectItem value="500-1000">500-1000</SelectItem>
                      <SelectItem value="1000+">1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="City, State" 
                  value={newCompany.location}
                  onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of the company"
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCompany} disabled={saving || !newCompany.name.trim()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalContacts}</div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalDeals}</div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Active Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(0)}K</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pipeline Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={company.logo || undefined} alt={company.name} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                      {company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {company.name}
                    </h3>
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      {company.domain}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Company</DropdownMenuItem>
                    <DropdownMenuItem>Add Contact</DropdownMenuItem>
                    <DropdownMenuItem>Create Deal</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {company.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>{company.industry}</span>
                  <Badge variant="outline" className="ml-auto">
                    {company.size}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {company.contacts}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contacts</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {company.deals}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Deals</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ${(company.totalDealValue / 1000).toFixed(0)}K
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No companies found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
