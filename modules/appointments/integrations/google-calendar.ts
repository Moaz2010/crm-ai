/**
 * Google Calendar Integration
 * Sync appointments with Google Calendar
 */

import { createClient } from '@/lib/supabase/server';
import type { Appointment } from '@/types';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

/**
 * Generate Google OAuth URL
 */
export function getGoogleAuthUrl(userId: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID || '',
    redirect_uri: GOOGLE_REDIRECT_URI || '',
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: userId,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeGoogleCode(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID || '',
      client_secret: GOOGLE_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_REDIRECT_URI || '',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Google authorization code');
  }

  return response.json();
}

/**
 * Refresh access token
 */
export async function refreshGoogleToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID || '',
      client_secret: GOOGLE_CLIENT_SECRET || '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Google token');
  }

  return response.json();
}

/**
 * Get valid access token (refresh if needed)
 */
async function getValidAccessToken(userId: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data: connection } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'google')
    .single();

  if (!connection) {
    return null;
  }

  // Check if token is expired
  const tokenExpiry = new Date(connection.token_expiry);
  if (tokenExpiry > new Date()) {
    return connection.access_token;
  }

  // Refresh token
  if (connection.refresh_token) {
    try {
      const tokens = await refreshGoogleToken(connection.refresh_token);
      
      // Update stored tokens
      await supabase
        .from('calendar_connections')
        .update({
          access_token: tokens.access_token,
          token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', connection.id);

      return tokens.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  return null;
}

/**
 * Sync appointment to Google Calendar
 */
export async function syncToGoogleCalendar(
  userId: string,
  appointment: any
): Promise<string | null> {
  const accessToken = await getValidAccessToken(userId);
  
  if (!accessToken) {
    console.log('No Google Calendar connection for user');
    return null;
  }

  const event = {
    summary: appointment.title,
    description: appointment.description || '',
    start: {
      dateTime: appointment.start_time,
      timeZone: appointment.timezone || 'UTC',
    },
    end: {
      dateTime: appointment.end_time,
      timeZone: appointment.timezone || 'UTC',
    },
    attendees: appointment.attendee_email
      ? [{ email: appointment.attendee_email, displayName: appointment.attendee_name }]
      : [],
    conferenceData: appointment.meeting_link
      ? {
          createRequest: { requestId: appointment.id },
        }
      : undefined,
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create Google Calendar event');
  }

  const createdEvent = await response.json();
  
  // Update appointment with Google event ID
  const supabase = await createClient();
  await supabase
    .from('appointments')
    .update({ google_event_id: createdEvent.id })
    .eq('id', appointment.id);

  return createdEvent.id;
}

/**
 * Update Google Calendar event
 */
export async function updateGoogleCalendarEvent(
  userId: string,
  appointment: any
): Promise<boolean> {
  if (!appointment.google_event_id) {
    return false;
  }

  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) {
    return false;
  }

  const event = {
    summary: appointment.title,
    description: appointment.description || '',
    start: {
      dateTime: appointment.start_time,
      timeZone: appointment.timezone || 'UTC',
    },
    end: {
      dateTime: appointment.end_time,
      timeZone: appointment.timezone || 'UTC',
    },
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${appointment.google_event_id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  return response.ok;
}

/**
 * Delete Google Calendar event
 */
export async function deleteGoogleCalendarEvent(
  userId: string,
  googleEventId: string
): Promise<boolean> {
  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) {
    return false;
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.ok;
}

/**
 * Get busy times from Google Calendar
 */
export async function getGoogleBusyTimes(
  userId: string,
  timeMin: string,
  timeMax: string
): Promise<{ start: string; end: string }[]> {
  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) {
    return [];
  }

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/freeBusy',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [{ id: 'primary' }],
      }),
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.calendars?.primary?.busy || [];
}
