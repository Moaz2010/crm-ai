'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  DollarSign,
  User,
  Building2,
  Calendar,
  Loader2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Stage {
  id: string;
  name: string;
  color: string;
  order: number;
  probability: number;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  stage_id: string;
  contact_id: string;
  company_id: string;
  expected_close_date: string;
  status: string;
  contact?: { name: string };
  company?: { name: string };
}

const defaultStages: Stage[] = [
  { id: '1', name: 'Qualified', color: '#3b82f6', order: 1, probability: 20 },
  { id: '2', name: 'Proposal', color: '#8b5cf6', order: 2, probability: 40 },
  { id: '3', name: 'Negotiation', color: '#f59e0b', order: 3, probability: 60 },
  { id: '4', name: 'Closed Won', color: '#22c55e', order: 4, probability: 100 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export function PipelineBoard() {
  const [stages, setStages] = useState<Stage[]>(defaultStages);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingDeal, setDraggingDeal] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
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

  const handleDragStart = (dealId: string) => {
    setDraggingDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: string) => {
    if (!draggingDeal) return;

    // Optimistic update
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === draggingDeal ? { ...deal, stage_id: stageId } : deal
      )
    );

    try {
      await fetch(`/api/deals/${draggingDeal}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: stageId }),
      });
    } catch (error) {
      console.error('Failed to move deal:', error);
      fetchData(); // Revert on error
    }

    setDraggingDeal(null);
  };

  const getStageDeals = (stageId: string) => {
    return deals.filter((deal) => deal.stage_id === stageId);
  };

  const getStageValue = (stageId: string) => {
    return getStageDeals(stageId).reduce(
      (sum, deal) => sum + (deal.value || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {stages.map((stage) => {
        const stageDeals = getStageDeals(stage.id);
        const stageValue = getStageValue(stage.id);

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
          >
            <div
              className="h-full rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            >
              {/* Stage Header */}
              <div
                className="p-4 border-b border-gray-200 dark:border-gray-800 rounded-t-xl"
                style={{
                  background: `linear-gradient(135deg, ${stage.color}15 0%, ${stage.color}05 100%)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {stage.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {stageDeals.length}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {formatCurrency(stageValue)}
                  </span>
                </div>
                <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${stage.probability}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stage.probability}% probability
                </p>
              </div>

              {/* Deals */}
              <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-400px)]">
                {stageDeals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                    No deals
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <Card
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      className={`cursor-grab active:cursor-grabbing border-0 shadow-md hover:shadow-lg transition-shadow ${
                        draggingDeal === deal.id ? 'opacity-50' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {deal.name || 'Untitled Deal'}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 flex-shrink-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(deal.value || 0)}
                            </span>
                          </div>

                          {deal.contact?.name && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <User className="w-4 h-4" />
                              <span className="truncate">{deal.contact.name}</span>
                            </div>
                          )}

                          {deal.company?.name && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Building2 className="w-4 h-4" />
                              <span className="truncate">{deal.company.name}</span>
                            </div>
                          )}

                          {deal.expected_close_date && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(
                                  parseISO(deal.expected_close_date),
                                  'MMM d, yyyy'
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
