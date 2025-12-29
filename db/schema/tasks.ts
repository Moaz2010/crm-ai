import { pgTable, uuid, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { leads } from './leads';
import { contacts } from './contacts';
import { deals } from './deals';

/**
 * Tasks Table - To-dos and reminders
 */
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Task Info
  title: text('title').notNull(),
  description: text('description'),
  
  // Type & Priority
  type: text('type').default('task'), // task, call, email, meeting, follow_up
  priority: text('priority').default('medium'), // low, medium, high, urgent
  
  // Due Date
  dueDate: timestamp('due_date', { withTimezone: true }),
  reminderAt: timestamp('reminder_at', { withTimezone: true }),
  
  // Status
  status: text('status').default('pending'), // pending, in_progress, completed, cancelled
  completedAt: timestamp('completed_at', { withTimezone: true }),
  
  // Relationships (polymorphic - can be linked to different entities)
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'cascade' }),
  dealId: uuid('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
  
  // Assignment
  assignedToId: uuid('assigned_to_id').references(() => profiles.id),
  
  // Recurrence
  isRecurring: boolean('is_recurring').default(false),
  recurrenceRule: text('recurrence_rule'), // RRULE format
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('tasks_user_id_idx').on(table.userId),
  statusIdx: index('tasks_status_idx').on(table.status),
  dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
}));

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
