/**
 * Enhanced Hunter.io Integration
 * Advanced email verification and domain search
 */

const HUNTER_BASE_URL = 'https://api.hunter.io/v2';

export interface HunterEmailResult {
  email: string;
  status: string;
  score: number;
  isDeliverable: boolean;
  source: 'hunter';
}

export interface HunterDomainResult {
  domain: string;
  organization?: string;
  industry?: string;
  emails: Array<{
    email: string;
    firstName?: string;
    lastName?: string;
    position?: string;
    confidence: number;
    department?: string;
  }>;
  linkedinUrl?: string;
  twitterHandle?: string;
  facebookHandle?: string;
  source: 'hunter';
}

export interface HunterEmailFinderResult {
  email: string;
  confidence: 'high' | 'medium' | 'low';
  score: number;
  position?: string;
  twitter?: string;
  linkedin?: string;
  phone?: string;
  source: 'hunter';
}

/**
 * Verify email using Hunter.io
 */
export async function verifyEmailWithHunter(email: string): Promise<HunterEmailResult | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey || !email) return null;

  console.log(`✅ Hunter.io: Verifying email ${email}`);

  try {
    const url = `${HUNTER_BASE_URL}/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return null;
    const data = await response.json();

    if (data.data) {
      return {
        email,
        status: data.data.status,
        score: data.data.score,
        isDeliverable: data.data.status === 'valid' || data.data.status === 'accept_all',
        source: 'hunter'
      };
    }

    return null;
  } catch (error) {
    console.error('Hunter.io verification error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Domain search - find all emails for a company domain
 */
export async function searchDomainWithHunter(domain: string, limit = 10): Promise<HunterDomainResult | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey || !domain) return null;

  console.log(`🔍 Hunter.io: Searching domain ${domain}`);

  try {
    const url = `${HUNTER_BASE_URL}/domain-search?domain=${encodeURIComponent(domain)}&limit=${limit}&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return null;
    const data = await response.json();

    if (data.data) {
      return {
        domain: data.data.domain,
        organization: data.data.organization,
        industry: data.data.industry,
        emails: data.data.emails?.map((e: any) => ({
          email: e.value,
          firstName: e.first_name,
          lastName: e.last_name,
          position: e.position,
          confidence: e.confidence,
          department: e.department
        })) || [],
        linkedinUrl: data.data.linkedin,
        twitterHandle: data.data.twitter,
        facebookHandle: data.data.facebook,
        source: 'hunter'
      };
    }

    return null;
  } catch (error) {
    console.error('Hunter.io domain search error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Find email with confidence score
 */
export async function findEmailWithHunter(
  firstName: string,
  lastName: string,
  domain: string
): Promise<HunterEmailFinderResult | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) return null;

  console.log(`📧 Hunter.io: Finding email for ${firstName} ${lastName} @ ${domain}`);

  try {
    const url = `${HUNTER_BASE_URL}/email-finder?domain=${encodeURIComponent(domain)}&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return null;
    const data = await response.json();

    if (data.data && data.data.email) {
      return {
        email: data.data.email,
        confidence: data.data.score >= 80 ? 'high' : data.data.score >= 50 ? 'medium' : 'low',
        score: data.data.score,
        position: data.data.position,
        twitter: data.data.twitter,
        linkedin: data.data.linkedin_url,
        phone: data.data.phone_number,
        source: 'hunter'
      };
    }

    return null;
  } catch (error) {
    console.error('Hunter.io email finder error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Get email count for a domain
 */
export async function getEmailCountForDomain(domain: string): Promise<number | null> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey || !domain) return null;

  try {
    const url = `${HUNTER_BASE_URL}/email-count?domain=${encodeURIComponent(domain)}&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) return null;
    const data = await response.json();

    return data.data?.total || null;
  } catch (error) {
    console.error('Hunter.io email count error:', error instanceof Error ? error.message : error);
    return null;
  }
}
