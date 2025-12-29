/**
 * Appointment Detail API Routes
 * GET /api/appointments/[id] - Get single appointment
 * PUT /api/appointments/[id] - Update appointment
 * DELETE /api/appointments/[id] - Delete appointment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/appointments/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        *,
        event_type:event_types(*),
        contact:contacts(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/appointments/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        title: body.title,
        description: body.description,
        start_time: body.startTime,
        end_time: body.endTime,
        location_type: body.locationType,
        location_value: body.locationValue,
        meeting_link: body.meetingLink,
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Appointment update error:', error);
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Appointment deletion error:', error);
      return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
