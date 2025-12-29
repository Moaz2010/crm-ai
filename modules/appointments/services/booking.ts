/**
 * Booking Service
 * Handle appointment creation, updates, and cancellations
 */

import { createClient } from '@/lib/supabase/server';
import type { Appointment, BookingRequest, EventType } from '@/types';
import { isSlotAvailable, getAvailableSlots } from './availability';
import { sendBookingConfirmation, sendCancellationEmail } from '../notifications/email';
import { syncToGoogleCalendar } from '../integrations/google-calendar';

export interface BookingResult {
  success: boolean;
  appointment?: Appointment;
  error?: string;
}

/**
 * Create a new booking
 */
export async function createBooking(
  userId: string,
  request: BookingRequest
): Promise<BookingResult> {
  const supabase = await createClient();
  
  try {
    // 1. Get event type
    const { data: eventType, error: eventTypeError } = await supabase
      .from('event_types')
      .select('*')
      .eq('id', request.eventTypeId)
      .single();
    
    if (eventTypeError || !eventType) {
      return { success: false, error: 'Event type not found' };
    }
    
    if (!eventType.is_active) {
      return { success: false, error: 'Event type is not active' };
    }
    
    // 2. Get user's availability rules
    const { data: availabilityRules } = await supabase
      .from('availability')
      .select('*')
      .eq('user_id', eventType.user_id);
    
    // 3. Get existing appointments
    const startTime = new Date(request.startTime);
    const endTime = new Date(startTime.getTime() + eventType.duration * 60 * 1000);
    
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', eventType.user_id)
      .gte('start_time', new Date(startTime.getTime() - 24 * 60 * 60 * 1000).toISOString())
      .lte('start_time', new Date(startTime.getTime() + 24 * 60 * 60 * 1000).toISOString())
      .neq('status', 'cancelled');
    
    // 4. Check availability
    const available = isSlotAvailable(startTime, endTime, {
      timezone: request.timezone,
      rules: availabilityRules || [],
      appointments: existingAppointments || [],
      eventType: eventType as unknown as EventType,
    });
    
    if (!available) {
      return { success: false, error: 'Selected time slot is not available' };
    }
    
    // 5. Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        user_id: eventType.user_id,
        event_type_id: request.eventTypeId,
        title: eventType.name,
        description: eventType.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        timezone: request.timezone,
        location_type: eventType.location_type,
        location_value: eventType.location_value,
        attendee_name: request.attendeeName,
        attendee_email: request.attendeeEmail,
        attendee_phone: request.attendeePhone,
        attendee_notes: request.notes,
        custom_responses: request.customResponses,
        status: eventType.requires_confirmation ? 'pending' : 'scheduled',
      })
      .select()
      .single();
    
    if (appointmentError || !appointment) {
      return { success: false, error: 'Failed to create appointment' };
    }
    
    // 6. Generate meeting link (if video)
    if (eventType.location_type === 'video') {
      // Could integrate with Zoom, Google Meet, etc.
      const meetingLink = `https://meet.yourcrm.com/${appointment.id}`;
      await supabase
        .from('appointments')
        .update({ meeting_link: meetingLink })
        .eq('id', appointment.id);
      
      appointment.meeting_link = meetingLink;
    }
    
    // 7. Sync to external calendar
    try {
      await syncToGoogleCalendar(eventType.user_id, appointment);
    } catch (error) {
      console.warn('Calendar sync failed:', error);
    }
    
    // 8. Send confirmation email
    try {
      await sendBookingConfirmation(appointment, eventType);
    } catch (error) {
      console.warn('Email notification failed:', error);
    }
    
    // 9. Log activity
    await supabase.from('activities').insert({
      user_id: eventType.user_id,
      type: 'meeting',
      title: `New booking: ${eventType.name}`,
      description: `${request.attendeeName} booked a ${eventType.duration}-minute meeting`,
      metadata: { appointmentId: appointment.id },
      occurred_at: new Date().toISOString(),
    });
    
    return {
      success: true,
      appointment: appointment as unknown as Appointment,
    };
  } catch (error) {
    console.error('Booking creation error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Reschedule an existing appointment
 */
export async function rescheduleAppointment(
  appointmentId: string,
  newStartTime: string,
  timezone: string
): Promise<BookingResult> {
  const supabase = await createClient();
  
  try {
    // 1. Get existing appointment
    const { data: existing, error: existingError } = await supabase
      .from('appointments')
      .select('*, event_types(*)')
      .eq('id', appointmentId)
      .single();
    
    if (existingError || !existing) {
      return { success: false, error: 'Appointment not found' };
    }
    
    // 2. Check new slot availability
    const eventType = existing.event_types;
    const startTime = new Date(newStartTime);
    const endTime = new Date(startTime.getTime() + eventType.duration * 60 * 1000);
    
    const { data: availabilityRules } = await supabase
      .from('availability')
      .select('*')
      .eq('user_id', existing.user_id);
    
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', existing.user_id)
      .neq('id', appointmentId)
      .neq('status', 'cancelled');
    
    const available = isSlotAvailable(startTime, endTime, {
      timezone,
      rules: availabilityRules || [],
      appointments: existingAppointments || [],
      eventType,
    });
    
    if (!available) {
      return { success: false, error: 'Selected time slot is not available' };
    }
    
    // 3. Update appointment
    const { data: updated, error: updateError } = await supabase
      .from('appointments')
      .update({
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        timezone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();
    
    if (updateError) {
      return { success: false, error: 'Failed to reschedule appointment' };
    }
    
    // 4. Update external calendar
    // 5. Send notification emails
    
    return {
      success: true,
      appointment: updated as unknown as Appointment,
    };
  } catch (error) {
    console.error('Reschedule error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  appointmentId: string,
  reason?: string
): Promise<BookingResult> {
  const supabase = await createClient();
  
  try {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancel_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select()
      .single();
    
    if (error || !appointment) {
      return { success: false, error: 'Failed to cancel appointment' };
    }
    
    // Send cancellation email
    try {
      await sendCancellationEmail(appointment);
    } catch (e) {
      console.warn('Cancellation email failed:', e);
    }
    
    return {
      success: true,
      appointment: appointment as unknown as Appointment,
    };
  } catch (error) {
    console.error('Cancellation error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Mark appointment as completed
 */
export async function completeAppointment(
  appointmentId: string
): Promise<BookingResult> {
  const supabase = await createClient();
  
  const { data: appointment, error } = await supabase
    .from('appointments')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select()
    .single();
  
  if (error || !appointment) {
    return { success: false, error: 'Failed to complete appointment' };
  }
  
  return {
    success: true,
    appointment: appointment as unknown as Appointment,
  };
}

/**
 * Mark appointment as no-show
 */
export async function markNoShow(
  appointmentId: string
): Promise<BookingResult> {
  const supabase = await createClient();
  
  const { data: appointment, error } = await supabase
    .from('appointments')
    .update({
      status: 'no_show',
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .select()
    .single();
  
  if (error || !appointment) {
    return { success: false, error: 'Failed to update appointment' };
  }
  
  return {
    success: true,
    appointment: appointment as unknown as Appointment,
  };
}
