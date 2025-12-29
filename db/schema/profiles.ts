import { pgTable, uuid, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Profiles Table - Extends Supabase Auth
 */
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  companyName: text('company_name'),
  phone: text('phone'),
  timezone: text('timezone').default('UTC'),
  
  // Subscription & Billing
  subscriptionTier: text('subscription_tier').default('free'), // free, starter, pro, agency
  subscriptionStatus: text('subscription_status').default('active'),
  stripeCustomerId: text('stripe_customer_id'),
  
  // Settings
  notificationPreferences: jsonb('notification_preferences').default({}),
  
  // Booking Page Settings
  bookingSlug: text('booking_slug').unique(),
  bookingPageEnabled: boolean('booking_page_enabled').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
