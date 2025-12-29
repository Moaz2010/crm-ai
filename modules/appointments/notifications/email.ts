/**
 * Email Notifications for Appointments
 * Send booking confirmations, reminders, and cancellations
 */

import type { Appointment, EventType } from '@/types';

// Using Resend for email delivery
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@yourcrm.com';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using Resend
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, email not sent');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

/**
 * Send booking confirmation to attendee
 */
export async function sendBookingConfirmation(
  appointment: any,
  eventType: any
): Promise<boolean> {
  if (!appointment.attendee_email) {
    return false;
  }

  const startTime = new Date(appointment.start_time);
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .detail { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; }
        .label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
        .value { font-size: 16px; font-weight: 600; color: #111827; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🎉 Booking Confirmed!</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Your meeting has been scheduled</p>
        </div>
        <div class="content">
          <p>Hi ${appointment.attendee_name},</p>
          <p>Your <strong>${eventType.name}</strong> meeting has been confirmed!</p>
          
          <div class="detail">
            <div class="label">📅 Date & Time</div>
            <div class="value">${formattedDate} at ${formattedTime}</div>
          </div>
          
          <div class="detail">
            <div class="label">⏱️ Duration</div>
            <div class="value">${eventType.duration} minutes</div>
          </div>
          
          ${appointment.meeting_link ? `
          <div class="detail">
            <div class="label">🔗 Meeting Link</div>
            <div class="value"><a href="${appointment.meeting_link}">${appointment.meeting_link}</a></div>
          </div>
          ` : ''}
          
          ${appointment.location_value ? `
          <div class="detail">
            <div class="label">📍 Location</div>
            <div class="value">${appointment.location_value}</div>
          </div>
          ` : ''}
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments/${appointment.id}" class="button">
            View Booking Details
          </a>
        </div>
        <div class="footer">
          <p>Need to make changes? You can reschedule or cancel your booking from the link above.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: appointment.attendee_email,
    subject: `✅ Confirmed: ${eventType.name} - ${formattedDate}`,
    html,
  });
}

/**
 * Send reminder before appointment
 */
export async function sendReminder(
  appointment: any,
  eventType: any,
  minutesBefore: number
): Promise<boolean> {
  if (!appointment.attendee_email) {
    return false;
  }

  const startTime = new Date(appointment.start_time);
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="alert">
          <h2 style="margin: 0 0 10px;">⏰ Reminder: Meeting Starting Soon</h2>
          <p>Your <strong>${eventType.name}</strong> meeting starts in ${minutesBefore} minutes at ${formattedTime}.</p>
        </div>
        
        ${appointment.meeting_link ? `
        <a href="${appointment.meeting_link}" class="button">
          Join Meeting
        </a>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: appointment.attendee_email,
    subject: `⏰ Reminder: ${eventType.name} in ${minutesBefore} minutes`,
    html,
  });
}

/**
 * Send cancellation notification
 */
export async function sendCancellationEmail(
  appointment: any
): Promise<boolean> {
  if (!appointment.attendee_email) {
    return false;
  }

  const startTime = new Date(appointment.start_time);
  const formattedDate = startTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #fee2e2; color: #991b1b; padding: 30px; border-radius: 12px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">❌ Meeting Cancelled</h1>
          <p style="margin: 10px 0 0;">${appointment.title} on ${formattedDate}</p>
        </div>
        
        <div style="padding: 30px; text-align: center;">
          <p>Hi ${appointment.attendee_name},</p>
          <p>Unfortunately, your meeting has been cancelled.</p>
          
          ${appointment.cancel_reason ? `
          <p><strong>Reason:</strong> ${appointment.cancel_reason}</p>
          ` : ''}
          
          <p style="color: #6b7280;">If you'd like to reschedule, please book a new time.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: appointment.attendee_email,
    subject: `❌ Cancelled: ${appointment.title} on ${formattedDate}`,
    html,
  });
}

/**
 * Send rescheduled notification
 */
export async function sendRescheduledEmail(
  appointment: any,
  oldTime: Date
): Promise<boolean> {
  if (!appointment.attendee_email) {
    return false;
  }

  const newTime = new Date(appointment.start_time);
  const formattedNewDate = newTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedNewTime = newTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dbeafe; color: #1e40af; padding: 30px; border-radius: 12px; text-align: center; }
        .detail { margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📅 Meeting Rescheduled</h1>
          <p style="margin: 10px 0 0;">${appointment.title}</p>
        </div>
        
        <div style="padding: 30px;">
          <p>Hi ${appointment.attendee_name},</p>
          <p>Your meeting has been rescheduled to a new time:</p>
          
          <div class="detail">
            <strong>New Date:</strong> ${formattedNewDate}<br>
            <strong>New Time:</strong> ${formattedNewTime}
          </div>
          
          ${appointment.meeting_link ? `
          <p><strong>Meeting Link:</strong> <a href="${appointment.meeting_link}">${appointment.meeting_link}</a></p>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: appointment.attendee_email,
    subject: `📅 Rescheduled: ${appointment.title} - ${formattedNewDate}`,
    html,
  });
}
