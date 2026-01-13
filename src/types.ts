/**
 * Lead Interface - Represents a captured business lead
 */
export interface Lead {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  company: string;
  jobTitle: string;
  industry: string;
  location: string;
  companySize?: string;
  linkedInUrl?: string;
  website?: string;
  phone?: string;
  capturedAt: string;
  source: string;
  status: 'new' | 'contacted' | 'replied' | 'qualified' | 'disqualified';
}

/**
 * Email Template Configuration
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

/**
 * Email Send Result
 */
export interface EmailResult {
  leadId: string;
  email: string;
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt: string;
}

/**
 * Scraper Configuration
 */
export interface ScraperConfig {
  actorId: string;
  targetIndustries: string[];
  targetLocation: string;
  minCompanySize: number;
  maxCompanySize: number;
  maxResults: number;
}

/**
 * Campaign Configuration
 */
export interface CampaignConfig {
  name: string;
  templateId: string;
  dailyLimit: number;
  delayBetweenEmails: number; // in milliseconds
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
}
