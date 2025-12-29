'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  ArrowRight 
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'suggestion' | 'warning' | 'success' | 'tip';
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'suggestion',
    title: 'Follow up with hot leads',
    description: '3 leads with score >80 haven\'t been contacted in 5+ days',
    action: { label: 'View leads', href: '/leads?score_min=80' },
  },
  {
    id: '2',
    type: 'tip',
    title: 'Best time to reach out',
    description: 'Your leads respond 40% better between 10-11 AM',
  },
  {
    id: '3',
    type: 'success',
    title: 'Conversion rate improved',
    description: 'Your lead-to-contact conversion is up 15% this month',
  },
];

const getInsightIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    suggestion: <TrendingUp className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    success: <CheckCircle2 className="w-4 h-4" />,
    tip: <Lightbulb className="w-4 h-4" />,
  };
  return icons[type] || <Sparkles className="w-4 h-4" />;
};

const getInsightColors = (type: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    suggestion: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    tip: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
  };
  return colors[type] || colors.suggestion;
};

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>(mockInsights);
  const [loading, setLoading] = useState(false);

  const refreshInsights = async () => {
    setLoading(true);
    // In a real app, this would call an AI endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setInsights(mockInsights);
    setLoading(false);
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          AI Insights
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshInsights}
          disabled={loading}
          className="h-8 w-8"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const colors = getInsightColors(insight.type);
          return (
            <div
              key={insight.id}
              className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${colors.text}`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <Button
                      variant="link"
                      size="sm"
                      className={`p-0 h-auto mt-1 ${colors.text}`}
                      asChild
                    >
                      <a href={insight.action.href}>
                        {insight.action.label}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
