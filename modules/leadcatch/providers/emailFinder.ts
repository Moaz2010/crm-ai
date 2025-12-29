/**
 * Email Finder Algorithms
 * Finds/guesses professional emails using common patterns
 */

export interface EmailPatternResult {
  email: string;
  confidence: 'high' | 'medium' | 'low';
  source: 'pattern' | 'hunter';
  alternatives?: string[];
}

/**
 * Generate possible email patterns based on name and company
 */
export function generateEmailPatterns(
  firstName: string,
  lastName: string,
  domain: string
): string[] {
  if (!firstName || !lastName || !domain) return [];

  const fn = firstName.toLowerCase().replace(/\s+/g, '');
  const ln = lastName.toLowerCase().replace(/\s+/g, '');
  const d = domain.toLowerCase().replace(/^www\./, '');

  return [
    `${fn}.${ln}@${d}`,              // john.doe@company.com
    `${fn}${ln}@${d}`,                // johndoe@company.com
    `${fn}@${d}`,                     // john@company.com
    `${fn[0]}${ln}@${d}`,             // jdoe@company.com
    `${fn}_${ln}@${d}`,               // john_doe@company.com
    `${fn}${ln[0]}@${d}`,             // johnd@company.com
    `${ln}.${fn}@${d}`,               // doe.john@company.com
    `${ln}@${d}`,                     // doe@company.com
    `${fn[0]}.${ln}@${d}`,            // j.doe@company.com
    `${fn}-${ln}@${d}`,               // john-doe@company.com
  ];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate email with stricter rules
 */
export function isValidBusinessEmail(email: string): boolean {
  if (!isValidEmail(email)) return false;
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  // Reject common personal email domains
  const personalDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'
  ];
  
  return !personalDomains.includes(domain);
}

/**
 * Find email for a lead (using pattern generation)
 */
export async function findEmail(
  firstName: string,
  lastName: string,
  domain: string
): Promise<EmailPatternResult | null> {
  console.log(`📧 Finding email for: ${firstName} ${lastName} @ ${domain}`);

  // Generate possible patterns
  const patterns = generateEmailPatterns(firstName, lastName, domain);
  
  if (patterns.length > 0) {
    console.log(`💡 Generated ${patterns.length} possible email patterns`);
    return {
      email: patterns[0], // Return most common pattern
      confidence: 'medium',
      source: 'pattern',
      alternatives: patterns.slice(1, 4) // Return top 3 alternatives
    };
  }

  return null;
}

/**
 * Extract domain from company name or website
 */
export function getDomainFromCompany(company: string): string | null {
  if (!company) return null;

  // If it looks like a URL, extract domain
  if (company.includes('http://') || company.includes('https://')) {
    try {
      const url = new URL(company);
      return url.hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }

  // Check if it already looks like a domain
  if (company.includes('.') && !company.includes(' ')) {
    return company.toLowerCase().replace(/^www\./, '');
  }

  // Simple heuristic: convert company name to domain
  // e.g., "Google Inc" → "google.com"
  const cleaned = company
    .toLowerCase()
    .replace(/\s+(inc|llc|ltd|corporation|corp|limited|co|company)\.?$/i, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  return cleaned ? `${cleaned}.com` : null;
}

/**
 * Extract company name from email domain
 */
export function getCompanyFromDomain(domain: string): string {
  if (!domain) return '';
  
  // Remove TLD
  const parts = domain.split('.');
  if (parts.length < 2) return domain;
  
  // Get the main part
  const main = parts[parts.length - 2];
  
  // Capitalize first letter
  return main.charAt(0).toUpperCase() + main.slice(1);
}

/**
 * Score email pattern likelihood
 */
export function scoreEmailPattern(pattern: string, companyInfo?: {
  hasStandardFormat?: boolean;
  employeeCount?: number;
}): number {
  let score = 50; // Base score
  
  // Common patterns score higher
  if (pattern.includes('.')) score += 10; // firstname.lastname pattern
  if (pattern.startsWith(pattern.split('@')[0][0])) score += 5; // Starts with first initial
  
  // Large companies tend to use standardized formats
  if (companyInfo?.employeeCount && companyInfo.employeeCount > 100) {
    score += 10;
  }
  
  return Math.min(100, score);
}
