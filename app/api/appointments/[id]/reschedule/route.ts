/**
 * Reschedule Appointment API
 * POST /api/appointments/[id]/reschedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: 'New start time and end time are required' },
        { status: 400 }
      );
    }
    
    // Get appointment to check ownership
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    if (appointment.status === 'cancelled') {
      return NextResponse.json({ error: 'Cannot reschedule a cancelled appointment' }, { status: 400 });
    }
    
    // Check if new time slot is available
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('user_id', user.id)
      .neq('id', id)
      .neq('status', 'cancelled')
      .or(`and(start_time.lt.${body.endTime},end_time.gt.${body.startTime})`);
    
    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 409 }
      );
    }
    
    // Update appointment with new times
    const { data: updated, error: updateError } = await supabase
      .from('appointments')
      .update({
        start_time: body.startTime,
        end_time: body.endTime,
        timezone: body.timezone || appointment.timezone,
        rescheduled_from: appointment.start_time,
        rescheduled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Reschedule appointment error:', updateError);
      return NextResponse.json({ error: 'Failed to reschedule appointment' }, { status: 500 });
    }
    
    // TODO: Send reschedule notification email
    // await sendRescheduleEmail(appointment.attendee_email, updated);
    
    return NextResponse.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: updated,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
