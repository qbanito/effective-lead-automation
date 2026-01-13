/**
 * Smart Email Sender - Automated Campaign Runner
 * Sends emails intelligently with delays and tracking
 * Designed to run via GitHub Actions daily
 */

const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const { personalizeForLead, emailSequence, CONTACT } = require('./email-templates.cjs');

// Configuration - Use environment variables (no hardcoded secrets)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY environment variable is required');
  process.exit(1);
}

const DAILY_LIMIT = 50;
const MIN_DELAY_MS = 2 * 60 * 1000; // 2 minutes
const MAX_DELAY_MS = 4 * 60 * 1000; // 4 minutes

const resend = new Resend(RESEND_API_KEY);

// File paths
const LEADS_FILE = path.join(__dirname, 'leads-test.json');
const TRACKING_FILE = path.join(__dirname, 'email-tracking.json');
const UNSUBSCRIBE_FILE = path.join(__dirname, 'unsubscribed.json');

/**
 * Load JSON file safely
 */
function loadJSON(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.error(`Error loading ${filePath}:`, e.message);
  }
  return defaultValue;
}

/**
 * Save JSON file
 */
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Get random delay between min and max
 */
function getRandomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

/**
 * Sleep for ms milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if email is unsubscribed
 */
function isUnsubscribed(email, unsubscribed) {
  return unsubscribed.includes(email.toLowerCase());
}

/**
 * Get next email in sequence for a lead
 */
function getNextSequenceIndex(tracking, email) {
  const record = tracking.find(t => t.email === email);
  if (!record) return 0;
  
  const lastIndex = record.lastSequenceIndex;
  const lastSentDate = new Date(record.lastSentDate);
  const now = new Date();
  const daysSinceLastEmail = Math.floor((now - lastSentDate) / (1000 * 60 * 60 * 24));
  
  // Check if enough days have passed for next email
  const nextIndex = lastIndex + 1;
  if (nextIndex >= emailSequence.length) return -1; // Sequence complete
  
  const requiredDays = emailSequence[nextIndex].day - emailSequence[lastIndex].day;
  if (daysSinceLastEmail < requiredDays) return -2; // Not time yet
  
  return nextIndex;
}

/**
 * Update tracking record
 */
function updateTracking(tracking, email, sequenceIndex) {
  const existingIndex = tracking.findIndex(t => t.email === email);
  const record = {
    email,
    lastSequenceIndex: sequenceIndex,
    lastSentDate: new Date().toISOString(),
    totalSent: existingIndex >= 0 ? tracking[existingIndex].totalSent + 1 : 1
  };
  
  if (existingIndex >= 0) {
    tracking[existingIndex] = record;
  } else {
    tracking.push(record);
  }
  
  return tracking;
}

/**
 * Main campaign runner
 */
