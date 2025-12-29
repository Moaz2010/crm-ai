'use client';

import { useState, useEffect } from 'react';
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
  Download,
  Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalLeads: 0,
    totalDeals: 0,
    totalAppointments: 0,
    conversionRate: 0,
    pipelineData: [] as { stage: string; count: number; value: number }[],
    leadSources: [] as { source: string; leads: number; percentage: number }[],
    recentDeals: [] as any[],
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const getDaysFromRange = (range: string) => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '12m': return 365;
      default: return 30;
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const days = getDaysFromRange(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch all data in parallel
      const [leadsRes, dealsRes, appointmentsRes] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('deals')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString()),
      ]);

      const leads = leadsRes.data || [];
      const deals = dealsRes.data || [];
      const appointments = appointmentsRes.data || [];

      const totalRevenue = deals
        .filter(d => d.status === 'won')
        .reduce((sum, d) => sum + (d.value || 0), 0);

      // Group by source
      const sourceGroups = leads.reduce((acc: Record<string, number>, lead) => {
        const source = lead.source_platform || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      const leadSources = Object.entries(sourceGroups)
        .map(([source, count]) => ({
          source: source.charAt(0).toUpperCase() + source.slice(1).replace('_', ' '),
          leads: count as number,
          percentage: leads.length > 0 ? Math.round((count as number / leads.length) * 100) : 0,
        }))
        .sort((a, b) => b.leads - a.leads)
        .slice(0, 5);

      // Pipeline data
      const pipelineStages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed'];
      const pipelineData = pipelineStages.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage || d.status === stage);
        return {
          stage: stage.charAt(0).toUpperCase() + stage.slice(1),
          count: stageDeals.length,
          value: stageDeals.reduce((sum, d) => sum + (d.value || 0), 0),
        };
      }).filter(s => s.count > 0);

      if (pipelineData.length === 0) {
        // Fallback pipeline data if no deals
        pipelineData.push(
          { stage: 'New', count: leads.filter(l => l.status === 'new').length, value: 0 },
          { stage: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, value: 0 },
          { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, value: 0 }
        );
      }

      setStats({
        totalRevenue,
        totalLeads: leads.length,
        totalDeals: deals.length,
        totalAppointments: appointments.length,
        conversionRate: leads.length > 0 ? (deals.filter(d => d.status === 'won').length / leads.length) * 100 : 0,
        pipelineData,
        leadSources,
        recentDeals: deals.slice(0, 5),
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const report = `
Analytics Report - ${new Date().toLocaleDateString()}
Time Range: Last ${getDaysFromRange(timeRange)} days
================================

Overview Stats:
- Total Revenue: $${stats.totalRevenue.toLocaleString()}
- Total Leads: ${stats.totalLeads}
- Total Deals: ${stats.totalDeals}
- Conversion Rate: ${stats.conversionRate.toFixed(1)}%
- Appointments Booked: ${stats.totalAppointments}

Pipeline Summary:
${stats.pipelineData.map(p => `- ${p.stage}: ${p.count} deals ($${p.value.toLocaleString()})`).join('\n')}

Lead Sources:
${stats.leadSources.map(s => `- ${s.source}: ${s.leads} leads (${s.percentage}%)`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const overviewStats = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      title: 'New Leads',
      value: stats.totalLeads.toString(),
      icon: Users,
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: Target,
    },
    {
      title: 'Meetings Booked',
      value: stats.totalAppointments.toString(),
      icon: Calendar,
    },
  ];

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Track your sales performance and insights
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} className="gap-2 w-full sm:w-auto">
            <Download className="w-4 h-4" />
            <span className="sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <LineChart className="w-4 h-4" />
            <span className="hidden sm:inline">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <PieChart className="w-4 h-4" />
            <span className="hidden sm:inline">Lead Sources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Stats Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Key metrics for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${stats.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-10 h-10 text-green-500/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Leads</p>
                      <p className="text-xl font-bold text-blue-600">{stats.totalLeads}</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Deals</p>
                      <p className="text-xl font-bold text-purple-600">{stats.totalDeals}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Deals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deals</CardTitle>
                <CardDescription>Latest deal activity</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentDeals.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentDeals.map((deal, index) => (
                      <div
                        key={deal.id || index}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {(deal.name || 'D')[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{deal.name || 'Untitled Deal'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {deal.status || 'Open'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            ${(deal.value || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No deals in this period. Start creating deals in Pipeline!
                  </div>
                )}
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
              {stats.pipelineData.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {stats.pipelineData.map((stage, index) => (
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
                              {stage.count} {stage.count === 1 ? 'item' : 'items'}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${stage.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.max(5, (stage.count / Math.max(...stats.pipelineData.map(p => p.count), 1)) * 100)}%`,
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
                        {stats.pipelineData.reduce((sum, s) => sum + s.count, 0)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ${stats.pipelineData.reduce((sum, s) => sum + s.value, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pipeline Value</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {stats.conversionRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pipeline data yet. Create deals or capture leads to see your pipeline.
                </div>
              )}
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
                {stats.leadSources.length > 0 ? (
                  <div className="space-y-4">
                    {stats.leadSources.map((source) => (
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No lead source data yet. Start capturing leads to track their sources.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Lead distribution by source</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.leadSources.length > 0 ? (
                  <div className="space-y-4">
                    {stats.leadSources.map((source) => (
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
                          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {source.percentage}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            of total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Capture leads from different sources to see performance data.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
