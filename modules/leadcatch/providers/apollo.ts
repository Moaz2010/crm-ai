/**
 * Apollo.io Integration
 * Lead enrichment using Apollo API
 */

interface ApolloEnrichmentInput {
  linkedinUrl?: string | null;
  email?: string | null;
  firstName?: string;
  lastName?: string;
  company?: string;
}

interface ApolloEnrichmentResult {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  companySize?: string;
  companyIndustry?: string;
  linkedinUrl?: string;
  location?: string;
}

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_BASE_URL = 'https://api.apollo.io/v1';

/**
 * Enrich lead using Apollo's People API
 */
export async function enrichWithApollo(
  input: ApolloEnrichmentInput
): Promise<ApolloEnrichmentResult | null> {
  if (!APOLLO_API_KEY) {
    console.log('⚠️ Apollo API key not configured');
    return null;
  }

  try {
    // Try LinkedIn URL first
    if (input.linkedinUrl) {
      return await enrichByLinkedIn(input.linkedinUrl);
    }

    // Try email enrichment
    if (input.email) {
      return await enrichByEmail(input.email);
    }

    // Try name + company search
    if (input.firstName && input.company) {
      return await searchPerson(input);
    }

    return null;
  } catch (error) {
    console.error('Apollo enrichment error:', error);
    return null;
  }
}

async function enrichByLinkedIn(linkedinUrl: string): Promise<ApolloEnrichmentResult | null> {
  const response = await fetch(`${APOLLO_BASE_URL}/people/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': APOLLO_API_KEY!,
    },
    body: JSON.stringify({
      linkedin_url: linkedinUrl,
      reveal_personal_emails: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apollo API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.person) {
    return null;
  }

  return mapApolloResponse(data.person);
}

async function enrichByEmail(email: string): Promise<ApolloEnrichmentResult | null> {
  const response = await fetch(`${APOLLO_BASE_URL}/people/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': APOLLO_API_KEY!,
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apollo API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.person) {
    return null;
  }

  return mapApolloResponse(data.person);
}

async function searchPerson(input: ApolloEnrichmentInput): Promise<ApolloEnrichmentResult | null> {
  const response = await fetch(`${APOLLO_BASE_URL}/people/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': APOLLO_API_KEY!,
    },
    body: JSON.stringify({
      first_name: input.firstName,
      last_name: input.lastName,
      organization_name: input.company,
      per_page: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apollo API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.people || data.people.length === 0) {
    return null;
  }

  return mapApolloResponse(data.people[0]);
}

function mapApolloResponse(person: any): ApolloEnrichmentResult {
  return {
    firstName: person.first_name,
    lastName: person.last_name,
    email: person.email,
    phone: person.phone_numbers?.[0]?.raw_number,
    jobTitle: person.title,
    company: person.organization?.name,
    companySize: person.organization?.estimated_num_employees 
      ? `${person.organization.estimated_num_employees} employees`
      : undefined,
    companyIndustry: person.organization?.industry,
    linkedinUrl: person.linkedin_url,
    location: [person.city, person.state, person.country].filter(Boolean).join(', '),
  };
}

/**
 * Bulk enrich multiple leads
 */
export async function bulkEnrichWithApollo(
  inputs: ApolloEnrichmentInput[]
): Promise<(ApolloEnrichmentResult | null)[]> {
  // Apollo has rate limits, process sequentially with delays
  const results: (ApolloEnrichmentResult | null)[] = [];
  
  for (const input of inputs) {
    const result = await enrichWithApollo(input);
    results.push(result);
    
    // Respect rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return results;
}
