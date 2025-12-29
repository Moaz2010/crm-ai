/**
 * Availability API
 * GET /api/appointments/availability - Get user's availability schedule
 * POST /api/appointments/availability - Save availability schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/appointments/availability
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: availability, error } = await supabase
      .from('availability_schedules')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Availability fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }
    
    // Return default availability if none exists
    if (!availability) {
      return NextResponse.json({
        Monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        Tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        Wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        Thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
        Friday: { enabled: true, slots: [{ start: "09:00", end: "16:00" }] },
        Saturday: { enabled: false, slots: [] },
        Sunday: { enabled: false, slots: [] },
      });
    }
    
    return NextResponse.json(availability.schedule);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/appointments/availability
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Upsert availability
    const { data, error } = await supabase
      .from('availability_schedules')
      .upsert({
        user_id: user.id,
        schedule: body.availability,
        timezone: body.timezone || 'UTC',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Availability save error:', error);
      return NextResponse.json({ error: 'Failed to save availability' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Availability saved successfully',
      data: data.schedule,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
