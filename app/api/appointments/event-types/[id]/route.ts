/**
 * Event Type Detail API Routes
 * GET /api/appointments/event-types/[id] - Get event type
 * PUT /api/appointments/event-types/[id] - Update event type
 * DELETE /api/appointments/event-types/[id] - Delete event type
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/appointments/event-types/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: eventType, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }
    
    return NextResponse.json(eventType);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/appointments/event-types/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    const { data: eventType, error } = await supabase
      .from('event_types')
      .update({
        title: body.title,
        description: body.description,
        duration: parseInt(body.duration.replace(' min', '')),
        color: body.color,
        location_type: body.locationType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Event type update error:', error);
      return NextResponse.json({ error: 'Failed to update event type' }, { status: 500 });
    }
    
    return NextResponse.json(eventType);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/appointments/event-types/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('event_types')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Event type deletion error:', error);
      return NextResponse.json({ error: 'Failed to delete event type' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
