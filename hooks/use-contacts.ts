'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Contact } from '@/types';

interface UseContactsOptions {
  search?: string;
  companyId?: string;
  lifecycleStage?: string;
  limit?: number;
}

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: Error | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  createContact: (data: Partial<Contact>) => Promise<Contact>;
  updateContact: (id: string, data: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
}

export function useContacts(options: UseContactsOptions = {}): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = options.limit || 20;

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (options.search) params.set('search', options.search);
      if (options.companyId) params.set('company_id', options.companyId);
      if (options.lifecycleStage) params.set('lifecycle_stage', options.lifecycleStage);
      
      const response = await fetch(`/api/contacts?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const data = await response.json();
      setContacts(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [page, limit, options.search, options.companyId, options.lifecycleStage]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const totalPages = Math.ceil(total / limit);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const createContact = async (data: Partial<Contact>): Promise<Contact> => {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create contact');
    
    const result = await response.json();
    await fetchContacts();
    return result.data;
  };

  const updateContact = async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update contact');
    
    const result = await response.json();
    await fetchContacts();
    return result.data;
  };

  const deleteContact = async (id: string): Promise<void> => {
    const response = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete contact');
    await fetchContacts();
  };

  return {
    contacts,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchContacts,
    nextPage,
    prevPage,
    setPage,
    createContact,
    updateContact,
    deleteContact,
  };
}
