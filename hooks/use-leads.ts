'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Lead } from '@/types';

interface UseLeadsOptions {
  status?: string;
  score_min?: number;
  search?: string;
  limit?: number;
}

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: Error | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  createLead: (data: Partial<Lead>) => Promise<Lead>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  enrichLead: (id: string) => Promise<Lead>;
}

export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = options.limit || 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (options.status) params.set('status', options.status);
      if (options.score_min) params.set('score_min', options.score_min.toString());
      if (options.search) params.set('search', options.search);
      
      const response = await fetch(`/api/leads?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();
      setLeads(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [page, limit, options.status, options.score_min, options.search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const totalPages = Math.ceil(total / limit);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const createLead = async (data: Partial<Lead>): Promise<Lead> => {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create lead');
    }
    
    const result = await response.json();
    await fetchLeads();
    return result.data;
  };

  const updateLead = async (id: string, data: Partial<Lead>): Promise<Lead> => {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update lead');
    }
    
    const result = await response.json();
    await fetchLeads();
    return result.data;
  };

  const deleteLead = async (id: string): Promise<void> => {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete lead');
    }
    
    await fetchLeads();
  };

  const enrichLead = async (id: string): Promise<Lead> => {
    const response = await fetch('/api/leads/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: id }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to enrich lead');
    }
    
    const result = await response.json();
    await fetchLeads();
    return result.data;
  };

  return {
    leads,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchLeads,
    nextPage,
    prevPage,
    setPage,
    createLead,
    updateLead,
    deleteLead,
    enrichLead,
  };
}

// Real-time subscription hook
export function useLeadsRealtime(userId: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new as Lead, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) =>
              prev.map((lead) =>
                lead.id === payload.new.id ? (payload.new as Lead) : lead
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) =>
              prev.filter((lead) => lead.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return leads;
}
