'use client';

import { useEffect, useState } from 'react';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Appointment {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_type: string;
  location: string;
  attendee_name: string;
  attendee_email: string;
  status: string;
  notes: string;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    no_show: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return colors[status] || colors.scheduled;
};

const formatDateHeader = (date: string) => {
  const parsed = parseISO(date);
  if (isToday(parsed)) return 'Today';
  if (isTomorrow(parsed)) return 'Tomorrow';
  return format(parsed, 'EEEE, MMMM d');
};

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments?limit=50');
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      await fetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      await fetchAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, apt) => {
    const date = format(parseISO(apt.start_time), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No appointments yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Create your first appointment to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedAppointments)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, dayAppointments]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDateHeader(dayAppointments[0].start_time)}
            </h3>
            <div className="space-y-3">
              {dayAppointments.map((apt) => (
                <Card
                  key={apt.id}
                  className={`border-0 shadow-lg transition-opacity ${
                    isPast(parseISO(apt.end_time)) && apt.status !== 'completed'
                      ? 'opacity-60'
                      : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Time */}
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {format(parseISO(apt.start_time), 'h:mm')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(parseISO(apt.start_time), 'a')}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="w-px h-16 bg-gradient-to-b from-orange-500 to-amber-500" />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {apt.title || 'Meeting'}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              with {apt.attendee_name || apt.attendee_email || 'Guest'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={getStatusColor(apt.status)}
                            >
                              {apt.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleComplete(apt.id)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleCancel(apt.id)}
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(parseISO(apt.start_time), 'h:mm a')} -{' '}
                            {format(parseISO(apt.end_time), 'h:mm a')}
                          </span>
                          {apt.location_type === 'video' ? (
                            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <Video className="w-3 h-3" />
                              Video call
                            </span>
                          ) : apt.location ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {apt.location}
                            </span>
                          ) : null}
                        </div>

                        {apt.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            {apt.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
