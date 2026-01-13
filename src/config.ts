import dotenv from 'dotenv';

dotenv.config();

/**
 * Application Configuration
 * All sensitive values are loaded from environment variables
 */
export const config = {
  // Apify Configuration
  apify: {
    token: process.env.APIFY_API_TOKEN || '',
    baseUrl: 'https://api.apify.com/v2',
    // Popular actors for lead generation
    actors: {
      linkedInScraper: 'anchor/linkedin-company-scraper',
      googleMapsScraper: 'compass/crawler-google-places',
      companyScraper: 'dtrungtin/apollo-io-scraper',
    }
  },

  // Resend Configuration
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'info@effectiveleadmarketing.com',
    fromName: process.env.FROM_NAME || 'Effective Lead Marketing',
  },

  // Lead Search Configuration
  search: {
    targetIndustries: (process.env.TARGET_INDUSTRY || 'SaaS,Consulting').split(','),
    targetLocation: process.env.TARGET_LOCATION || 'United States',
    minCompanySize: parseInt(process.env.MIN_COMPANY_SIZE || '10'),
    maxCompanySize: parseInt(process.env.MAX_COMPANY_SIZE || '500'),
    maxLeadsPerRun: 50,
  },

  // Email Campaign Configuration
  campaign: {
    dailyLimit: 50, // Maximum emails per day
    delayBetweenEmails: 30000, // 30 seconds between emails
    batchSize: 10, // Process in batches
  },

  // File paths for data persistence
  paths: {
    leadsFile: './data/leads.json',
    sentEmailsFile: './data/sent_emails.json',
    campaignLogFile: './data/campaign_log.json',
  }
};

/**
 * Validate required configuration
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.apify.token) {
    errors.push('APIFY_API_TOKEN is required');
  }

  if (!config.resend.apiKey) {
    errors.push('RESEND_API_KEY is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
