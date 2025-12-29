/**
 * Appointments API Routes
 * GET /api/appointments - List appointments
 * POST /api/appointments - Create appointment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, ensureUserProfile } from '@/lib/supabase/server';

// GET /api/appointments
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventTypeId = searchParams.get('eventTypeId');
    
    let query = supabase
      .from('appointments')
      .select(`
        *,
        event_type:event_types(*),
        contact:contacts(*)
      `)
      .eq('user_id', user.id);
    
    if (status) query = query.eq('status', status);
    if (eventTypeId) query = query.eq('event_type_id', eventTypeId);
    if (startDate) query = query.gte('start_time', startDate);
    if (endDate) query = query.lte('start_time', endDate);
    
    query = query.order('start_time', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Appointments fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/appointments (internal - not for public booking)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();

    // Ensure user profile exists (foreign key requirement)
    const profileResult = await ensureUserProfile(supabase, user);
    if (!profileResult.success) {
      return NextResponse.json({ error: 'Failed to verify user profile' }, { status: 500 });
    }
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        event_type_id: body.eventTypeId,
        contact_id: body.contactId,
        title: body.title,
        description: body.description,
        start_time: body.startTime,
        end_time: body.endTime,
        timezone: body.timezone || 'UTC',
        location_type: body.locationType || 'video',
        location_value: body.locationValue,
        meeting_link: body.meetingLink,
        attendee_name: body.attendeeName,
        attendee_email: body.attendeeEmail,
        attendee_phone: body.attendeePhone,
        attendee_notes: body.attendeeNotes,
        status: body.status || 'scheduled',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Appointment creation error:', error);
      return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
    }
    
    return NextResponse.json({ data: appointment }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
