/**
 * Snov.io API Integration
 * Advanced email finder and enrichment source
 */

const SNOV_BASE_URL = 'https://api.snov.io/v1';

export interface SnovEmailResult {
  email: string;
  confidence: 'high' | 'medium' | 'low';
  source: 'snovio';
}

export interface SnovPersonResult {
  first_name?: string;
  last_name?: string;
  job_title?: string;
  company?: string;
  location?: string;
  linkedin_url?: string;
  source: 'snovio';
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Snov.io access token
 */
async function getSnovToken(): Promise<string | null> {
  const clientId = process.env.SNOV_CLIENT_ID;
  const clientSecret = process.env.SNOV_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return null;
  }

  // Use cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await fetch(`${SNOV_BASE_URL}/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    
    // Cache the token (expires in 1 hour)
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (55 * 60 * 1000); // 55 minutes to be safe
    
    return data.access_token;
  } catch (error) {
    console.error('Snov.io token error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Find email by name and domain using Snov.io
 */
export async function findEmailWithSnov(
  firstName: string,
  lastName: string,
  domain: string
): Promise<SnovEmailResult | null> {
  const token = await getSnovToken();
  if (!token) return null;

  console.log(`🔍 Snov.io: Finding email for ${firstName} ${lastName} @ ${domain}`);

  try {
    const response = await fetch(`${SNOV_BASE_URL}/get-emails-from-names`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        firstName,
        lastName,
        domain
      })
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data.success && data.data?.emails?.length > 0) {
      const bestEmail = data.data.emails[0];
      return {
        email: bestEmail.email,
        confidence: bestEmail.emailStatus === 'valid' ? 'high' : 'medium',
        source: 'snovio'
      };
    }

    return null;
  } catch (error) {
    console.error('Snov.io email finder error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Enrich person data using Snov.io
 */
export async function enrichPersonWithSnov(email: string): Promise<SnovPersonResult | null> {
  const token = await getSnovToken();
  if (!token || !email) return null;

  console.log(`👤 Snov.io: Enriching person data for ${email}`);

  try {
    const response = await fetch(`${SNOV_BASE_URL}/get-profile-by-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data.success && data.data) {
      return {
        first_name: data.data.firstName,
        last_name: data.data.lastName,
        job_title: data.data.currentJob?.[0]?.position,
        company: data.data.currentJob?.[0]?.companyName,
        location: data.data.locality,
        linkedin_url: data.data.social?.find((s: any) => s.type === 'linkedin')?.link,
        source: 'snovio'
      };
    }

    return null;
  } catch (error) {
    console.error('Snov.io enrichment error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Get company info from Snov.io
 */
export async function getCompanyInfoFromSnov(domain: string): Promise<any | null> {
  const token = await getSnovToken();
  if (!token || !domain) return null;

  console.log(`🏢 Snov.io: Getting company info for ${domain}`);

  try {
    const response = await fetch(`${SNOV_BASE_URL}/get-company-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ domain })
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data.success && data.data) {
      return {
        name: data.data.name,
        industry: data.data.industry,
        size: data.data.size,
        location: data.data.location,
        description: data.data.description,
        website: data.data.website,
        source: 'snovio'
      };
    }

    return null;
  } catch (error) {
    console.error('Snov.io company info error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Verify email status with Snov.io
 */
export async function verifyEmailWithSnov(email: string): Promise<{
  email: string;
  status: string;
  isValid: boolean;
  source: 'snovio';
} | null> {
  const token = await getSnovToken();
  if (!token || !email) return null;

  try {
    const response = await fetch(`${SNOV_BASE_URL}/email-verifier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ emails: [email] })
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data.success && data.data?.[0]) {
      return {
        email,
        status: data.data[0].status,
        isValid: data.data[0].status === 'valid',
        source: 'snovio'
      };
    }

    return null;
  } catch (error) {
    console.error('Snov.io email verification error:', error instanceof Error ? error.message : error);
    return null;
  }
}
