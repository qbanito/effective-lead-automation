const { ApifyClient } = require('apify-client');

// Use environment variable for API token
const APIFY_TOKEN = process.env.APIFY_TOKEN;

if (!APIFY_TOKEN) {
  console.error('❌ APIFY_TOKEN environment variable is required');
  process.exit(1);
}

const client = new ApifyClient({
  token: APIFY_TOKEN,
});

async function testLeadScraper() {
  console.log('🚀 Starting Apify lead scraper test...\n');

  // Search queries for potential B2B clients
  const searchQueries = [
    'marketing agency owner email USA',
    'digital marketing agency CEO contact',
    'B2B SaaS founder email',
  ];

  try {
    console.log('🔍 Running code_crafter/leads-finder...');
    console.log('   Queries:', searchQueries.join(', '));
    console.log('   This may take 2-5 minutes...\n');

    // Run the Leads Finder actor
    const run = await client.actor('code_crafter/leads-finder').call({
      queries: searchQueries,
      maxResults: 20, // Limit for testing
      includeEmails: true,
      includePhones: true,
      includeLinkedIn: true,
    });

    console.log(`✅ Scraper finished! Run ID: ${run.id}\n`);

    // Fetch results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    console.log(`📊 Found ${items.length} leads\n`);
    console.log('=' .repeat(60));

    const leads = [];

    for (const item of items) {
      const lead = {
        name: item.name || item.fullName || item.firstName || 'Unknown',
        company: item.company || item.companyName || item.organization || null,
        email: item.email || item.emails?.[0] || null,
        phone: item.phone || item.phones?.[0] || null,
        website: item.website || item.url || null,
        linkedin: item.linkedin || item.linkedinUrl || null,
        title: item.title || item.jobTitle || item.position || null,
        location: item.location || item.city || item.country || null,
      };

      // Only keep leads with email
      if (lead.email) {
        leads.push(lead);
        console.log(`\n👤 ${lead.name}`);
        console.log(`   🏢 Company: ${lead.company || 'Not found'}`);
        console.log(`   📧 Email: ${lead.email}`);
        console.log(`   💼 Title: ${lead.title || 'Not found'}`);
        console.log(`   📞 Phone: ${lead.phone || 'Not found'}`);
        console.log(`   🔗 LinkedIn: ${lead.linkedin || 'Not found'}`);
        console.log(`   🌐 Website: ${lead.website || 'Not found'}`);
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log(`\n📈 Summary:`);
    console.log(`   Total results: ${items.length}`);
    console.log(`   With emails: ${leads.length}`);
    console.log(`   With phones: ${leads.filter(l => l.phone).length}`);
    console.log(`   With LinkedIn: ${leads.filter(l => l.linkedin).length}`);

    // Save leads to JSON
    const fs = require('fs');
    fs.writeFileSync('leads-test.json', JSON.stringify(leads, null, 2));
    console.log(`\n💾 Leads saved to leads-test.json`);

    return leads;

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Check if it's a quota/credits issue
    if (error.message.includes('credit') || error.message.includes('quota')) {
      console.log('\n💡 You may need to add credits to your Apify account.');
      console.log('   Visit: https://console.apify.com/billing');
    }
    
    return [];
  }
}

testLeadScraper();
