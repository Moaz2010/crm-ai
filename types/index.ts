/**
 * TypeScript Types for the CRM Platform
 * Centralized type definitions for all modules
 */

// ================== LEAD TYPES ==================

export interface Lead {
  id: string;
  userId: string;
  
  // Personal Info
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  location: string | null;
  website: string | null;
  
  // Social
  linkedinUrl: string | null;
  twitterUrl: string | null;
  
  // Source
  sourcePlatform: 'linkedin' | 'website' | 'manual' | 'csv' | 'api';
  sourceUrl: string | null;
  
  // Enrichment
  isEnriched: boolean;
  enrichmentSources: string | null;
  aiSummary: string | null;
  leadScore: number;
  
  // Company Enrichment
  companySize: string | null;
  companyIndustry: string | null;
  companyLinkedin: string | null;
  companyWebsite: string | null;
  companyDescription: string | null;
  estimatedRevenue: string | null;
  
  // Status
  status: LeadStatus;
  customFields: Record<string, any>;
  
  // Timestamps
  lastContactedAt: string | null;
  convertedAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  tags?: Tag[];
  notes?: Note[];
  activities?: Activity[];
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export interface CreateLeadInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  linkedinUrl?: string;
  sourcePlatform?: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: string;
  minScore?: number;
  maxScore?: number;
  isEnriched?: boolean;
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface LeadEnrichmentResult {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  companySize?: string;
  companyIndustry?: string;
  aiSummary?: string;
  leadScore?: number;
  enrichmentSources: string;
}

// ================== APPOINTMENT TYPES ==================

export interface EventType {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  locationType: 'video' | 'phone' | 'in_person';
  locationValue: string | null;
  bufferBefore: number;
  bufferAfter: number;
  minNotice: number;
  maxDaysAhead: number;
  color: string;
  requiresConfirmation: boolean;
  customQuestions: CustomQuestion[];
  isPaid: boolean;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  eventTypeId: string | null;
  contactId: string | null;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  locationType: string;
  locationValue: string | null;
  meetingLink: string | null;
  attendeeName: string | null;
  attendeeEmail: string | null;
  attendeePhone: string | null;
  attendeeNotes: string | null;
  customResponses: Record<string, any>;
  status: AppointmentStatus;
  cancelReason: string | null;
  googleEventId: string | null;
  outlookEventId: string | null;
  isPaid: boolean;
  paymentStatus: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  eventType?: EventType;
  contact?: Contact;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface AvailabilityRule {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
}

export interface BookingRequest {
  eventTypeId: string;
  startTime: string;
  timezone: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  notes?: string;
  customResponses?: Record<string, any>;
}

// ================== CONTACT TYPES ==================

export interface Contact {
  id: string;
  userId: string;
  companyId: string | null;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  mobilePhone: string | null;
  jobTitle: string | null;
  department: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  status: 'active' | 'inactive' | 'bounced';
  lifecycleStage: LifecycleStage;
  ownerId: string | null;
  source: string | null;
  sourceLeadId: string | null;
  lastActivityAt: string | null;
  avatarUrl: string | null;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  company?: Company;
  tags?: Tag[];
  activities?: Activity[];
  deals?: Deal[];
}

export type LifecycleStage = 'subscriber' | 'lead' | 'opportunity' | 'customer' | 'evangelist';

// ================== COMPANY TYPES ==================

export interface Company {
  id: string;
  userId: string;
  name: string;
  domain: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  employeeCount: string | null;
  annualRevenue: string | null;
  type: 'prospect' | 'customer' | 'partner' | 'vendor' | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  logoUrl: string | null;
  techStack: string[];
  foundedYear: number | null;
  ownerId: string | null;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  contacts?: Contact[];
  deals?: Deal[];
}

// ================== DEAL TYPES ==================

export interface Deal {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  value: number;
  currency: string;
  stageId: string | null;
  stageName: string;
  probability: number;
  expectedCloseDate: string | null;
  contactId: string | null;
  companyId: string | null;
  ownerId: string | null;
  status: 'open' | 'won' | 'lost';
  lostReason: string | null;
  wonAt: string | null;
  lostAt: string | null;
  source: string | null;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  contact?: Contact;
  company?: Company;
  stage?: PipelineStage;
  tags?: Tag[];
  activities?: Activity[];
}

export interface PipelineStage {
  id: string;
  userId: string;
  name: string;
  color: string;
  order: number;
  probability: number;
  createdAt: string;
}

// ================== TASK TYPES ==================

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string | null;
  reminderAt: string | null;
  status: TaskStatus;
  completedAt: string | null;
  leadId: string | null;
  contactId: string | null;
  dealId: string | null;
  assignedToId: string | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  lead?: Lead;
  contact?: Contact;
  deal?: Deal;
  assignedTo?: Profile;
}

export type TaskType = 'task' | 'call' | 'email' | 'meeting' | 'follow_up';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// ================== ACTIVITY TYPES ==================

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  subtype: string | null;
  title: string;
  description: string | null;
  metadata: Record<string, any>;
  leadId: string | null;
  contactId: string | null;
  dealId: string | null;
  performedById: string | null;
  occurredAt: string;
  createdAt: string;
}

