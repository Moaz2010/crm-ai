/**
 * Cancel Appointment API
 * POST /api/appointments/[id]/cancel
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
    
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Cancelled by user';
    
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
      return NextResponse.json({ error: 'Appointment is already cancelled' }, { status: 400 });
    }
    
    // Update appointment status
    const { data: updated, error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Cancel appointment error:', updateError);
      return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
    }
    
    // TODO: Send cancellation email to attendee
    // await sendCancellationEmail(appointment.attendee_email, appointment);
    
    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: updated,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
