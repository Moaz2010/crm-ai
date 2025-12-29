import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, time, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { contacts } from './contacts';

/**
 * Event Types - Define different meeting types (like Calendly)
 */
export const eventTypes = pgTable('event_types', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Basic Info
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  duration: integer('duration').notNull().default(30), // minutes
  
  // Location
  locationType: text('location_type').default('video'), // video, phone, in_person
  locationValue: text('location_value'), // Zoom link, phone number, address
  
  // Availability
  bufferBefore: integer('buffer_before').default(0), // minutes
  bufferAfter: integer('buffer_after').default(0), // minutes
  minNotice: integer('min_notice').default(60), // minutes before booking
  maxDaysAhead: integer('max_days_ahead').default(60), // days
  
  // Customization
  color: text('color').default('#6366f1'),
  requiresConfirmation: boolean('requires_confirmation').default(false),
  
  // Custom Questions
  customQuestions: jsonb('custom_questions').default([]),
  
  // Pricing (optional)
  isPaid: boolean('is_paid').default(false),
  price: integer('price').default(0), // in cents
  currency: text('currency').default('USD'),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('event_types_user_id_idx').on(table.userId),
  slugIdx: index('event_types_slug_idx').on(table.slug),
}));

/**
 * Availability - Weekly schedule
 */
export const availability = pgTable('availability', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Day of week (0 = Sunday, 6 = Saturday)
  dayOfWeek: integer('day_of_week').notNull(),
  
  // Time slots
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  
  isEnabled: boolean('is_enabled').default(true),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Date Overrides - Specific date exceptions
 */
export const dateOverrides = pgTable('date_overrides', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  date: timestamp('date', { withTimezone: true }).notNull(),
  isBlocked: boolean('is_blocked').default(false), // true = day off, false = custom hours
  
  // Custom hours for this day (null if blocked)
  slots: jsonb('slots').default([]), // [{start: "09:00", end: "17:00"}]
  
  reason: text('reason'), // vacation, holiday, etc.
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Appointments - Booked meetings
 */
export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  eventTypeId: uuid('event_type_id').references(() => eventTypes.id, { onDelete: 'set null' }),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
  
  // Booking Info
  title: text('title').notNull(),
  description: text('description'),
  
  // Time
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  timezone: text('timezone').default('UTC'),
  
  // Location
  locationType: text('location_type').default('video'),
  locationValue: text('location_value'),
  meetingLink: text('meeting_link'),
  
  // Attendee Info (for public bookings)
  attendeeName: text('attendee_name'),
  attendeeEmail: text('attendee_email'),
  attendeePhone: text('attendee_phone'),
  attendeeNotes: text('attendee_notes'),
  customResponses: jsonb('custom_responses').default({}),
  
  // Status
  status: text('status').default('scheduled'), // scheduled, confirmed, cancelled, completed, no_show
  cancelReason: text('cancel_reason'),
  
  // Calendar Sync
  googleEventId: text('google_event_id'),
  outlookEventId: text('outlook_event_id'),
  
  // Payment
  isPaid: boolean('is_paid').default(false),
  paymentStatus: text('payment_status'), // pending, completed, refunded
  paymentId: text('payment_id'),
  
  // Reminders
  remindersSent: jsonb('reminders_sent').default([]),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('appointments_user_id_idx').on(table.userId),
  startTimeIdx: index('appointments_start_time_idx').on(table.startTime),
  statusIdx: index('appointments_status_idx').on(table.status),
}));

/**
 * Calendar Connections - OAuth tokens for Google/Outlook
 */
export const calendarConnections = pgTable('calendar_connections', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  provider: text('provider').notNull(), // google, outlook
  email: text('email').notNull(),
  
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiry: timestamp('token_expiry', { withTimezone: true }),
  
  isPrimary: boolean('is_primary').default(false),
  syncEnabled: boolean('sync_enabled').default(true),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type EventType = typeof eventTypes.$inferSelect;
export type NewEventType = typeof eventTypes.$inferInsert;
export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;
export type DateOverride = typeof dateOverrides.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type CalendarConnection = typeof calendarConnections.$inferSelect;