export type ActivityType = 
  | 'email'
  | 'call'
  | 'meeting'
  | 'note'
  | 'task_completed'
  | 'deal_updated'
  | 'deal_won'
  | 'deal_lost'
  | 'lead_created'
  | 'lead_enriched'
  | 'contact_created'
  | 'stage_changed';

// ================== NOTE TYPES ==================

export interface Note {
  id: string;
  userId: string;
  content: string;
  contentHtml: string | null;
  leadId: string | null;
  contactId: string | null;
  dealId: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ================== TAG TYPES ==================

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
  category: 'lead' | 'contact' | 'deal' | null;
  createdAt: string;
}

// ================== PROFILE TYPES ==================

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  companyName: string | null;
  phone: string | null;
  timezone: string;
  subscriptionTier: 'free' | 'starter' | 'pro' | 'agency';
  subscriptionStatus: string;
  bookingSlug: string | null;
  bookingPageEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  emailNewLead: boolean;
  emailNewBooking: boolean;
  emailDealUpdates: boolean;
  emailTaskReminders: boolean;
  browserNotifications: boolean;
}

// ================== AI TYPES ==================

export interface AIEnrichmentRequest {
  leadId?: string;
  linkedinUrl?: string;
  email?: string;
  text?: string;
}

export interface AIScoreRequest {
  leadId: string;
  criteria?: string[];
}

export interface AIMessageRequest {
  type: 'email' | 'linkedin' | 'follow_up';
  context: {
    leadName?: string;
    company?: string;
    purpose?: string;
    tone?: 'professional' | 'casual' | 'formal';
  };
}

export interface AIInsightsResponse {
  summary: string;
  recommendations: string[];
  nextBestAction: string;
  predictedOutcome: string;
  confidence: number;
}

// ================== API RESPONSE TYPES ==================

export interface ApiResponse<T> {
  data: T;
  error: null;
  message?: string;
}

export interface ApiErrorResponse {
  data: null;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ================== DASHBOARD TYPES ==================

export interface DashboardStats {
  totalLeads: number;
  newLeadsThisWeek: number;
  leadsGrowth: number;
  
  totalAppointments: number;
  upcomingAppointments: number;
  appointmentsThisWeek: number;
  
  totalDeals: number;
  pipelineValue: number;
  wonThisMonth: number;
  
  conversionRate: number;
  averageDealValue: number;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  entity: {
    type: 'lead' | 'contact' | 'deal';
    id: string;
    name: string;
  };
}

// ================== INPUT TYPES ==================

export interface CreateContactInput {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  lifecycleStage?: LifecycleStage;
  source?: string;
}

export interface ContactFilters {
  search?: string;
  lifecycleStage?: LifecycleStage;
  companyId?: string;
  status?: string;
}

export interface CreateCompanyInput {
  name: string;
  domain?: string;
  website?: string;
  industry?: string;
  employeeCount?: string;
  type?: string;
}

export interface CompanyFilters {
  search?: string;
  industry?: string;
  type?: string;
}

export interface CreateDealInput {
  name: string;
  description?: string;
  value?: number;
  stageId?: string;
  contactId?: string;
  companyId?: string;
  expectedCloseDate?: string;
}

export interface DealFilters {
  status?: string;
  stageId?: string;
  contactId?: string;
  companyId?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  type?: TaskType;
  priority?: TaskPriority;
  dueDate?: string;
  leadId?: string;
  contactId?: string;
  dealId?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  leadId?: string;
  contactId?: string;
  dealId?: string;
}

export interface CreateNoteInput {
  content: string;
  leadId?: string;
  contactId?: string;
  dealId?: string;
  isPinned?: boolean;
}

export interface CreateTagInput {
  name: string;
  color?: string;
  category?: 'lead' | 'contact' | 'deal';
}

export interface CreateAppointmentInput {
  title: string;
  eventTypeId?: string;
  contactId?: string;
  startTime: string;
  endTime: string;
  description?: string;
  locationType?: string;
  locationValue?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  eventTypeId?: string;
}

export interface CreateEventTypeInput {
  name: string;
  slug: string;
  description?: string;
  duration: number;
  locationType?: string;
  locationValue?: string;
  color?: string;
}
