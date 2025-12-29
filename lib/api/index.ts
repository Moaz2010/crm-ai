/**
 * CRM API Service Layer
 * Centralized client for all API interactions
 */

import { 
  Lead, LeadFilters, CreateLeadInput,
  Contact, ContactFilters, CreateContactInput,
  Deal, DealFilters, CreateDealInput,
  Company, CompanyFilters, CreateCompanyInput,
  Task, TaskFilters, CreateTaskInput,
  Note, CreateNoteInput,
  Tag, CreateTagInput,
  Appointment, AppointmentFilters, CreateAppointmentInput,
  EventType, CreateEventTypeInput,
  Activity
} from '@/types';

// Base API helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const json = await response.json();

    if (!response.ok) {
      return { data: null, error: json.error || 'Request failed' };
    }

    return { data: json.data || json, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ================== LEADS API ==================

export const leadsApi = {
  list: (filters?: LeadFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.source) params.append('source', filters.source);
    if (filters?.minScore) params.append('minScore', filters.minScore.toString());
    if (filters?.isEnriched !== undefined) params.append('isEnriched', filters.isEnriched.toString());
    if (filters?.search) params.append('search', filters.search);
    return apiRequest<Lead[]>(`/leads?${params}`);
  },

  get: (id: string) => apiRequest<Lead>(`/leads/${id}`),

  create: (data: CreateLeadInput) =>
    apiRequest<Lead>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Lead>) =>
    apiRequest<Lead>(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/leads/${id}`, { method: 'DELETE' }),

  // Bulk operations
  import: (leads: CreateLeadInput[], options?: { skipDuplicates?: boolean }) =>
    apiRequest<{ imported: number; skipped: number; errors: any[] }>('/leads/import', {
      method: 'POST',
      body: JSON.stringify({ leads, ...options }),
    }),

  export: (filters?: LeadFilters, format: 'csv' | 'json' = 'csv') => {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters?.status) params.append('status', filters.status);
    return `/api/leads/export?${params}`;
  },

  bulk: (operation: 'delete' | 'update' | 'tag' | 'enrich', leadIds: string[], data?: any) =>
    apiRequest<{ processed: number; errors: any[] }>('/leads/bulk', {
      method: 'POST',
      body: JSON.stringify({ operation, leadIds, ...data }),
    }),

  dedupe: (strategy: 'email' | 'name_company' | 'phone' = 'email') =>
    apiRequest<{ duplicates: Lead[][] }>(`/leads/dedupe?strategy=${strategy}`),

  mergeDuplicates: (duplicateGroups: string[][], strategy: 'keep_first' | 'keep_latest' | 'merge') =>
    apiRequest<{ merged: number }>('/leads/dedupe', {
      method: 'POST',
      body: JSON.stringify({ action: 'merge', duplicateGroups, strategy }),
    }),

  search: (query: string, filters?: LeadFilters) => {
    const params = new URLSearchParams({ q: query });
    if (filters?.status) params.append('status', filters.status);
    return apiRequest<Lead[]>(`/leads/search?${params}`);
  },

  enrich: (id: string) =>
    apiRequest<Lead>('/leads/enrich', {
      method: 'POST',
      body: JSON.stringify({ leadId: id }),
    }),

  autoTag: (id: string) =>
    apiRequest<{ tags: string[] }>(`/leads/${id}/auto-tag`, { method: 'POST' }),

  getTags: (id: string) => apiRequest<Tag[]>(`/leads/${id}/tags`),

  addTags: (id: string, tagIds: string[]) =>
    apiRequest<void>(`/leads/${id}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tagIds }),
    }),

  removeTags: (id: string, tagIds: string[]) =>
    apiRequest<void>(`/leads/${id}/tags`, {
      method: 'DELETE',
      body: JSON.stringify({ tagIds }),
    }),

  parse: (url: string) =>
    apiRequest<Lead>('/leads/parse', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),

  score: (id: string) =>
    apiRequest<{ score: number; breakdown: any }>('/leads/score', {
      method: 'POST',
      body: JSON.stringify({ leadId: id }),
    }),
};

// ================== CONTACTS API ==================

export const contactsApi = {
  list: (filters?: ContactFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.lifecycleStage) params.append('lifecycleStage', filters.lifecycleStage);
    if (filters?.companyId) params.append('companyId', filters.companyId);
    return apiRequest<Contact[]>(`/contacts?${params}`);
  },

  get: (id: string) => apiRequest<Contact>(`/contacts/${id}`),

  create: (data: CreateContactInput) =>
    apiRequest<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Contact>) =>
    apiRequest<Contact>(`/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/contacts/${id}`, { method: 'DELETE' }),
};

// ================== COMPANIES API ==================

export const companiesApi = {
  list: (filters?: CompanyFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.industry) params.append('industry', filters.industry);
    return apiRequest<Company[]>(`/companies?${params}`);
  },

  get: (id: string) => apiRequest<Company>(`/companies/${id}`),

  create: (data: CreateCompanyInput) =>
    apiRequest<Company>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Company>) =>
    apiRequest<Company>(`/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/companies/${id}`, { method: 'DELETE' }),
};

// ================== DEALS API ==================

