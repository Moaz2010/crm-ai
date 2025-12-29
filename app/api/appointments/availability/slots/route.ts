/**
 * Availability API
 * GET /api/appointments/availability/slots - Get available slots
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAvailableSlots, getDefaultAvailability } from '@/modules/appointments/services/availability';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const searchParams = request.nextUrl.searchParams;
    const eventTypeId = searchParams.get('eventTypeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const timezone = searchParams.get('timezone') || 'UTC';
    
    if (!eventTypeId) {
      return NextResponse.json(
        { error: 'eventTypeId is required' },
        { status: 400 }
      );
    }
    
    // Get event type
    const { data: eventType, error: eventTypeError } = await supabase
      .from('event_types')
      .select('*')
      .eq('id', eventTypeId)
      .single();
    
    if (eventTypeError || !eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }
    
    // Get availability rules
    const { data: availabilityRules } = await supabase
      .from('availability')
      .select('*')
      .eq('user_id', eventType.user_id)
      .eq('is_enabled', true);
    
    const rules = availabilityRules?.length
      ? availabilityRules
      : getDefaultAvailability(eventType.user_id);
    
    // Get date overrides
    const { data: dateOverrides } = await supabase
      .from('date_overrides')
      .select('*')
      .eq('user_id', eventType.user_id);
    
    // Get existing appointments
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + eventType.max_days_ahead * 24 * 60 * 60 * 1000);
    
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', eventType.user_id)
      .gte('start_time', start.toISOString())
      .lte('start_time', end.toISOString())
      .neq('status', 'cancelled');
    
    // Calculate slots
    const slots = getAvailableSlots(start, end, {
      timezone,
      rules: rules as any,
      dateOverrides: dateOverrides as any,
      appointments: appointments as any,
      eventType: eventType as any,
    });
    
    // Filter to only available slots
    const availableSlots = slots.filter(s => s.available);
    
    return NextResponse.json({ data: availableSlots });
  } catch (error) {
    console.error('Availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
