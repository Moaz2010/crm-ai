import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { leads } from './leads';
import { contacts } from './contacts';
import { deals } from './deals';

/**
 * Activities Table - Timeline of all interactions
 */
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Activity Type
  type: text('type').notNull(), // email, call, meeting, note, task_completed, deal_updated, lead_created, etc.
  subtype: text('subtype'), // email_sent, email_received, call_outbound, call_inbound, etc.
  
  // Content
  title: text('title').notNull(),
  description: text('description'),
  
  // Metadata (flexible data based on activity type)
  metadata: jsonb('metadata').default({}),
  
  // Relationships (polymorphic)
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'cascade' }),
  dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
  
  // Who performed the activity
  performedById: uuid('performed_by_id').references(() => profiles.id),
  
  // When it happened
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('activities_user_id_idx').on(table.userId),
  typeIdx: index('activities_type_idx').on(table.type),
  leadIdIdx: index('activities_lead_id_idx').on(table.leadId),
  contactIdIdx: index('activities_contact_id_idx').on(table.contactId),
  occurredAtIdx: index('activities_occurred_at_idx').on(table.occurredAt),
}));

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