export const dealsApi = {
  list: (filters?: DealFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.stageId) params.append('stageId', filters.stageId);
    return apiRequest<Deal[]>(`/deals?${params}`);
  },

  get: (id: string) => apiRequest<Deal>(`/deals/${id}`),

  create: (data: CreateDealInput) =>
    apiRequest<Deal>('/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Deal>) =>
    apiRequest<Deal>(`/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/deals/${id}`, { method: 'DELETE' }),

  getStages: () => apiRequest<any[]>('/pipeline/stages'),

  createStage: (data: { name: string; color?: string; probability?: number }) =>
    apiRequest<any>('/pipeline/stages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ================== APPOINTMENTS API ==================

export const appointmentsApi = {
  list: (filters?: AppointmentFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    return apiRequest<Appointment[]>(`/appointments?${params}`);
  },

  get: (id: string) => apiRequest<Appointment>(`/appointments/${id}`),

  create: (data: CreateAppointmentInput) =>
    apiRequest<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Appointment>) =>
    apiRequest<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/appointments/${id}`, { method: 'DELETE' }),

  cancel: (id: string, reason?: string) =>
    apiRequest<void>(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  reschedule: (id: string, startTime: string, endTime: string) =>
    apiRequest<Appointment>(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ startTime, endTime }),
    }),

  // Public booking
  book: (data: {
    eventTypeId: string;
    startTime: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone?: string;
    attendeeNotes?: string;
    timezone?: string;
  }) =>
    apiRequest<Appointment>('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Availability
  getAvailability: () => apiRequest<any[]>('/appointments/availability'),

  setAvailability: (slots: { dayOfWeek: number; startTime: string; endTime: string; isEnabled: boolean }[]) =>
    apiRequest<void>('/appointments/availability', {
      method: 'POST',
      body: JSON.stringify({ slots }),
    }),

  getAvailableSlots: (eventTypeId: string, date: string, timezone?: string) => {
    const params = new URLSearchParams({
      eventTypeId,
      date,
      ...(timezone && { timezone }),
    });
    return apiRequest<{ slots: string[] }>(`/appointments/availability/slots?${params}`);
  },
};

// ================== EVENT TYPES API ==================

export const eventTypesApi = {
  list: () => apiRequest<EventType[]>('/appointments/event-types'),

  get: (id: string) => apiRequest<EventType>(`/appointments/event-types/${id}`),

  create: (data: CreateEventTypeInput) =>
    apiRequest<EventType>('/appointments/event-types', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<EventType>) =>
    apiRequest<EventType>(`/appointments/event-types/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/appointments/event-types/${id}`, { method: 'DELETE' }),
};

// ================== TASKS API ==================

export const tasksApi = {
  list: (filters?: TaskFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    return apiRequest<Task[]>(`/tasks?${params}`);
  },

  get: (id: string) => apiRequest<Task>(`/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Task>) =>
    apiRequest<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/tasks/${id}`, { method: 'DELETE' }),

  complete: (id: string) =>
    apiRequest<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed', completedAt: new Date().toISOString() }),
    }),
};

// ================== NOTES API ==================

export const notesApi = {
  list: (entityType?: 'lead' | 'contact' | 'deal', entityId?: string) => {
    const params = new URLSearchParams();
    if (entityType && entityId) {
      params.append(`${entityType}Id`, entityId);
    }
    return apiRequest<Note[]>(`/notes?${params}`);
  },

  get: (id: string) => apiRequest<Note>(`/notes/${id}`),

  create: (data: CreateNoteInput) =>
    apiRequest<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, content: string) =>
    apiRequest<Note>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/notes/${id}`, { method: 'DELETE' }),
};

// ================== TAGS API ==================

export const tagsApi = {
  list: () => apiRequest<Tag[]>('/tags'),

  get: (id: string) => apiRequest<Tag>(`/tags/${id}`),

  create: (data: CreateTagInput) =>
    apiRequest<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Tag>) =>
    apiRequest<Tag>(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/tags/${id}`, { method: 'DELETE' }),
};

// ================== ACTIVITIES API ==================

export const activitiesApi = {
  list: (entityType?: 'lead' | 'contact' | 'deal', entityId?: string, limit: number = 20) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (entityType && entityId) {
      params.append(`${entityType}Id`, entityId);
    }
    return apiRequest<Activity[]>(`/activities?${params}`);
  },

  create: (data: Partial<Activity>) =>
    apiRequest<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ================== SCRAPE API ==================

export const scrapeApi = {
  create: (targetUrl: string, platform: string = 'linkedin') =>
    apiRequest<{ job: any; lead: Lead }>('/scrape', {
      method: 'POST',
      body: JSON.stringify({ targetUrl, platform }),
    }),

  list: (status?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return apiRequest<any[]>(`/scrape?${params}`);
  },
};

// ================== EXPORT ALL ==================

export const api = {
  leads: leadsApi,
  contacts: contactsApi,
  companies: companiesApi,
  deals: dealsApi,
  appointments: appointmentsApi,
  eventTypes: eventTypesApi,
  tasks: tasksApi,
  notes: notesApi,
  tags: tagsApi,
  activities: activitiesApi,
  scrape: scrapeApi,
};

export default api;
