import { ApifyClient } from 'apify-client';
import { config } from './config.js';
import { Lead } from './types.js';
import { saveLeads, loadExistingLeads } from './storage.js';

/**
 * Apify Lead Scraper
 * Captures leads from various sources using Apify actors
 */
export class LeadScraper {
  private client: ApifyClient;

  constructor() {
    this.client = new ApifyClient({
      token: config.apify.token,
    });
  }

  /**
   * Get available Apify actors for lead generation
   */
  async getAvailableActors(): Promise<any[]> {
    try {
      const response = await fetch(
        `${config.apify.baseUrl}/acts?token=${config.apify.token}&limit=20`
      );
      const data = await response.json();
      return data.data?.items || [];
    } catch (error) {
      console.error('Error fetching actors:', error);
      return [];
    }
  }

  /**
   * Run Google Maps Scraper for local businesses
   */
  async scrapeGoogleMaps(searchQueries: string[]): Promise<Lead[]> {
    console.log('🔍 Starting Google Maps scraper...');
    
    const leads: Lead[] = [];
    
    try {
      // Run the Google Maps scraper actor
      const run = await this.client.actor('compass/crawler-google-places').call({
        searchStringsArray: searchQueries,
        maxCrawledPlacesPerSearch: config.search.maxLeadsPerRun,
        language: 'en',
        includeWebResults: true,
      });

      // Fetch results from the dataset
      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      for (const item of items) {
        const lead = this.transformGoogleMapsResult(item);
        if (lead && lead.email) {
          leads.push(lead);
        }
      }

      console.log(`✅ Captured ${leads.length} leads from Google Maps`);
    } catch (error) {
      console.error('❌ Google Maps scraper error:', error);
    }

    return leads;
  }

  /**
   * Run Apollo.io style B2B lead scraper
   */
  async scrapeB2BLeads(industries: string[], location: string): Promise<Lead[]> {
    console.log('🏢 Starting B2B lead scraper...');
    
    const leads: Lead[] = [];

    try {
      // Using a web scraper to find business contacts
      const run = await this.client.actor('apify/web-scraper').call({
        startUrls: industries.map(industry => ({
          url: `https://www.google.com/search?q=${encodeURIComponent(industry + ' companies ' + location + ' contact email')}`,
        })),
        maxPagesPerCrawl: 10,
        pageFunction: async function pageFunction(context: any) {
          const { $, request } = context;
          const results: any[] = [];
          
          // Extract email patterns from page
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const pageText = $('body').text();
          const emails = pageText.match(emailRegex) || [];
          
          for (const email of emails) {
            if (!email.includes('example') && !email.includes('test')) {
              results.push({ email, source: request.url });
            }
          }
          
          return results;
        },
      });

      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
      
      for (const item of items) {
        if (item.email) {
          leads.push(this.createLeadFromEmail(item.email as string, item.source as string));
        }
      }

      console.log(`✅ Captured ${leads.length} B2B leads`);
    } catch (error) {
      console.error('❌ B2B scraper error:', error);
    }

    return leads;
  }

  /**
   * Simple website contact scraper
   */
  async scrapeWebsiteContacts(websites: string[]): Promise<Lead[]> {
    console.log('🌐 Scraping website contacts...');
    
    const leads: Lead[] = [];

    try {
      const run = await this.client.actor('apify/contact-info-scraper').call({
        startUrls: websites.map(url => ({ url })),
        maxRequestsPerStartUrl: 5,
      });

      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      for (const item of items) {
        const lead = this.transformContactResult(item);
        if (lead && lead.email) {
          leads.push(lead);
        }
      }

      console.log(`✅ Captured ${leads.length} leads from websites`);
    } catch (error) {
      console.error('❌ Website scraper error:', error);
    }

    return leads;
  }

  /**
   * Transform Google Maps result to Lead
   */
  private transformGoogleMapsResult(item: any): Lead | null {
    if (!item.email && !item.website) return null;

    return {
      id: this.generateId(),
      email: item.email || '',
      firstName: '',
      lastName: '',
      fullName: item.title || '',
      company: item.title || '',
      jobTitle: 'Owner/Manager',
      industry: item.categoryName || 'Business',
      location: item.address || config.search.targetLocation,
      companySize: item.totalScore ? 'Small Business' : undefined,
      linkedInUrl: undefined,
      website: item.website || undefined,
      phone: item.phone || undefined,
      capturedAt: new Date().toISOString(),
      source: 'google_maps',
      status: 'new',
    };
  }

  /**
   * Transform contact scraper result to Lead
   */
  private transformContactResult(item: any): Lead | null {
    const email = item.emails?.[0] || item.email;
    if (!email) return null;

    return {
      id: this.generateId(),
      email: email,
      firstName: '',
      lastName: '',
      fullName: item.companyName || '',
      company: item.companyName || new URL(item.url || 'https://unknown.com').hostname,
      jobTitle: 'Decision Maker',
      industry: 'Business Services',
      location: item.address || config.search.targetLocation,
      website: item.url || undefined,
      phone: item.phones?.[0] || undefined,
      capturedAt: new Date().toISOString(),
      source: 'website_scraper',
      status: 'new',
    };
  }

  /**
   * Create lead from email
   */
  private createLeadFromEmail(email: string, source: string): Lead {
    const domain = email.split('@')[1] || 'unknown.com';
    
    return {
      id: this.generateId(),
      email: email,
      firstName: '',
      lastName: '',
      fullName: '',
      company: domain.replace('.com', '').replace('.io', '').replace('.co', ''),
      jobTitle: 'Contact',
      industry: 'Business',
      location: config.search.targetLocation,
      website: `https://${domain}`,
      capturedAt: new Date().toISOString(),
      source: source,
      status: 'new',
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deduplicate leads by email
   */
  deduplicateLeads(leads: Lead[]): Lead[] {
    const seen = new Set<string>();
    return leads.filter(lead => {
      const email = lead.email.toLowerCase();
      if (seen.has(email)) return false;
      seen.add(email);
      return true;
    });
  }

  /**
   * Filter out previously contacted leads
   */
  async filterNewLeads(leads: Lead[]): Promise<Lead[]> {
    const existingLeads = await loadExistingLeads();
    const existingEmails = new Set(existingLeads.map(l => l.email.toLowerCase()));
    
    return leads.filter(lead => !existingEmails.has(lead.email.toLowerCase()));
  }
}

/**
 * Main scraping function
 */
export async function runScraper(): Promise<Lead[]> {
  console.log('🚀 Starting lead scraping process...\n');
  
  const scraper = new LeadScraper();
  let allLeads: Lead[] = [];

  // Define search queries based on configuration
  const searchQueries = config.search.targetIndustries.map(
    industry => `${industry} companies ${config.search.targetLocation}`
  );

  // Scrape Google Maps for local businesses
  const googleMapsLeads = await scraper.scrapeGoogleMaps(searchQueries);
  allLeads = [...allLeads, ...googleMapsLeads];

  // Scrape B2B leads
  const b2bLeads = await scraper.scrapeB2BLeads(
    config.search.targetIndustries,
    config.search.targetLocation
  );
  allLeads = [...allLeads, ...b2bLeads];

  // Deduplicate
  allLeads = scraper.deduplicateLeads(allLeads);

  // Filter out already contacted leads
  allLeads = await scraper.filterNewLeads(allLeads);

  // Save leads
  if (allLeads.length > 0) {
    await saveLeads(allLeads);
    console.log(`\n📊 Total new leads captured: ${allLeads.length}`);
  } else {
    console.log('\n⚠️ No new leads captured in this run');
  }

  return allLeads;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runScraper().catch(console.error);
}
