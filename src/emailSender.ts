import { Resend } from 'resend';
import { config } from './config.js';
import { Lead, EmailResult } from './types.js';
import { getTemplate, personalizeTemplate } from './templates.js';
import { 
  getUncontactedLeads, 
  updateLeadStatus, 
  saveEmailResult, 
  getContactedEmails,
  logCampaignActivity,
  getCampaignStats 
} from './storage.js';

/**
 * Email Sender using Resend API
 * Handles professional B2B outreach campaigns
 */
export class EmailSender {
  private resend: Resend;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.resend = new Resend(config.resend.apiKey);
    this.fromEmail = config.resend.fromEmail;
    this.fromName = config.resend.fromName;
  }

  /**
   * Send a single email to a lead
   */
  async sendEmail(
    lead: Lead, 
    templateId: string = 'initial-outreach'
  ): Promise<EmailResult> {
    const template = getTemplate(templateId);
    
    if (!template) {
      return {
        leadId: lead.id,
        email: lead.email,
        success: false,
        error: `Template ${templateId} not found`,
        sentAt: new Date().toISOString(),
      };
    }

    // Personalize the template
    const { subject, html, text } = personalizeTemplate(template, {
      firstName: lead.firstName || this.extractFirstName(lead),
      companyName: lead.company || 'your company',
      industry: lead.industry || 'your industry',
    });

    try {
      const response = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [lead.email],
        subject: subject,
        html: html,
        text: text,
        headers: {
          'X-Entity-Ref-ID': lead.id,
        },
      });

      const result: EmailResult = {
        leadId: lead.id,
        email: lead.email,
        success: true,
        messageId: response.data?.id,
        sentAt: new Date().toISOString(),
      };

      // Update lead status
      await updateLeadStatus(lead.id, 'contacted');
      await saveEmailResult(result);

      console.log(`✅ Email sent to ${lead.email}`);
      return result;

    } catch (error: any) {
      const result: EmailResult = {
        leadId: lead.id,
        email: lead.email,
        success: false,
        error: error.message || 'Unknown error',
        sentAt: new Date().toISOString(),
      };

      await saveEmailResult(result);
      console.error(`❌ Failed to send to ${lead.email}: ${error.message}`);
      return result;
    }
  }

  /**
   * Extract first name from lead data
   */
  private extractFirstName(lead: Lead): string {
    if (lead.firstName) return lead.firstName;
    if (lead.fullName) return lead.fullName.split(' ')[0];
    
    // Try to extract from email
    const emailPrefix = lead.email.split('@')[0];
    const namePart = emailPrefix.split(/[._-]/)[0];
    
    // Capitalize first letter
    return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
  }

  /**
   * Send batch emails with rate limiting
   */
  async sendBatch(
    leads: Lead[], 
    templateId: string = 'initial-outreach',
    delayMs: number = 30000
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = [];
    
    console.log(`\n📧 Starting batch send: ${leads.length} emails\n`);

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      
      console.log(`[${i + 1}/${leads.length}] Sending to ${lead.email}...`);
      
      const result = await this.sendEmail(lead, templateId);
      results.push(result);

      // Wait between emails to avoid rate limiting
      if (i < leads.length - 1) {
        console.log(`⏳ Waiting ${delayMs / 1000}s before next email...`);
        await this.sleep(delayMs);
      }
    }

    // Log summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\n📊 Batch complete: ${successful} sent, ${failed} failed\n`);

    await logCampaignActivity({
      type: 'batch_complete',
      message: `Sent ${successful} emails, ${failed} failed`,
      data: { successful, failed, templateId }
    });

    return results;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Main email campaign function
 */
export async function runEmailCampaign(
  templateId: string = 'initial-outreach',
  maxEmails?: number
): Promise<void> {
  console.log('🚀 Starting email campaign...\n');

  // Get campaign stats
  const stats = await getCampaignStats();
  console.log(`📊 Current stats:`);
  console.log(`   Total leads: ${stats.totalLeads}`);
  console.log(`   Already contacted: ${stats.contacted}`);
  console.log(`   Sent today: ${stats.todaySent}`);
  console.log('');

  // Check daily limit
  const remainingToday = config.campaign.dailyLimit - stats.todaySent;
  if (remainingToday <= 0) {
    console.log('⚠️ Daily email limit reached. Try again tomorrow.');
    return;
  }

  // Get uncontacted leads
  let leads = await getUncontactedLeads();
  
  if (leads.length === 0) {
    console.log('⚠️ No uncontacted leads available. Run scraper first.');
    return;
  }

  // Apply limits
  const limit = Math.min(
    maxEmails || config.campaign.dailyLimit,
    remainingToday,
    leads.length
  );
  leads = leads.slice(0, limit);

  console.log(`📬 Sending to ${leads.length} leads...\n`);

  const sender = new EmailSender();
  await sender.sendBatch(leads, templateId, config.campaign.delayBetweenEmails);

  // Final stats
  const finalStats = await getCampaignStats();
  console.log('\n✅ Campaign complete!');
  console.log(`   Total sent today: ${finalStats.todaySent}`);
  console.log(`   Overall contact rate: ${finalStats.successRate.toFixed(1)}%`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEmailCampaign().catch(console.error);
}
