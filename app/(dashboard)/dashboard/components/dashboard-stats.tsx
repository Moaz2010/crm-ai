'use client';

import { Users, UserPlus, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardStatsProps {
  leadsCount: number;
  contactsCount: number;
  appointmentsCount: number;
  pipelineValue: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export function DashboardStats({
  leadsCount,
  contactsCount,
  appointmentsCount,
  pipelineValue,
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Leads',
      value: leadsCount.toString(),
      change: '+12%',
      trend: 'up',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Contacts',
      value: contactsCount.toString(),
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Upcoming Meetings',
      value: appointmentsCount.toString(),
      change: '-3%',
      trend: 'down',
      icon: Calendar,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(pipelineValue),
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-400">vs last month</span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl ${stat.bgColor}`}
              >
                <stat.icon
                  className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  style={{
                    stroke: `url(#gradient-${stat.title})`,
                  }}
                />
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id={`gradient-${stat.title}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('purple') ? '#a855f7' : stat.color.includes('orange') ? '#f97316' : '#22c55e'} />
                      <stop offset="100%" stopColor={stat.color.includes('blue') ? '#06b6d4' : stat.color.includes('purple') ? '#ec4899' : stat.color.includes('orange') ? '#f59e0b' : '#10b981'} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </CardContent>
          {/* Gradient accent */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
          />
        </Card>
      ))}
    </div>
  );
}
