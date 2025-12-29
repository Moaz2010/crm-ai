'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  LineChart,
  PieChart,
} from 'lucide-react';

// Mock data for analytics
const overviewStats = [
  {
    title: 'Total Revenue',
    value: '$284,500',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'New Leads',
    value: '2,847',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Conversion Rate',
    value: '24.8%',
    change: '-2.1%',
    trend: 'down',
    icon: Target,
  },
  {
    title: 'Meetings Booked',
    value: '186',
    change: '+15.3%',
    trend: 'up',
    icon: Calendar,
  },
];

const pipelineData = [
  { stage: 'Lead', count: 245, value: 485000 },
  { stage: 'Qualified', count: 128, value: 320000 },
  { stage: 'Proposal', count: 64, value: 196000 },
  { stage: 'Negotiation', count: 32, value: 124000 },
  { stage: 'Closed Won', count: 18, value: 89000 },
];

const revenueByMonth = [
  { month: 'Jan', revenue: 42000, leads: 320 },
  { month: 'Feb', revenue: 38000, leads: 280 },
  { month: 'Mar', revenue: 55000, leads: 410 },
  { month: 'Apr', revenue: 48000, leads: 350 },
  { month: 'May', revenue: 62000, leads: 480 },
  { month: 'Jun', revenue: 58000, leads: 420 },
];

const topPerformers = [
  { name: 'Sarah Chen', deals: 24, revenue: 125000, avatar: 'SC' },
  { name: 'Michael Roberts', deals: 21, revenue: 98000, avatar: 'MR' },
  { name: 'Emily Watson', deals: 18, revenue: 87000, avatar: 'EW' },
  { name: 'David Kim', deals: 15, revenue: 76000, avatar: 'DK' },
  { name: 'Jessica Liu', deals: 12, revenue: 65000, avatar: 'JL' },
];

const leadSources = [
  { source: 'Website', leads: 820, percentage: 35, conversionRate: 28.5 },
  { source: 'LinkedIn', leads: 540, percentage: 23, conversionRate: 22.3 },
  { source: 'Referral', leads: 420, percentage: 18, conversionRate: 35.8 },
  { source: 'Cold Outreach', leads: 310, percentage: 13, conversionRate: 12.4 },
  { source: 'Events', leads: 260, percentage: 11, conversionRate: 18.9 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your sales performance and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2">
            <LineChart className="w-4 h-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2">
            <PieChart className="w-4 h-4" />
            Lead Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 pt-4">
                  {revenueByMonth.map((month, i) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-md transition-all hover:opacity-80"
                        style={{ height: `${(month.revenue / 62000) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{month.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Revenue</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Sales team leaderboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div
                      key={performer.name}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {performer.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{performer.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {performer.deals} deals closed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          ${(performer.revenue / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Overview</CardTitle>
              <CardDescription>Deals by stage with total value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pipelineData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: `hsl(${240 - index * 30}, 70%, 50%)`,
                          }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stage.stage}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {stage.count} deals
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${(stage.value / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(stage.count / pipelineData[0].count) * 100}%`,
                          backgroundColor: `hsl(${240 - index * 30}, 70%, 50%)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pipelineData.reduce((sum, s) => sum + s.count, 0)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Deals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${(pipelineData.reduce((sum, s) => sum + s.value, 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pipeline Value</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {((pipelineData[4].count / pipelineData[0].count) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where your leads are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leadSources.map((source, index) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {source.source}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {source.leads} leads ({source.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Conversion rate by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leadSources.map((source) => {
                    const conversionRate = source.conversionRate;
                    return (
                      <div
                        key={source.source}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {source.source}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {source.leads} total leads
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
                              conversionRate > 25
                                ? 'text-green-600 dark:text-green-400'
                                : conversionRate > 15
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {conversionRate.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            conversion rate
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
