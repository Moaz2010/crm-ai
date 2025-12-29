-- ============================================================================
-- CRM-AI COMPLETE SUPABASE SCHEMA
-- Version: 1.0.0
-- Description: Complete database schema for the CRM-AI platform
-- Includes: Profiles, Leads, Contacts, Companies, Deals, Appointments, Tasks, 
--           Activities, Notes, Tags, and all supporting tables
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Copy this entire file
-- 2. Open Supabase Dashboard > SQL Editor
-- 3. Paste and run the complete script
-- 4. All tables, indexes, RLS policies, and functions will be created
--
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- 1. PROFILES (Extends Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  
  -- Subscription & Billing
  subscription_tier TEXT DEFAULT 'free', -- free, starter, pro, agency
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  
  -- Settings
  notification_preferences JSONB DEFAULT '{}',
  
  -- Booking Page Settings (for appointment scheduling)
  booking_slug TEXT UNIQUE,
  booking_page_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. COMPANIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  domain TEXT,
  website TEXT,
  description TEXT,
  
  -- Industry & Size
  industry TEXT,
  employee_count TEXT, -- 1-10, 11-50, 51-200, 201-500, 500+
  annual_revenue TEXT,
  type TEXT, -- prospect, customer, partner, vendor
  
  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  
  -- Contact Info
  phone TEXT,
  email TEXT,
  
  -- Social
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  
  -- Enriched Data
  logo_url TEXT,
  tech_stack JSONB DEFAULT '[]',
  founded_year INTEGER,
  
  -- Ownership
  owner_id UUID REFERENCES public.profiles(id),
  
  -- Custom Fields
  custom_fields JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. CONTACTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  
  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  mobile_phone TEXT,
  
  -- Professional Info
  job_title TEXT,
  department TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  
  -- Social
  linkedin_url TEXT,
  twitter_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'active', -- active, inactive, bounced
  lifecycle_stage TEXT DEFAULT 'subscriber', -- subscriber, lead, opportunity, customer, evangelist
  
  -- Ownership
  owner_id UUID REFERENCES public.profiles(id),
  
  -- Source
  source TEXT, -- website, referral, outbound, etc.
  source_lead_id UUID, -- Link to original lead if converted
  
  -- Engagement Timestamps
  last_activity_at TIMESTAMP WITH TIME ZONE,
  last_email_at TIMESTAMP WITH TIME ZONE,
  last_meeting_at TIMESTAMP WITH TIME ZONE,
  
  -- Custom Fields
  custom_fields JSONB DEFAULT '{}',
  
  -- Avatar
  avatar_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 4. LEADS (LeadCatch Core Entity)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Core Lead Info
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  job_title TEXT,
  company TEXT,
  location TEXT,
  website TEXT,
  
  -- Social Profiles
  linkedin_url TEXT,
  twitter_url TEXT,
  
  -- Scraping/Source Data
  source_platform TEXT DEFAULT 'manual', -- linkedin, website, manual, csv, api
  source_url TEXT,
  
  -- Enrichment & AI Status
  is_enriched BOOLEAN DEFAULT false,
  enrichment_sources TEXT, -- apollo, clearbit, ai
  ai_summary TEXT,
  lead_score INTEGER DEFAULT 0, -- 0-100
  
  -- Company Enrichment Data
  company_size TEXT,
  company_industry TEXT,
  company_linkedin TEXT,
  company_website TEXT,
  company_description TEXT,
  estimated_revenue TEXT,
  
  -- Lead Status & Stage
  status TEXT DEFAULT 'new', -- new, contacted, qualified, unqualified, converted
  
  -- Custom Fields (JSON for flexibility)
  custom_fields JSONB DEFAULT '{}',
  
  -- Engagement Timestamps
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 5. SCRAPE JOBS (LeadCatch Async Tasks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.scrape_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  target_url TEXT NOT NULL,
  platform TEXT DEFAULT 'linkedin',
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  result_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  error_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 6. PIPELINE STAGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  "order" INTEGER NOT NULL,
  probability INTEGER DEFAULT 0, -- 0-100 win probability
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 7. DEALS (Sales Pipeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  
  -- Value
  value NUMERIC(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  -- Pipeline Position
  stage_id UUID REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  stage_name TEXT DEFAULT 'New', -- Denormalized for quick access
  
  -- Win Probability
  probability INTEGER DEFAULT 0,
  expected_close_date TIMESTAMP WITH TIME ZONE,
  
  -- Relationships
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  
  -- Ownership
  owner_id UUID REFERENCES public.profiles(id),
  
  -- Status
  status TEXT DEFAULT 'open', -- open, won, lost
  lost_reason TEXT,
  won_at TIMESTAMP WITH TIME ZONE,
  lost_at TIMESTAMP WITH TIME ZONE,
  
  -- Source
  source TEXT,
  source_lead_id UUID,
  
  -- Custom Fields
  custom_fields JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 8. EVENT TYPES (Calendly-like meeting types)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 30, -- minutes
  
  -- Location
  location_type TEXT DEFAULT 'video', -- video, phone, in_person
  location_value TEXT, -- Zoom link, phone number, address
  
  -- Availability Settings
  buffer_before INTEGER DEFAULT 0, -- minutes
  buffer_after INTEGER DEFAULT 0, -- minutes
  min_notice INTEGER DEFAULT 60, -- minutes before booking
  max_days_ahead INTEGER DEFAULT 60, -- days
  
  -- Customization
  color TEXT DEFAULT '#6366f1',
  requires_confirmation BOOLEAN DEFAULT false,
  
  -- Custom Questions
  custom_questions JSONB DEFAULT '[]',
  
  -- Pricing (optional)
  is_paid BOOLEAN DEFAULT false,
  price INTEGER DEFAULT 0, -- in cents
  currency TEXT DEFAULT 'USD',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 9. AVAILABILITY (Weekly Schedule)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  is_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 10. DATE OVERRIDES (Specific date exceptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.date_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_blocked BOOLEAN DEFAULT false, -- true = day off, false = custom hours
  slots JSONB DEFAULT '[]', -- [{start: "09:00", end: "17:00"}]
  reason TEXT, -- vacation, holiday, etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 11. APPOINTMENTS (Booked Meetings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_type_id UUID REFERENCES public.event_types(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  
  -- Booking Info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Time
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  
  -- Location
  location_type TEXT DEFAULT 'video',
  location_value TEXT,
  meeting_link TEXT,
  
  -- Attendee Info (for public bookings)
  attendee_name TEXT,
  attendee_email TEXT,
  attendee_phone TEXT,
  attendee_notes TEXT,
  custom_responses JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'scheduled', -- scheduled, confirmed, cancelled, completed, no_show
  cancel_reason TEXT,
  
  -- Calendar Sync
  google_event_id TEXT,
  outlook_event_id TEXT,
  
  -- Payment
  is_paid BOOLEAN DEFAULT false,
  payment_status TEXT, -- pending, completed, refunded
  payment_id TEXT,
  
  -- Reminders
  reminders_sent JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 12. CALENDAR CONNECTIONS (OAuth tokens for Google/Outlook)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.calendar_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  provider TEXT NOT NULL, -- google, outlook
  email TEXT NOT NULL,
  
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  
  is_primary BOOLEAN DEFAULT false,
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 13. TASKS (To-dos and Reminders)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Task Info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Type & Priority
  type TEXT DEFAULT 'task', -- task, call, email, meeting, follow_up
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  
  -- Due Date
  due_date TIMESTAMP WITH TIME ZONE,
  reminder_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Relationships (polymorphic)
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  
  -- Assignment
  assigned_to_id UUID REFERENCES public.profiles(id),
  
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- RRULE format
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 14. ACTIVITIES (Timeline of all interactions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity Type
  type TEXT NOT NULL, -- email, call, meeting, note, task_completed, deal_updated, lead_created, lead_scraped, etc.
  subtype TEXT, -- email_sent, email_received, call_outbound, call_inbound, etc.
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  
  -- Metadata (flexible data based on activity type)
  metadata JSONB DEFAULT '{}',
  
  -- Relationships (polymorphic)
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  
  -- Who performed the activity
  performed_by_id UUID REFERENCES public.profiles(id),
  
  -- When it happened
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 15. NOTES (Rich text notes attached to entities)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Content
  content TEXT NOT NULL,
  content_html TEXT, -- Rich text version
  
  -- Relationships (polymorphic)
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  
  -- Pinned notes appear at top
  is_pinned BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 16. TAGS (Flexible categorization)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  category TEXT, -- lead, contact, deal - or null for universal
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  UNIQUE(user_id, name)
);

-- ============================================================================
-- 17. JUNCTION TABLES (Many-to-Many relationships)
-- ============================================================================

-- Lead Tags
CREATE TABLE IF NOT EXISTS public.lead_tags (
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (lead_id, tag_id)
);

-- Contact Tags
CREATE TABLE IF NOT EXISTS public.contact_tags (
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (contact_id, tag_id)
);

-- Deal Tags
CREATE TABLE IF NOT EXISTS public.deal_tags (
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (deal_id, tag_id)
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.date_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_tags ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Profiles
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public profile access for booking pages
DROP POLICY IF EXISTS "Public can view booking profiles" ON public.profiles;
CREATE POLICY "Public can view booking profiles" ON public.profiles
  FOR SELECT USING (booking_page_enabled = true AND booking_slug IS NOT NULL);

-- ============================================================================
-- RLS POLICIES - Companies
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own companies" ON public.companies;
CREATE POLICY "Users can manage own companies" ON public.companies
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Contacts
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own contacts" ON public.contacts;
CREATE POLICY "Users can manage own contacts" ON public.contacts
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Leads
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Scrape Jobs
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own scrape jobs" ON public.scrape_jobs;
CREATE POLICY "Users can manage own scrape jobs" ON public.scrape_jobs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Pipeline & Deals
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own pipeline stages" ON public.pipeline_stages;
CREATE POLICY "Users can manage own pipeline stages" ON public.pipeline_stages
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own deals" ON public.deals;
CREATE POLICY "Users can manage own deals" ON public.deals
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Appointments & Scheduling
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own event types" ON public.event_types;
CREATE POLICY "Users can manage own event types" ON public.event_types
  FOR ALL USING (auth.uid() = user_id);

-- Public can view active event types for booking
DROP POLICY IF EXISTS "Public can view active event types" ON public.event_types;
CREATE POLICY "Public can view active event types" ON public.event_types
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can manage own availability" ON public.availability;
CREATE POLICY "Users can manage own availability" ON public.availability
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own date overrides" ON public.date_overrides;
CREATE POLICY "Users can manage own date overrides" ON public.date_overrides
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own appointments" ON public.appointments;
CREATE POLICY "Users can manage own appointments" ON public.appointments
  FOR ALL USING (auth.uid() = user_id);

-- Allow public to create appointments (booking page)
DROP POLICY IF EXISTS "Public can create appointments" ON public.appointments;
CREATE POLICY "Public can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own calendar connections" ON public.calendar_connections;
CREATE POLICY "Users can manage own calendar connections" ON public.calendar_connections
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Tasks
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own tasks" ON public.tasks;
CREATE POLICY "Users can manage own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Activities
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own activities" ON public.activities;
CREATE POLICY "Users can manage own activities" ON public.activities
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Notes
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;
CREATE POLICY "Users can view own notes" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notes" ON public.notes;
CREATE POLICY "Users can insert own notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notes" ON public.notes;
CREATE POLICY "Users can update own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notes" ON public.notes;
CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Tags
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own tags" ON public.tags;
CREATE POLICY "Users can manage own tags" ON public.tags
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Junction Tables
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own lead tags" ON public.lead_tags;
CREATE POLICY "Users can manage own lead tags" ON public.lead_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.leads WHERE id = lead_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own contact tags" ON public.contact_tags;
CREATE POLICY "Users can manage own contact tags" ON public.contact_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.contacts WHERE id = contact_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own deal tags" ON public.deal_tags;
CREATE POLICY "Users can manage own deal tags" ON public.deal_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.deals WHERE id = deal_id AND user_id = auth.uid())
  );

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_booking_slug ON public.profiles(booking_slug);

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_domain ON public.companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);

-- Contacts
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON public.contacts(company_id);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_is_enriched ON public.leads(is_enriched);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON public.leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source_platform ON public.leads(source_platform);

-- Composite indexes for filtered queries
CREATE INDEX IF NOT EXISTS idx_leads_user_status ON public.leads(user_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_user_enriched ON public.leads(user_id, is_enriched);
CREATE INDEX IF NOT EXISTS idx_leads_user_score ON public.leads(user_id, lead_score DESC);

-- Full-text search index for leads
CREATE INDEX IF NOT EXISTS idx_leads_search ON public.leads 
  USING gin(to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    COALESCE(email, '') || ' ' || 
    COALESCE(company, '')
  ));

-- Scrape Jobs
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_user_id ON public.scrape_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status ON public.scrape_jobs(status);

-- Pipeline & Deals
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_user_id ON public.pipeline_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON public.deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage_id ON public.deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON public.deals(contact_id);

-- Event Types
CREATE INDEX IF NOT EXISTS idx_event_types_user_id ON public.event_types(user_id);
CREATE INDEX IF NOT EXISTS idx_event_types_slug ON public.event_types(slug);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- Activities
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON public.activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_occurred_at ON public.activities(occurred_at DESC);

-- Notes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_lead_id ON public.notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_notes_contact_id ON public.notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- Tags
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);

-- Junction tables
CREATE INDEX IF NOT EXISTS idx_lead_tags_lead_id ON public.lead_tags(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tags_tag_id ON public.lead_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_contact_tags_contact_id ON public.contact_tags(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_tags_tag_id ON public.contact_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_deal_tags_deal_id ON public.deal_tags(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_tags_tag_id ON public.deal_tags(tag_id);

-- ============================================================================
-- MATERIALIZED VIEW FOR LEAD STATISTICS
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_lead_stats AS
SELECT 
  user_id,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE is_enriched = true) as enriched_leads,
  COUNT(*) FILTER (WHERE status = 'new') as new_leads,
  COUNT(*) FILTER (WHERE status = 'contacted') as contacted_leads,
  COUNT(*) FILTER (WHERE status = 'qualified') as qualified_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_leads,
  ROUND(AVG(lead_score)) as avg_score,
  MAX(created_at) as last_lead_created
FROM leads
GROUP BY user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_lead_stats_user ON mv_lead_stats(user_id);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to refresh lead stats (call periodically via cron)
CREATE OR REPLACE FUNCTION refresh_lead_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_lead_stats;
END;
$$ LANGUAGE plpgsql;

-- Full-text search function for leads
CREATE OR REPLACE FUNCTION search_leads(search_query text, uid uuid)
RETURNS SETOF leads AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM leads
  WHERE user_id = uid
  AND to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    COALESCE(email, '') || ' ' || 
    COALESCE(company, '')
  ) @@ plainto_tsquery('english', search_query)
  ORDER BY lead_score DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- Cursor-based pagination for leads
CREATE OR REPLACE FUNCTION get_leads_paginated(
  uid uuid,
  page_size int DEFAULT 20,
  cursor_id uuid DEFAULT NULL
)
RETURNS SETOF leads AS $$
BEGIN
  IF cursor_id IS NULL THEN
    RETURN QUERY
    SELECT *
    FROM leads
    WHERE user_id = uid
    ORDER BY created_at DESC, id
    LIMIT page_size;
  ELSE
    RETURN QUERY
    SELECT *
    FROM leads
    WHERE user_id = uid
    AND (created_at, id) < (
      SELECT created_at, id FROM leads WHERE id = cursor_id
    )
    ORDER BY created_at DESC, id
    LIMIT page_size;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles', 'companies', 'contacts', 'leads', 'deals', 'event_types', 'appointments', 'calendar_connections', 'tasks', 'notes']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
  END LOOP;
END;
$$;

-- ============================================================================
-- SEED DATA - Default Pipeline Stages (created on first user)
-- ============================================================================
CREATE OR REPLACE FUNCTION create_default_pipeline_stages()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default pipeline stages for new users
  INSERT INTO public.pipeline_stages (user_id, name, color, "order", probability) VALUES
    (NEW.id, 'New', '#6366f1', 1, 10),
    (NEW.id, 'Qualified', '#8b5cf6', 2, 20),
    (NEW.id, 'Proposal', '#a855f7', 3, 40),
    (NEW.id, 'Negotiation', '#d946ef', 4, 60),
    (NEW.id, 'Closed Won', '#22c55e', 5, 100),
    (NEW.id, 'Closed Lost', '#ef4444', 6, 0);
  
  -- Create default availability (Mon-Fri 9am-5pm)
  FOR i IN 1..5 LOOP
    INSERT INTO public.availability (user_id, day_of_week, start_time, end_time)
    VALUES (NEW.id, i, '09:00', '17:00');
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_pipeline_stages();

-- ============================================================================
-- DONE! Your CRM-AI database is ready.
-- ============================================================================
-- 
-- Tables created: 17 main tables + 3 junction tables
-- RLS policies: Applied to all tables for multi-tenant security
-- Indexes: Performance-optimized for common queries
-- Functions: Search, pagination, auto-timestamp updates
-- Triggers: Auto-create profile, default data for new users
--
-- Next steps:
-- 1. Set up your environment variables in .env.local
-- 2. Run your Next.js application
-- 3. Sign up a new user to test the full flow
--
-- ============================================================================
