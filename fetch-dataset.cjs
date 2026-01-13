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

async function fetchDataset() {
  console.log('🚀 Fetching leads from dataset YFs84fcuRd3IzhREO...\n');

  try {
    // Fetch results from the specific dataset
    const { items } = await client.dataset('YFs84fcuRd3IzhREO').listItems();

    console.log(`📊 Found ${items.length} leads in dataset\n`);
    console.log('=' .repeat(60));

    // Show first item structure to understand the data
    if (items.length > 0) {
      console.log('\n📋 Sample data structure:');
      console.log(JSON.stringify(items[0], null, 2));
      console.log('\n' + '=' .repeat(60));
    }

    const leads = [];

    for (const item of items) {
      // Try to extract email from various possible fields
      const email = item.email || item.emails?.[0] || item.Email || item.contact_email || null;
      
      const lead = {
        name: item.name || item.fullName || item.firstName || item.Name || 'Unknown',
        company: item.company || item.companyName || item.organization || item.Company || null,
        email: email,
        phone: item.phone || item.phones?.[0] || item.Phone || null,
        website: item.website || item.url || item.Website || null,
        linkedin: item.linkedin || item.linkedinUrl || item.LinkedIn || null,
        title: item.title || item.jobTitle || item.position || item.Title || null,
        location: item.location || item.city || item.country || item.Location || null,
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
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log(`\n📈 Summary:`);
    console.log(`   Total results: ${items.length}`);
    console.log(`   With emails: ${leads.length}`);

    // Save leads to JSON
    const fs = require('fs');
    fs.writeFileSync('leads-test.json', JSON.stringify(leads, null, 2));
    console.log(`\n💾 Leads saved to leads-test.json`);

    return leads;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

fetchDataset();
