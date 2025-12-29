'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Target, Clock } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export function PipelineStats() {
  const [stats, setStats] = useState({
    totalValue: 0,
    weightedValue: 0,
    dealCount: 0,
    avgDealSize: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/deals?status=open');
        const data = await response.json();
        const deals = data.data || [];

        const totalValue = deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
        const dealCount = deals.length;
        
        setStats({
          totalValue,
          weightedValue: totalValue * 0.35, // Approximate weighted value
          dealCount,
          avgDealSize: dealCount > 0 ? totalValue / dealCount : 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: 'Total Pipeline',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Weighted Value',
      value: formatCurrency(stats.weightedValue),
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Open Deals',
      value: stats.dealCount.toString(),
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Avg Deal Size',
      value: formatCurrency(stats.avgDealSize),
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
