/**
 * Event Types API Routes
 * GET /api/appointments/event-types - List event types
 * POST /api/appointments/event-types - Create event type
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/appointments/event-types
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: eventTypes, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Event types fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch event types' }, { status: 500 });
    }
    
    return NextResponse.json(eventTypes);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/appointments/event-types
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const { data: eventType, error } = await supabase
      .from('event_types')
      .insert({
        user_id: user.id,
        title: body.title,
        slug,
        description: body.description,
        duration: parseInt(body.duration.replace(' min', '')),
        color: body.color || 'bg-blue-500',
        location_type: body.locationType || 'video',
        is_active: true,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Event type creation error:', error);
      return NextResponse.json({ error: 'Failed to create event type' }, { status: 500 });
    }
    
    return NextResponse.json(eventType, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
