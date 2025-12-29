'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_type: string;
  attendee_name: string;
  status: string;
}

export function AppointmentsCalendar() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize date on client side only
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    if (currentDate) {
      fetchAppointments();
    }
  }, [currentDate]);

  const fetchAppointments = async () => {
    if (!currentDate) return;
    setLoading(true);
    try {
      const start = startOfMonth(currentDate).toISOString();
      const end = endOfMonth(currentDate).toISOString();
      
      const response = await fetch(
        `/api/appointments?start_date=${start}&end_date=${end}`
      );
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Wait for client-side hydration
  if (!currentDate) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) =>
      isSameDay(parseISO(apt.start_time), date)
    );
  };

  const selectedDayAppointments = selectedDate
    ? getAppointmentsForDay(selectedDate)
    : [];

  // Pad days to start on Sunday
  const firstDayOfMonth = startOfMonth(currentDate).getDay();
  const paddedDays = [...Array(firstDayOfMonth).fill(null), ...days];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2 border-0 shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="p-2 h-24" />;
              }

              const dayAppointments = getAppointmentsForDay(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'p-2 h-24 rounded-lg text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-800',
                    isToday(day) && 'bg-orange-50 dark:bg-orange-900/20',
                    isSelected && 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20',
                    !isSameMonth(day, currentDate) && 'opacity-50'
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex w-7 h-7 items-center justify-center rounded-full text-sm',
                      isToday(day) &&
                        'bg-orange-500 text-white font-medium',
                      !isToday(day) && 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className="text-xs px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 truncate"
                      >
                        {format(parseISO(apt.start_time), 'HH:mm')} {apt.title}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedDate
              ? format(selectedDate, 'EEEE, MMMM d')
              : 'Select a day'}
          </h3>

          {selectedDate && selectedDayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                No appointments
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {apt.title || 'Meeting'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        with {apt.attendee_name || 'Guest'}
                      </p>
                    </div>
                    {apt.location_type === 'video' ? (
                      <Video className="w-4 h-4 text-blue-500" />
                    ) : (
                      <MapPin className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {format(parseISO(apt.start_time), 'h:mm a')} -{' '}
                    {format(parseISO(apt.end_time), 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
