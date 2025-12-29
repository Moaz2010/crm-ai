'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Deal, PipelineStage as ImportedPipelineStage } from '@/types';

type PipelineStage = ImportedPipelineStage;

interface UsePipelineReturn {
  stages: PipelineStage[];
  deals: Deal[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createDeal: (data: Partial<Deal>) => Promise<Deal>;
  updateDeal: (id: string, data: Partial<Deal>) => Promise<Deal>;
  deleteDeal: (id: string) => Promise<void>;
  moveDeal: (dealId: string, stageId: string) => Promise<Deal>;
}

export function usePipeline(): UsePipelineReturn {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPipeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [stagesRes, dealsRes] = await Promise.all([
        fetch('/api/pipeline/stages'),
        fetch('/api/deals'),
      ]);
      
      if (!stagesRes.ok || !dealsRes.ok) {
        throw new Error('Failed to fetch pipeline data');
      }
      
      const [stagesData, dealsData] = await Promise.all([
        stagesRes.json(),
        dealsRes.json(),
      ]);
      
      setStages(stagesData.data || []);
      setDeals(dealsData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const createDeal = async (data: Partial<Deal>): Promise<Deal> => {
    const response = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create deal');
    
    const result = await response.json();
    await fetchPipeline();
    return result.data;
  };

  const updateDeal = async (id: string, data: Partial<Deal>): Promise<Deal> => {
    const response = await fetch(`/api/deals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update deal');
    
    const result = await response.json();
    await fetchPipeline();
    return result.data;
  };

  const deleteDeal = async (id: string): Promise<void> => {
    const response = await fetch(`/api/deals/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete deal');
    await fetchPipeline();
  };

  const moveDeal = async (dealId: string, stageId: string): Promise<Deal> => {
    return updateDeal(dealId, { stageId: stageId });
  };

  return {
    stages,
    deals,
    loading,
    error,
    refetch: fetchPipeline,
    createDeal,
    updateDeal,
    deleteDeal,
    moveDeal,
  };
}

// Get deals grouped by stage
export function useDealsByStage() {
  const { stages, deals, loading, error, ...rest } = usePipeline();
  
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((deal) => deal.stageId === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  
  const weightedValue = deals.reduce((sum, deal) => {
    const stage = stages.find((s) => s.id === deal.stageId);
    return sum + (deal.value || 0) * (stage?.probability || 0) / 100;
  }, 0);

  return {
    stages,
    deals,
    dealsByStage,
    totalValue,
    weightedValue,
    loading,
    error,
    ...rest,
  };
}
