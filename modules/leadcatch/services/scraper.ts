/**
 * Web Scraping Service
 * Scrapes LinkedIn profiles and websites for lead data
 * Uses fetch-based scraping (server-side only)
 */

export interface ScrapedData {
  title: string;
  meta_description?: string;
  h1?: string;
  body_text: string;
  url: string;
  scraped_at: string;
}

export interface LinkedInProfile {
  name?: string;
  headline?: string;
  location?: string;
  company?: string;
  summary?: string;
  experience?: string[];
  profileUrl: string;
}

/**
 * Simple fetch-based scraper (no JavaScript rendering)
 */
export async function simpleScrape(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    throw new Error(`Simple scrape failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Scrapes a URL for basic content using fetch
 */
export async function scrapeProfile(url: string): Promise<ScrapedData> {
  console.log(`🕷️ Scraping URL: ${url}`);

  try {
    const html = await simpleScrape(url);
    
    // Parse HTML manually (basic extraction)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    
    // Extract body text (remove scripts and styles)
    let bodyText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000);

    console.log(`✅ Scraped ${titleMatch?.[1] || 'Unknown'}`);
    
    return {
      title: titleMatch?.[1] || 'Unknown',
      meta_description: metaMatch?.[1] || '',
      h1: h1Match?.[1]?.trim(),
      body_text: bodyText,
      url,
      scraped_at: new Date().toISOString()
    };

  } catch (error) {
    console.error("Scraping Error:", error);
    throw new Error(`Failed to scrape ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Scrape LinkedIn profile (basic public info)
 * Note: LinkedIn heavily blocks scraping, this returns limited data
 */
export async function scrapeLinkedInProfile(linkedinUrl: string): Promise<LinkedInProfile> {
  console.log(`🔗 Scraping LinkedIn: ${linkedinUrl}`);

  try {
    const data = await scrapeProfile(linkedinUrl);
    
    // Extract name from title (usually "Name - Title | LinkedIn")
    const nameParts = data.title?.split(' - ') || [];
    const name = nameParts[0]?.replace(' | LinkedIn', '').trim();
    
    return {
      name,
      headline: nameParts[1]?.replace(' | LinkedIn', '').trim(),
      summary: data.meta_description,
      profileUrl: linkedinUrl
    };

  } catch (error) {
    console.error("LinkedIn Scraping Error:", error);
    throw new Error(`Failed to scrape LinkedIn: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Scrape company website for business info
 */
export async function scrapeCompanyWebsite(websiteUrl: string): Promise<{
  company_name?: string;
  description?: string;
  industry?: string;
  contact_email?: string;
  phone?: string;
  social_links?: string[];
  scraped_at: string;
}> {
  const data = await scrapeProfile(websiteUrl);
  
  // Extract email from body
  const emailMatch = data.body_text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  
  // Extract phone (basic pattern)
  const phoneMatch = data.body_text.match(/(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/);

  return {
    company_name: data.h1 || data.title?.split('|')[0].trim(),
    description: data.meta_description,
    contact_email: emailMatch?.[0],
    phone: phoneMatch?.[0],
    social_links: [],
    scraped_at: new Date().toISOString()
  };
}

/**
 * Extract structured data from scraped content using patterns
 */
export function extractContactInfo(text: string): {
  emails: string[];
  phones: string[];
  linkedinUrls: string[];
} {
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const phones = text.match(/(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g) || [];
  const linkedinUrls = text.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/g) || [];
  
  return {
    emails: [...new Set(emails)],
    phones: [...new Set(phones)],
    linkedinUrls: [...new Set(linkedinUrls)]
  };
}
