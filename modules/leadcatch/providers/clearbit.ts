/**
 * Clearbit Integration
 * Company and person enrichment
 */

interface ClearbitEnrichmentResult {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  companySize?: string;
  companyIndustry?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyLinkedin?: string;
  location?: string;
  estimatedRevenue?: string;
}

const CLEARBIT_API_KEY = process.env.CLEARBIT_API_KEY;

/**
 * Enrich lead using Clearbit's Combined API
 */
export async function enrichWithClearbit(
  email: string
): Promise<ClearbitEnrichmentResult | null> {
  if (!CLEARBIT_API_KEY) {
    console.log('⚠️ Clearbit API key not configured');
    return null;
  }

  try {
    // Use Clearbit's Combined API for person + company
    const response = await fetch(
      `https://person.clearbit.com/v2/combined/find?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${CLEARBIT_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No data found
      }
      throw new Error(`Clearbit API error: ${response.status}`);
    }

    const data = await response.json();
    return mapClearbitResponse(data);
  } catch (error) {
    console.error('Clearbit enrichment error:', error);
    return null;
  }
}

/**
 * Enrich company only using domain
 */
export async function enrichCompanyWithClearbit(
  domain: string
): Promise<Partial<ClearbitEnrichmentResult> | null> {
  if (!CLEARBIT_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `https://company.clearbit.com/v2/companies/find?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          Authorization: `Bearer ${CLEARBIT_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const company = await response.json();
    return mapCompanyData(company);
  } catch (error) {
    console.error('Clearbit company enrichment error:', error);
    return null;
  }
}

function mapClearbitResponse(data: any): ClearbitEnrichmentResult {
  const { person, company } = data;
  
  return {
    // Person data
    firstName: person?.name?.givenName,
    lastName: person?.name?.familyName,
    email: person?.email,
    jobTitle: person?.employment?.title,
    location: person?.location,
    
    // Company data
    company: company?.name,
    companySize: company?.metrics?.employees 
      ? `${company.metrics.employees} employees`
      : undefined,
    companyIndustry: company?.category?.industry,
    companyDescription: company?.description,
    companyWebsite: company?.domain,
    companyLinkedin: company?.linkedin?.handle 
      ? `https://linkedin.com/company/${company.linkedin.handle}`
      : undefined,
    estimatedRevenue: company?.metrics?.annualRevenue 
      ? formatRevenue(company.metrics.annualRevenue)
      : undefined,
    
    // Phone from company if available
    phone: company?.phone,
  };
}

function mapCompanyData(company: any): Partial<ClearbitEnrichmentResult> {
  return {
    company: company?.name,
    companySize: company?.metrics?.employees 
      ? `${company.metrics.employees} employees`
      : undefined,
    companyIndustry: company?.category?.industry,
    companyDescription: company?.description,
    companyWebsite: company?.domain,
    companyLinkedin: company?.linkedin?.handle 
      ? `https://linkedin.com/company/${company.linkedin.handle}`
      : undefined,
    estimatedRevenue: company?.metrics?.annualRevenue 
      ? formatRevenue(company.metrics.annualRevenue)
      : undefined,
    phone: company?.phone,
  };
}

function formatRevenue(revenue: number): string {
  if (revenue >= 1000000000) {
    return `$${(revenue / 1000000000).toFixed(1)}B`;
  }
  if (revenue >= 1000000) {
    return `$${(revenue / 1000000).toFixed(1)}M`;
  }
  if (revenue >= 1000) {
    return `$${(revenue / 1000).toFixed(0)}K`;
  }
  return `$${revenue}`;
}
