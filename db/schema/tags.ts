import { pgTable, uuid, text, timestamp, primaryKey, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { leads } from './leads';
import { contacts } from './contacts';
import { deals } from './deals';

/**
 * Tags Table - Flexible categorization
 */
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  name: text('name').notNull(),
  color: text('color').default('#6366f1'),
  category: text('category'), // lead, contact, deal - or null for universal
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('tags_user_id_idx').on(table.userId),
  nameIdx: index('tags_name_idx').on(table.name),
}));

/**
 * Lead Tags - Junction table
 */
export const leadTags = pgTable('lead_tags', {
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.leadId, table.tagId] }),
}));

/**
 * Contact Tags - Junction table
 */
export const contactTags = pgTable('contact_tags', {
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.contactId, table.tagId] }),
}));

/**
 * Deal Tags - Junction table
 */
export const dealTags = pgTable('deal_tags', {
  dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.dealId, table.tagId] }),
}));

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
