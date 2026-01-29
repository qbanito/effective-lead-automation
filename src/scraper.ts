import { ApifyClient } from 'apify-client';
import { config } from './config.js';
import { Lead } from './types.js';
import { saveLeads, loadExistingLeads } from './storage.js';

/**
 * Apify Lead Scraper
 * Loads leads from pre-existing Apify datasets
 */

// Pre-existing dataset IDs from our campaigns
const EXISTING_DATASETS: Record<string, string> = {
  lawyers: 'asPNi8abDyyLejRFt',
  realestate: 'TEpWsS1HciMsbgRMo',
  homeservices: 'bnB2KFoaz5MauDIHu',
  medical: 'BHHiTmV0I34LsmK2l',
  insurance: 'rKVSnPlZaPgKgcIwe',
  mortgage: 'becNlXcvjd4JG7F5A',
};

export class LeadScraper {
  private client: ApifyClient;

  constructor() {
    this.client = new ApifyClient({
      token: config.apify.token,
    });
  }

  async fetchFromDataset(datasetId: string, limit: number = 200): Promise<Lead[]> {
    console.log(` Fetching leads from dataset: ${datasetId}`);
    
    try {
      const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${config.apify.token}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dataset: ${response.statusText}`);
      }
      
      const items = await response.json();
      console.log(` Fetched ${items.length} items from dataset`);
      
      const leads: Lead[] = [];
      for (const item of items) {
        const lead = this.transformApifyItem(item);
        if (lead && lead.email) {
          leads.push(lead);
        }
      }
      
      return leads;
    } catch (error) {
      console.error(` Error fetching dataset:`, error);
      return [];
    }
  }

  private transformApifyItem(item: any): Lead | null {
    const email = item.email || item.emails?.[0] || item.contact_email;
    if (!email || typeof email !== 'string' || !email.includes('@')) return null;
    
    const firstName = item.first_name || item.firstName || item.name?.split(' ')[0] || '';
    const lastName = item.last_name || item.lastName || item.name?.split(' ').slice(1).join(' ') || '';
    const company = item.company_name || item.company || item.organization || item.title || '';
    
    return {
      id: this.generateId(),
      email: email.toLowerCase().trim(),
      firstName,
      lastName,
      fullName: item.name || item.full_name || `${firstName} ${lastName}`.trim(),
      company,
      jobTitle: item.job_title || item.title || item.position || 'Decision Maker',
      industry: item.industry || item.practice_area || 'Business Services',
      location: item.location || item.city || item.state || config.search.targetLocation,
      website: item.website || item.url || undefined,
      phone: item.phone || item.telephone || undefined,
      linkedInUrl: item.linkedin || item.linkedInUrl || undefined,
      capturedAt: new Date().toISOString(),
      source: 'apify_dataset',
      status: 'new',
    };
  }

  private generateId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  deduplicateLeads(leads: Lead[]): Lead[] {
    const seen = new Set<string>();
    return leads.filter(lead => {
      const email = lead.email.toLowerCase();
      if (seen.has(email)) return false;
      seen.add(email);
      return true;
    });
  }

  async filterNewLeads(leads: Lead[]): Promise<Lead[]> {
    const existingLeads = await loadExistingLeads();
    const existingEmails = new Set(existingLeads.map(l => l.email.toLowerCase()));
    return leads.filter(lead => !existingEmails.has(lead.email.toLowerCase()));
  }
}

export async function runScraper(): Promise<Lead[]> {
  console.log(' Starting lead loading process...\n');

  const scraper = new LeadScraper();
  let allLeads: Lead[] = [];

  for (const [niche, datasetId] of Object.entries(EXISTING_DATASETS)) {
    console.log(`\n Loading ${niche} leads...`);
    const nicheLeads = await scraper.fetchFromDataset(datasetId, 100);
    allLeads = [...allLeads, ...nicheLeads];
    console.log(`   Found ${nicheLeads.length} valid leads`);
  }

  allLeads = scraper.deduplicateLeads(allLeads);
  console.log(`\n Total unique leads: ${allLeads.length}`);

  allLeads = await scraper.filterNewLeads(allLeads);
  console.log(` New leads to contact: ${allLeads.length}`);

  if (allLeads.length > 0) {
    await saveLeads(allLeads);
    console.log(`\n Saved ${allLeads.length} new leads to database`);
  } else {
    console.log('\n No new leads to add');
  }

  return allLeads;
}
