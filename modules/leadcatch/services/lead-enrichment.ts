/**
 * Lead Enrichment Service
 * Waterfall enrichment using multiple providers
 */

import type { Lead, LeadEnrichmentResult } from '@/types';
import { enrichWithApollo } from '../providers/apollo';
import { enrichWithClearbit } from '../providers/clearbit';
import { aiClient } from '@/modules/ai/client';

interface EnrichmentOptions {
  useApollo?: boolean;
  useClearbit?: boolean;
  useAI?: boolean;
}

const DEFAULT_OPTIONS: EnrichmentOptions = {
  useApollo: true,
  useClearbit: true,
  useAI: true,
};

/**
 * Waterfall enrichment - try multiple sources in priority order
 */
export async function enrichLead(
  lead: Partial<Lead>,
  options: EnrichmentOptions = DEFAULT_OPTIONS
): Promise<LeadEnrichmentResult> {
  console.log(`🔄 Starting waterfall enrichment for: ${lead.email || lead.linkedinUrl || 'Unknown'}`);
  
  let enrichedData: Partial<LeadEnrichmentResult> = {};
  const sources: string[] = [];

  // Step 1: Try Apollo (best for LinkedIn-based data)
  if (options.useApollo && (lead.linkedinUrl || lead.email)) {
    try {
      const apolloData = await enrichWithApollo({
        linkedinUrl: lead.linkedinUrl,
        email: lead.email,
      });
      
      if (apolloData) {
        enrichedData = mergeEnrichmentData(enrichedData, apolloData);
        sources.push('apollo');
        console.log('✅ Apollo enrichment successful');
      }
    } catch (error) {
      console.log('⚠️ Apollo enrichment failed, continuing...');
    }
  }

  // Step 2: Try Clearbit (best for email-based company data)
  if (options.useClearbit && lead.email && (!enrichedData.company || !enrichedData.phone)) {
    try {
      const clearbitData = await enrichWithClearbit(lead.email);
      
      if (clearbitData) {
        enrichedData = mergeEnrichmentData(enrichedData, clearbitData);
        sources.push('clearbit');
        console.log('✅ Clearbit enrichment successful');
      }
    } catch (error) {
      console.log('⚠️ Clearbit enrichment failed, continuing...');
    }
  }

  // Step 3: AI enrichment as fallback
  if (options.useAI && (!enrichedData.firstName || !enrichedData.aiSummary)) {
    try {
      const aiData = await enrichWithAI(lead, enrichedData);
      enrichedData = mergeEnrichmentData(enrichedData, aiData);
      sources.push('ai');
      console.log('✅ AI enrichment successful');
    } catch (error) {
      console.log('⚠️ AI enrichment failed');
    }
  }

  // Calculate final lead score if not already set
  if (!enrichedData.leadScore) {
    enrichedData.leadScore = calculateLeadScore(enrichedData);
  }

  return {
    ...enrichedData,
    enrichmentSources: sources.join(', '),
  } as LeadEnrichmentResult;
}

/**
 * AI-based enrichment for missing fields
 */
async function enrichWithAI(
  lead: Partial<Lead>,
  existingData: Partial<LeadEnrichmentResult>
): Promise<Partial<LeadEnrichmentResult>> {
  const context = `
Lead Information:
- Name: ${lead.firstName || existingData.firstName || ''} ${lead.lastName || existingData.lastName || ''}
- Email: ${lead.email || ''}
- Company: ${lead.company || existingData.company || ''}
- Job Title: ${lead.jobTitle || existingData.jobTitle || ''}
- LinkedIn: ${lead.linkedinUrl || ''}
`;

  try {
    const response = await aiClient.chat({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing business leads and providing insights.
Generate a professional summary and score based on the available information.`
        },
        {
          role: 'user',
          content: `Analyze this lead and provide enrichment:

${context}

Return JSON with:
{
  "aiSummary": "2-3 sentence professional summary about why this lead is valuable",
  "leadScore": number (0-100 based on: profile completeness, seniority, company type),
  "companyIndustry": "best guess at industry if not provided",
  "estimatedRevenue": "company revenue estimate if inferable"
}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : {};
  } catch (error) {
    console.error('AI enrichment error:', error);
    return {};
  }
}

/**
 * Merge enrichment data - prefer existing values
 */
function mergeEnrichmentData(
  existing: Partial<LeadEnrichmentResult>,
  newData: Partial<LeadEnrichmentResult>
): Partial<LeadEnrichmentResult> {
  const merged = { ...existing };

  Object.entries(newData).forEach(([key, value]) => {
    const typedKey = key as keyof LeadEnrichmentResult;
    if (!merged[typedKey] || merged[typedKey] === 'Unknown' || merged[typedKey] === '') {
      (merged as any)[typedKey] = value;
    }
  });

  return merged;
}

/**
 * Calculate lead score based on available data
 */
function calculateLeadScore(data: Partial<LeadEnrichmentResult>): number {
  let score = 0;
  
  // Profile completeness (30 points)
  if (data.firstName) score += 5;
  if (data.lastName) score += 5;
  if (data.email) score += 10;
  if (data.phone) score += 5;
  if (data.jobTitle) score += 5;
  
  // Professional relevance (30 points)
  if (data.company) score += 10;
  if (data.companyIndustry) score += 10;
  if (data.companySize) score += 10;
  
  // Seniority indicators (20 points)
  const seniorTitles = ['ceo', 'cto', 'cfo', 'founder', 'director', 'vp', 'head', 'chief', 'president'];
  const title = (data.jobTitle || '').toLowerCase();
  if (seniorTitles.some(t => title.includes(t))) {
    score += 20;
  } else if (title.includes('manager') || title.includes('lead')) {
    score += 10;
  }
  
  // Contact quality (20 points)
  if (data.email?.includes('@') && !data.email.includes('gmail') && !data.email.includes('yahoo')) {
    score += 10; // Business email
  }
  if (data.phone) score += 10;
  
  return Math.min(100, score);
}

/**
 * Batch enrichment for multiple leads
 */
export async function batchEnrichLeads(
  leads: Partial<Lead>[],
  options?: EnrichmentOptions
): Promise<LeadEnrichmentResult[]> {
  console.log(`📦 Starting batch enrichment for ${leads.length} leads`);
  
  const results: LeadEnrichmentResult[] = [];
  
  // Process in batches of 5 to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(lead => enrichLead(lead, options))
    );
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < leads.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Batch enrichment complete: ${results.length} leads processed`);
  return results;
}