async function runCampaign(dryRun = false) {
  console.log('🚀 Starting Email Campaign');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN (no emails sent)' : 'LIVE'}`);
  console.log('━'.repeat(50));
  
  // Load data
  const leads = loadJSON(LEADS_FILE, []);
  const tracking = loadJSON(TRACKING_FILE, []);
  const unsubscribed = loadJSON(UNSUBSCRIBE_FILE, []);
  
  console.log(`📋 Total leads: ${leads.length}`);
  console.log(`📧 Already tracked: ${tracking.length}`);
  console.log(`🚫 Unsubscribed: ${unsubscribed.length}`);
  console.log('━'.repeat(50));
  
  let emailsSent = 0;
  let skipped = 0;
  let completed = 0;
  let notReady = 0;
  
  for (const lead of leads) {
    if (emailsSent >= DAILY_LIMIT) {
      console.log(`\n⏸️  Daily limit reached (${DAILY_LIMIT} emails)`);
      break;
    }
    
    const email = lead.email;
    
    // Skip unsubscribed
    if (isUnsubscribed(email, unsubscribed)) {
      skipped++;
      continue;
    }
    
    // Get next sequence index
    const sequenceIndex = getNextSequenceIndex(tracking, email);
    
    if (sequenceIndex === -1) {
      completed++;
      continue; // Sequence complete
    }
    
    if (sequenceIndex === -2) {
      notReady++;
      continue; // Not time yet
    }
    
    // Prepare email
    const emailData = personalizeForLead(lead, sequenceIndex);
    
    console.log(`\n📤 Sending Email ${sequenceIndex + 1}/5 to: ${email}`);
    console.log(`   Subject: ${emailData.subject}`);
    console.log(`   Company: ${emailData.data.company}`);
    console.log(`   Industry: ${emailData.data.context.industry}`);
    
    if (!dryRun) {
      try {
        const result = await resend.emails.send({
          from: `${CONTACT.name} <${CONTACT.email}>`,
          to: email,
          subject: emailData.subject,
          html: emailData.html
        });
        
        console.log(`   ✅ Sent! ID: ${result.data?.id}`);
        
        // Update tracking
        updateTracking(tracking, email, sequenceIndex);
        saveJSON(TRACKING_FILE, tracking);
        
        emailsSent++;
        
        // Random delay before next email
        if (emailsSent < DAILY_LIMIT) {
          const delay = getRandomDelay();
          console.log(`   ⏳ Waiting ${Math.round(delay / 1000 / 60)} minutes...`);
          await sleep(delay);
        }
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    } else {
      console.log(`   🔸 [DRY RUN] Would send this email`);
      emailsSent++;
    }
  }
  
  // Summary
  console.log('\n' + '━'.repeat(50));
  console.log('📊 Campaign Summary:');
  console.log(`   ✅ Emails sent: ${emailsSent}`);
  console.log(`   ⏭️  Skipped (unsubscribed): ${skipped}`);
  console.log(`   ✔️  Completed sequence: ${completed}`);
  console.log(`   ⏳ Not ready yet: ${notReady}`);
  console.log(`   📋 Remaining: ${leads.length - emailsSent - skipped - completed - notReady}`);
  console.log('━'.repeat(50));
  
  // Save tracking
  if (!dryRun) {
    saveJSON(TRACKING_FILE, tracking);
  }
  
  return { emailsSent, skipped, completed, notReady };
}

/**
 * Show campaign status
 */
function showStatus() {
  const leads = loadJSON(LEADS_FILE, []);
  const tracking = loadJSON(TRACKING_FILE, []);
  const unsubscribed = loadJSON(UNSUBSCRIBE_FILE, []);
  
  console.log('📊 Campaign Status');
  console.log('━'.repeat(50));
  console.log(`📋 Total leads: ${leads.length}`);
  console.log(`📧 Emails in tracking: ${tracking.length}`);
  console.log(`🚫 Unsubscribed: ${unsubscribed.length}`);
  
  // Count by sequence stage
  const stages = [0, 0, 0, 0, 0, 0]; // 0=not started, 1-5=emails sent
  
  for (const lead of leads) {
    const record = tracking.find(t => t.email === lead.email);
    if (!record) {
      stages[0]++;
    } else {
      stages[record.lastSequenceIndex + 1]++;
    }
  }
  
  console.log('\n📈 Funnel:');
  console.log(`   Not started: ${stages[0]}`);
  console.log(`   Email 1 sent: ${stages[1]}`);
  console.log(`   Email 2 sent: ${stages[2]}`);
  console.log(`   Email 3 sent: ${stages[3]}`);
  console.log(`   Email 4 sent: ${stages[4]}`);
  console.log(`   Email 5 sent (complete): ${stages[5]}`);
}

// CLI
const command = process.argv[2];

switch (command) {
  case 'run':
    runCampaign(false);
    break;
  case 'dry-run':
    runCampaign(true);
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log('📧 Smart Email Sender');
    console.log('');
    console.log('Usage:');
    console.log('  node smart-sender.cjs run       - Send emails (live)');
    console.log('  node smart-sender.cjs dry-run   - Preview without sending');
    console.log('  node smart-sender.cjs status    - Show campaign status');
}
