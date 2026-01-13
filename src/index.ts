import { config, validateConfig } from './config.js';
import { runScraper } from './scraper.js';
import { runEmailCampaign } from './emailSender.js';
import { getCampaignStats, logCampaignActivity } from './storage.js';

/**
 * Effective Lead Automation System
 * 
 * This is the main entry point that orchestrates:
 * 1. Lead scraping from various sources using Apify
 * 2. Email outreach campaigns using Resend
 * 3. Campaign tracking and analytics
 */

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   🚀 EFFECTIVE LEAD AUTOMATION SYSTEM');
  console.log('   Automated Lead Capture & Email Outreach');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Validate configuration
  const configValidation = validateConfig();
  if (!configValidation.valid) {
    console.error('❌ Configuration errors:');
    configValidation.errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
  }

  console.log('✅ Configuration validated\n');

  // Log start
  await logCampaignActivity({
    type: 'pipeline_start',
    message: 'Full automation pipeline started',
  });

  // Get initial stats
  const initialStats = await getCampaignStats();
  console.log('📊 Initial Statistics:');
  console.log(`   Total leads in database: ${initialStats.totalLeads}`);
  console.log(`   Previously contacted: ${initialStats.contacted}`);
  console.log(`   Emails sent today: ${initialStats.todaySent}`);
  console.log('');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const skipScrape = args.includes('--skip-scrape');
  const skipEmail = args.includes('--skip-email');
  const scrapeOnly = args.includes('--scrape-only');
  const emailOnly = args.includes('--email-only');

  // Step 1: Scrape new leads
  if (!skipScrape && !emailOnly) {
    console.log('───────────────────────────────────────────────────────────');
    console.log('   STEP 1: LEAD SCRAPING');
    console.log('───────────────────────────────────────────────────────────\n');
    
    try {
      const newLeads = await runScraper();
      console.log(`\n✅ Scraping complete. New leads: ${newLeads.length}\n`);
    } catch (error: any) {
      console.error(`❌ Scraping failed: ${error.message}`);
      await logCampaignActivity({
        type: 'scrape_error',
        message: error.message,
      });
    }
  }

  if (scrapeOnly) {
    console.log('\n🏁 Scrape-only mode. Exiting.\n');
    return;
  }

  // Step 2: Send email campaign
  if (!skipEmail && !scrapeOnly) {
    console.log('───────────────────────────────────────────────────────────');
    console.log('   STEP 2: EMAIL CAMPAIGN');
    console.log('───────────────────────────────────────────────────────────\n');
    
    try {
      await runEmailCampaign('initial-outreach');
    } catch (error: any) {
      console.error(`❌ Email campaign failed: ${error.message}`);
      await logCampaignActivity({
        type: 'email_error',
        message: error.message,
      });
    }
  }

  // Final stats
  const finalStats = await getCampaignStats();
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   📈 FINAL STATISTICS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Total leads: ${finalStats.totalLeads}`);
  console.log(`   Total contacted: ${finalStats.contacted}`);
  console.log(`   Contact rate: ${finalStats.successRate.toFixed(1)}%`);
  console.log(`   Sent today: ${finalStats.todaySent}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  await logCampaignActivity({
    type: 'pipeline_complete',
    message: 'Full automation pipeline completed',
    data: finalStats,
  });

  console.log('✅ Automation pipeline complete!\n');
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
