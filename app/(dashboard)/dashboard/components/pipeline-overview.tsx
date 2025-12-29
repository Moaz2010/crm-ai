'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Kanban, ArrowRight, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  stage_id: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const defaultStages: Stage[] = [
  { id: '1', name: 'Qualified', color: '#3b82f6', order: 1 },
  { id: '2', name: 'Proposal', color: '#8b5cf6', order: 2 },
  { id: '3', name: 'Negotiation', color: '#f59e0b', order: 3 },
  { id: '4', name: 'Closed Won', color: '#22c55e', order: 4 },
];

export function PipelineOverview() {
  const [stages, setStages] = useState<Stage[]>(defaultStages);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stagesRes, dealsRes] = await Promise.all([
          fetch('/api/pipeline/stages'),
          fetch('/api/deals?status=open'),
        ]);
        
        if (stagesRes.ok) {
          const stagesData = await stagesRes.json();
          if (stagesData.data?.length) setStages(stagesData.data);
        }
        
        if (dealsRes.ok) {
          const dealsData = await dealsRes.json();
          setDeals(dealsData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch pipeline data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStageDeals = (stageId: string) => {
    return deals.filter((deal) => deal.stage_id === stageId);
  };

  const getStageValue = (stageId: string) => {
    return getStageDeals(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Kanban className="w-5 h-5 text-purple-500" />
            Pipeline Overview
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total: {formatCurrency(totalValue)}
          </p>
        </div>
        <Link href="/pipeline">
          <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
            View pipeline
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between mb-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {stages.map((stage) => {
              const stageValue = getStageValue(stage.id);
              const stageCount = getStageDeals(stage.id).length;
              const percentage = totalValue > 0 ? (stageValue / totalValue) * 100 : 0;

              return (
                <div key={stage.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stage.name}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({stageCount})
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(stageValue)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percentage, 2)}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {deals.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Open Deals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalValue * 0.3)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Weighted Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              32%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
