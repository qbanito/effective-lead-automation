import fs from 'fs/promises';
import path from 'path';
import { Lead, EmailResult } from './types.js';
import { config } from './config.js';

/**
 * Ensure data directory exists
 */
async function ensureDataDir(): Promise<void> {
  const dataDir = path.dirname(config.paths.leadsFile);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

/**
 * Save leads to JSON file
 */
export async function saveLeads(leads: Lead[]): Promise<void> {
  await ensureDataDir();
  
  // Load existing leads
  const existingLeads = await loadExistingLeads();
  
  // Merge with new leads (avoid duplicates by email)
  const emailSet = new Set(existingLeads.map(l => l.email.toLowerCase()));
  const newLeads = leads.filter(l => !emailSet.has(l.email.toLowerCase()));
  
  const allLeads = [...existingLeads, ...newLeads];
  
  await fs.writeFile(
    config.paths.leadsFile,
    JSON.stringify(allLeads, null, 2),
    'utf-8'
  );
  
  console.log(`💾 Saved ${newLeads.length} new leads (total: ${allLeads.length})`);
}

/**
 * Load existing leads from JSON file
 */
export async function loadExistingLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(config.paths.leadsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

/**
 * Get leads that haven't been contacted yet
 */
export async function getUncontactedLeads(): Promise<Lead[]> {
  const leads = await loadExistingLeads();
  return leads.filter(lead => lead.status === 'new');
}

/**
 * Update lead status
 */
export async function updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
  const leads = await loadExistingLeads();
  const lead = leads.find(l => l.id === leadId);
  
  if (lead) {
    lead.status = status;
    await fs.writeFile(
      config.paths.leadsFile,
      JSON.stringify(leads, null, 2),
      'utf-8'
    );
  }
}

/**
 * Save email send results
 */
export async function saveEmailResult(result: EmailResult): Promise<void> {
  await ensureDataDir();
  
  let results: EmailResult[] = [];
  
  try {
    const data = await fs.readFile(config.paths.sentEmailsFile, 'utf-8');
    results = JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet
  }
  
  results.push(result);
  
  await fs.writeFile(
    config.paths.sentEmailsFile,
    JSON.stringify(results, null, 2),
    'utf-8'
  );
}

/**
 * Get list of already contacted emails
 */
export async function getContactedEmails(): Promise<Set<string>> {
  try {
    const data = await fs.readFile(config.paths.sentEmailsFile, 'utf-8');
    const results: EmailResult[] = JSON.parse(data);
    return new Set(results.filter(r => r.success).map(r => r.email.toLowerCase()));
  } catch (error) {
    return new Set();
  }
}

/**
 * Log campaign activity
 */
export async function logCampaignActivity(activity: {
  type: string;
  message: string;
  data?: any;
}): Promise<void> {
  await ensureDataDir();
  
  let logs: any[] = [];
  
  try {
    const data = await fs.readFile(config.paths.campaignLogFile, 'utf-8');
    logs = JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet
  }
  
  logs.push({
    ...activity,
    timestamp: new Date().toISOString(),
  });
  
  // Keep only last 1000 log entries
  if (logs.length > 1000) {
    logs = logs.slice(-1000);
  }
  
  await fs.writeFile(
    config.paths.campaignLogFile,
    JSON.stringify(logs, null, 2),
    'utf-8'
  );
}

/**
 * Get campaign statistics
 */
export async function getCampaignStats(): Promise<{
  totalLeads: number;
  contacted: number;
  successRate: number;
  todaySent: number;
}> {
  const leads = await loadExistingLeads();
  const contactedEmails = await getContactedEmails();
  
  // Count today's emails
  let todaySent = 0;
  try {
    const data = await fs.readFile(config.paths.sentEmailsFile, 'utf-8');
    const results: EmailResult[] = JSON.parse(data);
    const today = new Date().toISOString().split('T')[0];
    todaySent = results.filter(r => r.sentAt.startsWith(today)).length;
  } catch (error) {
    // File doesn't exist
  }
  
  return {
    totalLeads: leads.length,
    contacted: contactedEmails.size,
    successRate: leads.length > 0 ? (contactedEmails.size / leads.length) * 100 : 0,
    todaySent,
  };
}
