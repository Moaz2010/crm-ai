import { pgTable, uuid, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

/**
 * Companies Table - CRM Core Entity
 */
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Basic Info
  name: text('name').notNull(),
  domain: text('domain'),
  website: text('website'),
  description: text('description'),
  
  // Industry & Size
  industry: text('industry'),
  employeeCount: text('employee_count'), // 1-10, 11-50, 51-200, etc.
  annualRevenue: text('annual_revenue'),
  type: text('type'), // prospect, customer, partner, vendor
  
  // Location
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  postalCode: text('postal_code'),
  
  // Contact Info
  phone: text('phone'),
  email: text('email'),
  
  // Social
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  facebookUrl: text('facebook_url'),
  
  // Enriched Data
  logoUrl: text('logo_url'),
  techStack: jsonb('tech_stack').default([]),
  foundedYear: integer('founded_year'),
  
  // Ownership
  ownerId: uuid('owner_id').references(() => profiles.id),
  
  // Custom Fields
  customFields: jsonb('custom_fields').default({}),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('companies_user_id_idx').on(table.userId),
  domainIdx: index('companies_domain_idx').on(table.domain),
  nameIdx: index('companies_name_idx').on(table.name),
}));

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
