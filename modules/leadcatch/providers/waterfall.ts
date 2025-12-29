/**
 * Waterfall Enrichment Orchestrator
 * Tries multiple sources in priority order with intelligent merging
 */

import { enrichWithApollo } from './apollo';
import { enrichWithClearbit } from './clearbit';
import { findEmailWithHunter } from './hunter';
import { findEmailWithSnov, enrichPersonWithSnov } from './snovio';
import { findEmail as findEmailPattern, getDomainFromCompany } from './emailFinder';

export interface LeadInput {
  id?: string;
  email?: string;
  linkedin_url?: string;
  linkedinUrl?: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  company?: string;
  job_title?: string;
  jobTitle?: string;
}

export interface EnrichedData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  company?: string;
  location?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  industry?: string;
  company_size?: string;
  enrichment_sources: string;
  is_enriched: boolean;
}

/**
 * Normalize lead data to handle both snake_case (from DB) and camelCase (from API) inputs
 */
function normalizeLead(lead: LeadInput): {
  id?: string;
  email?: string;
  linkedin_url?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  job_title?: string;
} {
  return {
    id: lead.id,
    email: lead.email,
    linkedin_url: lead.linkedin_url || lead.linkedinUrl,
    first_name: lead.first_name || lead.firstName,
    last_name: lead.last_name || lead.lastName,
    company: lead.company,
    job_title: lead.job_title || lead.jobTitle
  };
}

/**
 * Intelligent data merging
 * Prefers existing data over new data (first source wins)
 */
function mergeData(existing: Record<string, any>, newData: Record<string, any>): Record<string, any> {
  const merged = { ...existing };

  Object.keys(newData).forEach(key => {
    // Only use new data if the field is empty/null
    if (!merged[key] || merged[key] === 'Unknown' || merged[key] === '') {
      merged[key] = newData[key];
    }
  });

  return merged;
}

/**
 * Enrich lead using waterfall strategy
 * Priority: Apollo → Clearbit → Hunter → Snov.io → Pattern Generator
 */
export async function waterfallEnrichment(
  leadInput: LeadInput,
  options?: {
    skipSources?: string[];
    maxSources?: number;
  }
): Promise<EnrichedData> {
  const lead = normalizeLead(leadInput);
  const skipSources = options?.skipSources || [];
  const maxSources = options?.maxSources || 5;

  console.log(`💧 Starting waterfall enrichment for lead ID: ${lead.id || 'new'}`);

  let enrichedData: Record<string, any> = {};
  const sources: string[] = [];

  // Try Apollo first
  if (!skipSources.includes('apollo') && sources.length < maxSources) {
    if (lead.linkedin_url || lead.email) {
      const apolloData = await enrichWithApollo({ linkedinUrl: lead.linkedin_url, email: lead.email });
      if (apolloData) {
        enrichedData = { ...enrichedData, ...apolloData };
        sources.push('apollo');
        console.log('✅ Apollo enrichment successful');
      }
    }
  }

  // If we still have missing fields, try Clearbit
  if (!skipSources.includes('clearbit') && sources.length < maxSources) {
    if (lead.email && (!enrichedData.phone || !enrichedData.company)) {
      const clearbitData = await enrichWithClearbit(lead.email);
      if (clearbitData) {
        enrichedData = mergeData(enrichedData, clearbitData);
        sources.push('clearbit');
        console.log('✅ Clearbit enrichment successful');
      }
    }
  }

  // Try to find email if missing
  if (!enrichedData.email && lead.first_name && lead.last_name) {
    const domain = lead.company ? getDomainFromCompany(lead.company) : null;
    
    if (domain) {
      // Try Hunter first
      if (!skipSources.includes('hunter') && sources.length < maxSources) {
        const hunterResult = await findEmailWithHunter(lead.first_name, lead.last_name, domain);
        if (hunterResult) {
          enrichedData.email = hunterResult.email;
          enrichedData.email_confidence = hunterResult.confidence;
          sources.push('hunter');
          console.log('✅ Hunter email found');
        }
      }

      // Try Snov.io if Hunter didn't find email
      if (!enrichedData.email && !skipSources.includes('snovio') && sources.length < maxSources) {
        const snovResult = await findEmailWithSnov(lead.first_name, lead.last_name, domain);
        if (snovResult) {
          enrichedData.email = snovResult.email;
          enrichedData.email_confidence = snovResult.confidence;
          sources.push('snovio');
          console.log('✅ Snov.io email found');
        }
      }

      // Fallback to pattern generation
      if (!enrichedData.email && !skipSources.includes('pattern')) {
        const patternResult = await findEmailPattern(lead.first_name, lead.last_name, domain);
        if (patternResult) {
          enrichedData.email = patternResult.email;
          enrichedData.email_confidence = patternResult.confidence;
          enrichedData.email_alternatives = patternResult.alternatives;
          sources.push('pattern');
          console.log('✅ Email pattern generated');
        }
      }
    }
  }

  // If we have email now but missing other data, try Snov.io person enrichment
  if (enrichedData.email && (!enrichedData.job_title || !enrichedData.company)) {
    if (!skipSources.includes('snovio') && !sources.includes('snovio') && sources.length < maxSources) {
      const snovPersonData = await enrichPersonWithSnov(enrichedData.email);
      if (snovPersonData) {
        enrichedData = mergeData(enrichedData, snovPersonData);
        if (!sources.includes('snovio')) sources.push('snovio');
        console.log('✅ Snov.io person enrichment successful');
      }
    }
  }

  return {
    first_name: enrichedData.first_name || lead.first_name,
    last_name: enrichedData.last_name || lead.last_name,
    email: enrichedData.email || lead.email,
    phone: enrichedData.phone,
    job_title: enrichedData.job_title || lead.job_title,
    company: enrichedData.company || lead.company,
    location: enrichedData.location,
    linkedin_url: enrichedData.linkedin_url || lead.linkedin_url,
    twitter_handle: enrichedData.twitter_handle,
    industry: enrichedData.industry,
    company_size: enrichedData.company_size,
    enrichment_sources: sources.join(', '),
    is_enriched: sources.length > 0
  };
}

/**
 * Batch enrich multiple leads
 */
export async function batchWaterfallEnrichment(
  leads: LeadInput[],
  options?: {
    concurrency?: number;
    skipSources?: string[];
  }
): Promise<EnrichedData[]> {
  const concurrency = options?.concurrency || 3;
  const results: EnrichedData[] = [];

  // Process in batches
  for (let i = 0; i < leads.length; i += concurrency) {
    const batch = leads.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(lead => waterfallEnrichment(lead, options))
    );
    results.push(...batchResults);
    
    // Add delay between batches to respect rate limits
    if (i + concurrency < leads.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// Export with both names for backwards compatibility
export { waterfallEnrichment as enrichWithWaterfall };
