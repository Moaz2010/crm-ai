import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { companies } from './companies';

/**
 * Contacts Table - CRM Core Entity
 */
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
  
  // Personal Info
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  mobilePhone: text('mobile_phone'),
  
  // Professional Info
  jobTitle: text('job_title'),
  department: text('department'),
  
  // Address
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  postalCode: text('postal_code'),
  
  // Social
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  
  // Status
  status: text('status').default('active'), // active, inactive, bounced
  lifecycleStage: text('lifecycle_stage').default('subscriber'), // subscriber, lead, opportunity, customer, evangelist
  
  // Ownership
  ownerId: uuid('owner_id').references(() => profiles.id),
  
  // Source
  source: text('source'), // website, referral, outbound, etc.
  sourceLeadId: uuid('source_lead_id'), // link to original lead
  
  // Engagement
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
  lastEmailAt: timestamp('last_email_at', { withTimezone: true }),
  lastMeetingAt: timestamp('last_meeting_at', { withTimezone: true }),
  
  // Custom Fields
  customFields: jsonb('custom_fields').default({}),
  
  // Avatar
  avatarUrl: text('avatar_url'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('contacts_user_id_idx').on(table.userId),
  emailIdx: index('contacts_email_idx').on(table.email),
  companyIdIdx: index('contacts_company_id_idx').on(table.companyId),
}));

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
