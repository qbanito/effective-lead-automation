/**
 * Lead Resurrect - Auto-fetch new leads when running low
 * Uses Apify Google Maps Scraper to find new B2B leads
 */

const fs = require('fs');
const path = require('path');
const { ApifyClient } = require('apify-client');

// Configuration
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const MIN_LEADS_THRESHOLD = 50; // Trigger resurrect when less than this many fresh leads

if (!APIFY_TOKEN) {
  console.error('❌ APIFY_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ApifyClient({ token: APIFY_TOKEN });

// File paths
const LEADS_FILE = path.join(__dirname, 'leads-test.json');
const TRACKING_FILE = path.join(__dirname, 'email-tracking.json');
const UNSUBSCRIBE_FILE = path.join(__dirname, 'unsubscribed.json');

// Search queries for B2B leads - rotating industries
const SEARCH_QUERIES = [
  // Insurance
  { query: 'insurance agency', location: 'Miami, FL', industry: 'insurance' },
  { query: 'insurance broker', location: 'Los Angeles, CA', industry: 'insurance' },
  { query: 'insurance agency', location: 'New York, NY', industry: 'insurance' },
  
  // Real Estate
  { query: 'real estate agency', location: 'Dallas, TX', industry: 'real estate' },
  { query: 'commercial real estate', location: 'Chicago, IL', industry: 'real estate' },
  { query: 'property management company', location: 'Phoenix, AZ', industry: 'real estate' },
  
  // Healthcare
  { query: 'medical clinic', location: 'Houston, TX', industry: 'healthcare' },
  { query: 'dental practice', location: 'Atlanta, GA', industry: 'healthcare' },
  { query: 'healthcare consulting', location: 'Boston, MA', industry: 'healthcare' },
  
  // Marketing Agencies
  { query: 'digital marketing agency', location: 'San Francisco, CA', industry: 'marketing' },
  { query: 'marketing agency', location: 'Austin, TX', industry: 'marketing' },
  { query: 'advertising agency', location: 'Denver, CO', industry: 'marketing' },
  
  // Financial Services
  { query: 'financial advisor', location: 'Charlotte, NC', industry: 'financial' },
  { query: 'wealth management', location: 'Seattle, WA', industry: 'financial' },
  { query: 'accounting firm', location: 'San Diego, CA', industry: 'financial' },
  
  // Staffing
  { query: 'staffing agency', location: 'Philadelphia, PA', industry: 'staffing' },
  { query: 'recruiting agency', location: 'Tampa, FL', industry: 'staffing' },
  { query: 'temp agency', location: 'Orlando, FL', industry: 'staffing' },
];

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
 * Count fresh leads (not yet contacted or completed)
 */
function countFreshLeads() {
  const leads = loadJSON(LEADS_FILE, []);
  const tracking = loadJSON(TRACKING_FILE, []);
  const unsubscribed = loadJSON(UNSUBSCRIBE_FILE, []);
  
  let fresh = 0;
  for (const lead of leads) {
    // Skip unsubscribed
    if (unsubscribed.includes(lead.email.toLowerCase())) continue;
    
    // Check if already contacted
    const record = tracking.find(t => t.email === lead.email);
    if (!record) {
      fresh++; // Never contacted
    } else if (record.lastSequenceIndex < 4) {
      fresh++; // Sequence not complete
    }
  }
  
  return fresh;
}

/**
 * Fetch new leads from Apify Google Maps Scraper
 */
async function fetchNewLeads(query, location) {
  console.log(`🔍 Searching: "${query}" in ${location}...`);
  
  try {
    const run = await client.actor('compass/crawler-google-places').call({
      searchStringsArray: [query],
      locationQuery: location,
      maxCrawledPlacesPerSearch: 30,
      language: 'en',
      includeWebResults: false,
    });
    
    // Wait for completion
    await client.run(run.id).waitForFinish();
    
    // Get results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    // Extract leads with emails
    const leads = items
      .filter(item => item.email || item.emails?.length > 0)
      .map(item => ({
        name: item.title || 'Unknown',
        email: item.email || item.emails?.[0] || '',
        phone: item.phone || '',
        website: item.website || '',
        address: item.address || '',
        linkedin: '',
        source: `Google Maps - ${query} - ${location}`,
        fetchedAt: new Date().toISOString()
      }))
      .filter(lead => lead.email && lead.email.includes('@'));
    
    console.log(`   ✅ Found ${leads.length} leads with emails`);
    return leads;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return [];
  }
}

/**
 * Add new leads to the leads file (avoiding duplicates)
 */
function addNewLeads(newLeads) {
  const existingLeads = loadJSON(LEADS_FILE, []);
  const existingEmails = new Set(existingLeads.map(l => l.email.toLowerCase()));
  
  let added = 0;
  for (const lead of newLeads) {
    if (!existingEmails.has(lead.email.toLowerCase())) {
      existingLeads.push(lead);
      existingEmails.add(lead.email.toLowerCase());
      added++;
    }
  }
  
  if (added > 0) {
    saveJSON(LEADS_FILE, existingLeads);
    console.log(`💾 Added ${added} new leads (${existingLeads.length} total)`);
  }
  
  return added;
}

/**
 * Main resurrect function
 */
async function resurrectLeads(force = false) {
  console.log('🔄 Lead Resurrect System');
  console.log('━'.repeat(50));
  
  const freshCount = countFreshLeads();
  console.log(`📊 Current fresh leads: ${freshCount}`);
  console.log(`📊 Threshold: ${MIN_LEADS_THRESHOLD}`);
  
  if (freshCount >= MIN_LEADS_THRESHOLD && !force) {
    console.log(`\n✅ Enough leads available. No action needed.`);
    return { status: 'ok', freshLeads: freshCount, added: 0 };
  }
  
  console.log(`\n⚠️  Running low on leads! Fetching new ones...`);
  console.log('━'.repeat(50));
  
  // Pick random queries to search
  const shuffled = [...SEARCH_QUERIES].sort(() => Math.random() - 0.5);
  const queriesToRun = shuffled.slice(0, 3); // Run 3 searches
  
  let totalAdded = 0;
  
  for (const { query, location } of queriesToRun) {
    const leads = await fetchNewLeads(query, location);
    const added = addNewLeads(leads);
    totalAdded += added;
    
    // Small delay between searches
    await new Promise(r => setTimeout(r, 5000));
  }
  
  console.log('\n' + '━'.repeat(50));
  console.log(`🎯 Resurrect Complete!`);
  console.log(`   New leads added: ${totalAdded}`);
  console.log(`   Total fresh leads now: ${countFreshLeads()}`);
  
  return { status: 'resurrected', freshLeads: countFreshLeads(), added: totalAdded };
}

/**
 * Check status only
 */
function checkStatus() {
  const leads = loadJSON(LEADS_FILE, []);
  const tracking = loadJSON(TRACKING_FILE, []);
  const freshCount = countFreshLeads();
  
  console.log('📊 Lead Status');
  console.log('━'.repeat(50));
  console.log(`📋 Total leads in database: ${leads.length}`);
  console.log(`📧 Tracked (contacted): ${tracking.length}`);
  console.log(`🆕 Fresh (not contacted or incomplete): ${freshCount}`);
  console.log(`⚠️  Resurrect threshold: ${MIN_LEADS_THRESHOLD}`);
  
  if (freshCount < MIN_LEADS_THRESHOLD) {
    console.log(`\n🔴 LOW LEADS - Resurrect recommended!`);
  } else {
    console.log(`\n🟢 Leads are healthy`);
  }
}

// CLI
const command = process.argv[2];

switch (command) {
  case 'run':
    resurrectLeads(false);
    break;
  case 'force':
    resurrectLeads(true);
    break;
  case 'status':
    checkStatus();
    break;
  default:
    console.log('🔄 Lead Resurrect System');
    console.log('');
    console.log('Usage:');
    console.log('  node lead-resurrect.cjs run     - Auto-fetch if running low');
    console.log('  node lead-resurrect.cjs force   - Force fetch new leads');
    console.log('  node lead-resurrect.cjs status  - Check lead status');
}

module.exports = { resurrectLeads, countFreshLeads, checkStatus };
