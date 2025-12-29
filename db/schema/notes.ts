import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { leads } from './leads';
import { contacts } from './contacts';
import { deals } from './deals';

/**
 * Notes Table - Rich text notes attached to entities
 */
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Content
  content: text('content').notNull(),
  contentHtml: text('content_html'), // Rich text version
  
  // Relationships (polymorphic)
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'cascade' }),
  dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
  
  // Pinned notes appear at top
  isPinned: text('is_pinned').default('false'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('notes_user_id_idx').on(table.userId),
  leadIdIdx: index('notes_lead_id_idx').on(table.leadId),
  contactIdIdx: index('notes_contact_id_idx').on(table.contactId),
}));

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
