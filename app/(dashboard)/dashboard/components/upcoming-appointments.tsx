'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_type: string;
  attendee_name: string;
  attendee_email: string;
  status: string;
}

const formatAppointmentDate = (date: string) => {
  const parsed = parseISO(date);
  if (isToday(parsed)) return 'Today';
  if (isTomorrow(parsed)) return 'Tomorrow';
  return format(parsed, 'EEE, MMM d');
};

const formatTime = (date: string) => {
  return format(parseISO(date), 'h:mm a');
};

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments?limit=5&status=scheduled');
        const data = await response.json();
        setAppointments(data.data || []);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          Upcoming
        </CardTitle>
        <Link href="/appointments">
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <Link
                key={apt.id}
                href={`/appointments/${apt.id}`}
                className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {apt.title || 'Meeting'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      with {apt.attendee_name || apt.attendee_email || 'Guest'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {apt.location_type === 'video' ? (
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatAppointmentDate(apt.start_time)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(apt.start_time)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
