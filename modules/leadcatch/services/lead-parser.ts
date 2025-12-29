/**
 * Lead Parser Service
 * Parse lead data from various sources using AI
 */

import { createClient } from '@/lib/supabase/server';
import { aiClient } from '@/modules/ai/client';
import type { LeadEnrichmentResult } from '@/types';

/**
 * Parse LinkedIn profile URL and extract lead data
 */
export async function parseLinkedInProfile(url: string): Promise<LeadEnrichmentResult> {
  // Validate LinkedIn URL
  if (!url.includes('linkedin.com')) {
    throw new Error('Invalid LinkedIn URL');
  }

  try {
    // Use AI to parse the profile
    const response = await aiClient.chat({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting structured data from LinkedIn profiles.
Extract all available information and return it in JSON format.`
        },
        {
          role: 'user',
          content: `Parse this LinkedIn profile URL and extract lead information: ${url}

Return JSON with these fields:
{
  "firstName": "string or null",
  "lastName": "string or null",
  "jobTitle": "string or null",
  "company": "string or null",
  "location": "string or null",
  "aiSummary": "Brief professional summary",
  "leadScore": number (0-100)
}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(content);
    return {
      ...parsed,
      enrichmentSources: 'ai'
    };
  } catch (error) {
    console.error('LinkedIn parsing error:', error);
    throw new Error('Failed to parse LinkedIn profile');
  }
}

/**
 * Parse website URL and extract company/person data
 */
export async function parseWebsite(url: string): Promise<LeadEnrichmentResult> {
  try {
    const response = await aiClient.chat({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting business and contact information from websites.
Look for contact pages, about pages, and any visible contact information.`
        },
        {
          role: 'user',
          content: `Analyze this website and extract any lead/company information: ${url}

Return JSON with:
{
  "firstName": "string or null",
  "lastName": "string or null",
  "email": "string or null (only if clearly visible)",
  "phone": "string or null",
  "company": "company name",
  "companyIndustry": "string or null",
  "companySize": "string or null",
  "aiSummary": "Brief description of the business",
  "leadScore": number (0-100 based on potential)
}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(content);
    return {
      ...parsed,
      enrichmentSources: 'ai'
    };
  } catch (error) {
    console.error('Website parsing error:', error);
    throw new Error('Failed to parse website');
  }
}

/**
 * Parse free-form text (email signatures, business cards, etc.)
 */
export async function parseText(text: string): Promise<LeadEnrichmentResult> {
  if (!text || text.trim().length < 10) {
    throw new Error('Text too short to parse');
  }

  try {
    const response = await aiClient.chat({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting contact information from unstructured text.
This could be email signatures, business cards, LinkedIn messages, or any text containing contact details.
Extract only information that is clearly present - do not guess or make up data.`
        },
        {
          role: 'user',
          content: `Parse the following text and extract any lead information:

"""
${text}
"""

Return JSON with:
{
  "firstName": "string or null",
  "lastName": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "jobTitle": "string or null",
  "company": "string or null",
  "location": "string or null",
  "linkedinUrl": "string or null",
  "website": "string or null",
  "aiSummary": "Brief note about this lead",
  "leadScore": number (0-100)
}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const parsed = JSON.parse(content);
    return {
      ...parsed,
      enrichmentSources: 'ai'
    };
  } catch (error) {
    console.error('Text parsing error:', error);
    throw new Error('Failed to parse text');
  }
}

/**
 * Main parser function - automatically detects input type
 */
export async function parseLead(input: {
  url?: string;
  text?: string;
}): Promise<LeadEnrichmentResult> {
  const { url, text } = input;

  if (url) {
    if (url.includes('linkedin.com')) {
      return parseLinkedInProfile(url);
    } else {
      return parseWebsite(url);
    }
  }

  if (text) {
    return parseText(text);
  }

  throw new Error('No input provided. Please provide a URL or text.');
}
