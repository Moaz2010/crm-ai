import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { profiles } from './profiles';

/**
 * Leads Table - Core LeadCatch Entity
 */
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  
  // Core Lead Info
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  jobTitle: text('job_title'),
  company: text('company'),
  location: text('location'),
  website: text('website'),
  
  // Social Profiles
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  
  // Scraping/Source Data
  sourcePlatform: text('source_platform').default('manual'), // linkedin, website, manual, csv, api
  sourceUrl: text('source_url'),
  
  // Enrichment & AI Status
  isEnriched: boolean('is_enriched').default(false),
  enrichmentSources: text('enrichment_sources'), // apollo, clearbit, ai
  aiSummary: text('ai_summary'),
  leadScore: integer('lead_score').default(0), // 0-100
  
  // Company Enrichment Data
  companySize: text('company_size'),
  companyIndustry: text('company_industry'),
  companyLinkedin: text('company_linkedin'),
  companyWebsite: text('company_website'),
  companyDescription: text('company_description'),
  estimatedRevenue: text('estimated_revenue'),
  
  // Lead Status & Stage
  status: text('status').default('new'), // new, contacted, qualified, unqualified, converted
  
  // Custom Fields (JSON for flexibility)
  customFields: jsonb('custom_fields').default({}),
  
  // Metadata
  lastContactedAt: timestamp('last_contacted_at', { withTimezone: true }),
  convertedAt: timestamp('converted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('leads_user_id_idx').on(table.userId),
  emailIdx: index('leads_email_idx').on(table.email),
  statusIdx: index('leads_status_idx').on(table.status),
  scoreIdx: index('leads_score_idx').on(table.leadScore),
}));

/**
 * Scrape Jobs Table - Track async scraping tasks
 */
export const scrapeJobs = pgTable('scrape_jobs', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  targetUrl: text('target_url').notNull(),
  platform: text('platform').default('linkedin'),
  status: text('status').default('pending'), // pending, processing, completed, failed
  resultLeadId: uuid('result_lead_id').references(() => leads.id),
  errorLog: text('error_log'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type ScrapeJob = typeof scrapeJobs.$inferSelect;
export type NewScrapeJob = typeof scrapeJobs.$inferInsert;
