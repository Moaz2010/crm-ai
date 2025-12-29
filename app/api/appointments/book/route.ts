/**
 * Public Booking API
 * POST /api/appointments/book - Create booking (public)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createBooking } from '@/modules/appointments/services/booking';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const {
      eventTypeId,
      startTime,
      timezone,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      notes,
      customResponses,
    } = body;
    
    // Validate required fields
    if (!eventTypeId || !startTime || !attendeeName || !attendeeEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: eventTypeId, startTime, attendeeName, attendeeEmail' },
        { status: 400 }
      );
    }
    
    // Get event type to find user
    const { data: eventType, error: eventTypeError } = await supabase
      .from('event_types')
      .select('user_id')
      .eq('id', eventTypeId)
      .single();
    
    if (eventTypeError || !eventType) {
      return NextResponse.json({ error: 'Event type not found' }, { status: 404 });
    }
    
    // Create booking
    const result = await createBooking(eventType.user_id, {
      eventTypeId,
      startTime,
      timezone: timezone || 'UTC',
      attendeeName,
      attendeeEmail,
      attendeePhone,
      notes,
      customResponses,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create booking' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      data: result.appointment,
      message: 'Booking created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
