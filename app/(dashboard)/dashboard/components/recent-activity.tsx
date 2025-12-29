'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  Clock 
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    lead_created: <UserPlus className="w-4 h-4 text-blue-500" />,
    email_sent: <Mail className="w-4 h-4 text-purple-500" />,
    call_made: <Phone className="w-4 h-4 text-green-500" />,
    meeting_scheduled: <Calendar className="w-4 h-4 text-orange-500" />,
    deal_created: <DollarSign className="w-4 h-4 text-emerald-500" />,
    note_added: <MessageSquare className="w-4 h-4 text-gray-500" />,
  };
  return icons[type] || <Clock className="w-4 h-4 text-gray-400" />;
};

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    lead_created: 'bg-blue-100 dark:bg-blue-900/30',
    email_sent: 'bg-purple-100 dark:bg-purple-900/30',
    call_made: 'bg-green-100 dark:bg-green-900/30',
    meeting_scheduled: 'bg-orange-100 dark:bg-orange-900/30',
    deal_created: 'bg-emerald-100 dark:bg-emerald-900/30',
    note_added: 'bg-gray-100 dark:bg-gray-800',
  };
  return colors[type] || 'bg-gray-100 dark:bg-gray-800';
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities?limit=5');
        const data = await response.json();
        setActivities(data.data || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        // Mock data for demo
        setActivities([
          {
            id: '1',
            type: 'lead_created',
            description: 'New lead captured from LinkedIn',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'meeting_scheduled',
            description: 'Meeting scheduled with John Doe',
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            type: 'email_sent',
            description: 'Follow-up email sent to prospect',
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)} flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
