import { pgTable, uuid, text, timestamp, integer, numeric, jsonb, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { contacts } from './contacts';
import { companies } from './companies';

/**
 * Pipeline Stages - Customizable sales stages
 */
export const pipelineStages = pgTable('pipeline_stages', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  name: text('name').notNull(),
  color: text('color').default('#6366f1'),
  order: integer('order').notNull(),
  probability: integer('probability').default(0), // 0-100 win probability
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Deals Table - Sales Pipeline
 */
export const deals = pgTable('deals', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Basic Info
  name: text('name').notNull(),
  description: text('description'),
  
  // Value
  value: numeric('value', { precision: 15, scale: 2 }).default('0'),
  currency: text('currency').default('USD'),
  
  // Pipeline Position
  stageId: uuid('stage_id').references(() => pipelineStages.id, { onDelete: 'set null' }),
  stageName: text('stage_name').default('New'), // Denormalized for quick access
  
  // Win Probability (AI-calculated or manual)
  probability: integer('probability').default(0),
  expectedCloseDate: timestamp('expected_close_date', { withTimezone: true }),
  
  // Relationships
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
  
  // Ownership
  ownerId: uuid('owner_id').references(() => profiles.id),
  
  // Status
  status: text('status').default('open'), // open, won, lost
  lostReason: text('lost_reason'),
  wonAt: timestamp('won_at', { withTimezone: true }),
  lostAt: timestamp('lost_at', { withTimezone: true }),
  
  // Source
  source: text('source'),
  sourceLeadId: uuid('source_lead_id'),
  
  // Custom Fields
  customFields: jsonb('custom_fields').default({}),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('deals_user_id_idx').on(table.userId),
  stageIdx: index('deals_stage_id_idx').on(table.stageId),
  statusIdx: index('deals_status_idx').on(table.status),
  contactIdx: index('deals_contact_id_idx').on(table.contactId),
}));

export type PipelineStage = typeof pipelineStages.$inferSelect;
export type NewPipelineStage = typeof pipelineStages.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
