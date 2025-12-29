'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Appointment, EventType } from '@/types';

interface UseAppointmentsOptions {
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => Promise<void>;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<Appointment>;
  cancelAppointment: (id: string, reason?: string) => Promise<void>;
  rescheduleAppointment: (id: string, newStartTime: string, newEndTime: string) => Promise<Appointment>;
}

export function useAppointments(options: UseAppointmentsOptions = {}): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (options.status) params.set('status', options.status);
      if (options.startDate) params.set('start_date', options.startDate);
      if (options.endDate) params.set('end_date', options.endDate);
      if (options.limit) params.set('limit', options.limit.toString());
      
      const response = await fetch(`/api/appointments?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data.data || []);
      setTotal(data.data?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [options.status, options.startDate, options.endDate, options.limit]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }
    
    const result = await response.json();
    await fetchAppointments();
    return result.data;
  };

  const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update appointment');
    }
    
    const result = await response.json();
    await fetchAppointments();
    return result.data;
  };

  const cancelAppointment = async (id: string, reason?: string): Promise<void> => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled', cancellation_reason: reason }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel appointment');
    }
    
    await fetchAppointments();
  };

  const rescheduleAppointment = async (
    id: string,
    newStartTime: string,
    newEndTime: string
  ): Promise<Appointment> => {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        start_time: newStartTime, 
        end_time: newEndTime,
        status: 'scheduled',
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reschedule appointment');
    }
    
    const result = await response.json();
    await fetchAppointments();
    return result.data;
  };

  return {
    appointments,
    loading,
    error,
    total,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
  };
}

// Get available slots
export function useAvailableSlots(eventTypeId: string, date: string) {
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!eventTypeId || !date) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          event_type_id: eventTypeId,
          date,
        });
        
        const response = await fetch(`/api/appointments/availability/slots?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch slots');
        }
        
        const data = await response.json();
        setSlots(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [eventTypeId, date]);

  return { slots, loading, error };
}

// Event types hook
export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/event-types');
        if (!response.ok) throw new Error('Failed to fetch event types');
        const data = await response.json();
        setEventTypes(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, []);

  return { eventTypes, loading, error };
}
