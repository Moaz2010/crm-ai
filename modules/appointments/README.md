# Appointments Module

**Owner:** Anas Salem

## Purpose
This module handles all appointment scheduling functionality including:
- Calendar sync (Google/Outlook)
- Availability management
- Booking creation and management
- Time slot calculation
- Email/SMS notifications
- AI scheduling assistant

## Folder Structure

### `services/`
Core business logic for scheduling.

**Files to create:**
- `availability.ts` - Availability calculation
- `slot-calculator.ts` - Calculate available time slots
- `booking.ts` - Booking creation/management
- `calendar-sync.ts` - Calendar sync orchestrator
- `conflict-detector.ts` - Detect scheduling conflicts
- `reschedule.ts` - Reschedule logic
- `cancellation.ts` - Cancellation logic
- `reminder-scheduler.ts` - Schedule email/SMS reminders

### `integrations/`
External calendar API integrations.

**Files to create:**
- `google-calendar.ts` - Google Calendar API wrapper
- `outlook-calendar.ts` - Outlook API wrapper
- `calendar-provider.ts` - Abstract calendar interface

### `notifications/`
Email and SMS notification system.

**Files to create:**
- `email-sender.ts` - Send booking emails
- `sms-sender.ts` - Send SMS reminders

**Templates:**
- `templates/confirmation.ts` - Confirmation email template
- `templates/reminder.ts` - Reminder email template
- `templates/cancellation.ts` - Cancellation email template

### `validators/`
Zod schemas for validation.

**Files to create:**
- `booking-schema.ts` - Booking validation
- `availability-schema.ts` - Availability validation

### `utils/`
Helper functions.

**Files to create:**
- `timezone.ts` - Timezone conversion
- `date-helpers.ts` - Date utilities
- `buffer-calculator.ts` - Calculate time buffers

### `types.ts`
TypeScript interfaces and types for appointments.

## Example Usage

```typescript
import { calculateAvailableSlots } from '@/modules/appointments/services/slot-calculator';
import { createBooking } from '@/modules/appointments/services/booking';

// Get available slots
const slots = await calculateAvailableSlots({
  userId,
  eventTypeId,
  startDate,
  endDate,
  timezone: 'America/New_York'
});

// Create booking
const booking = await createBooking({
  eventTypeId,
  attendeeEmail,
  startTime,
  endTime
});
```

## API Endpoints

- `GET /api/appointments` - List appointments
- `POST /api/appointments/book` - Create booking
- `GET /api/availability/slots` - Get available slots
- `PATCH /api/appointments/[id]/reschedule` - Reschedule
- `DELETE /api/appointments/[id]/cancel` - Cancel
- `POST /api/calendar/google/auth` - Google OAuth
- `POST /api/calendar/outlook/auth` - Outlook OAuth

## Testing

```bash
pnpm test modules/appointments
```

## Dependencies

- Google Calendar API
- Microsoft Graph API (Outlook)
- Resend/SendGrid (Email)
- Twilio (SMS)
- Drizzle ORM
