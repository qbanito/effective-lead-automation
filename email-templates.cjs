/**
 * Email Sequence Templates - Professional B2B Outreach
 * 5-Email Sequence with Video Thumbnails and Smart Personalization
 */

// HeyGen Video Configuration
const VIDEO_URL = 'https://app.heygen.com/share/6e14c1dcfe7642609cd2296150b51d95';
const VIDEO_THUMBNAIL = 'https://app.heygen.com/api/v1/video/6e14c1dcfe7642609cd2296150b51d95/thumbnail';
const CALENDLY_URL = 'https://calendly.com/convoycubano/effective-leads-manager';

// Resource URLs - Hosted on the website
const SITE_URL = 'https://effective-lead-marketing-app.netlify.app';
const PDF_URL = `${SITE_URL}/content/Lead_Machine_Infrastructure_Now_Live.pdf`;
const AUDIO_1_URL = `${SITE_URL}/content/Permanent_AI_Lead_Infrastructure_Cuts_Costs.m4a`;
const AUDIO_2_URL = `${SITE_URL}/content/The_7-Day_Enterprise_Sales_Automation_System.m4a`;
const RESOURCES_PAGE_URL = `${SITE_URL}/#resources`;

// AI Sales Agent (ElevenLabs)
const AGENT_ID = 'agent_0201kewhjjnzej7tcwt33v9sv605';
const TALK_TO_ALEX_URL = `${SITE_URL}/talk-to-alex`;

// Contact Information
const CONTACT = {
  name: 'Neiver Alvarez',
  title: 'CEO & Founder',
  company: 'Effective Lead Marketing',
  whatsapp: '+1 (786) 543-2478',
  phone: '+1 (786) 987-6934',
  email: 'info@effectiveleadmarketing.com',
  address: '1000 Brickell Ave #75, Miami FL 33131'
};

/**
 * Email Signature HTML Component
 */
function getSignature() {
  return `
  <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${CONTACT.name}</p>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">${CONTACT.title}, ${CONTACT.company}</p>
    
    <table style="font-size: 13px; color: #4b5563;">
      <tr>
        <td style="padding: 3px 0; vertical-align: top;">
          <span style="color: #9ca3af;">📱</span>
        </td>
        <td style="padding: 3px 8px;">
          <a href="https://wa.me/17865432478" style="color: #2563eb; text-decoration: none;">WhatsApp: ${CONTACT.whatsapp}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 3px 0; vertical-align: top;">
          <span style="color: #9ca3af;">📞</span>
        </td>
        <td style="padding: 3px 8px;">
          <a href="tel:+17869876934" style="color: #4b5563; text-decoration: none;">${CONTACT.phone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 3px 0; vertical-align: top;">
          <span style="color: #9ca3af;">✉️</span>
        </td>
        <td style="padding: 3px 8px;">
          <a href="mailto:${CONTACT.email}" style="color: #2563eb; text-decoration: none;">${CONTACT.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 3px 0; vertical-align: top;">
          <span style="color: #9ca3af;">📍</span>
        </td>
        <td style="padding: 3px 8px; color: #6b7280;">
          ${CONTACT.address}
        </td>
      </tr>
    </table>
  </div>
  
  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6; font-size: 11px; color: #9ca3af; text-align: center;">
    <p style="margin: 0;">${CONTACT.company} | ${CONTACT.address}</p>
    <p style="margin: 4px 0 0 0;">Reply "stop" to unsubscribe</p>
  </div>`;
}

/**
 * Extract company name from email domain
 */
function extractCompanyFromEmail(email) {
  const domain = email.split('@')[1];
  if (!domain) return 'your company';
  
  // Remove common TLDs and clean up
  let company = domain
    .replace(/\.(com|net|org|io|co|ai|us|uk|ca|de|fr|es|it|nl|be|ch|at|au|nz|jp|kr|cn|in|br|mx|ar|cl|pe|co\.uk|com\.au|co\.nz|co\.jp|com\.br|com\.mx)$/i, '')
    .replace(/\./g, ' ')
    .replace(/-/g, ' ');
  
  // Capitalize each word
  company = company.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return company;
}

/**
 * Extract first name from full name or generate greeting
 */
function extractFirstName(fullName, email) {
  if (fullName && fullName !== 'Unknown') {
    return fullName.split(' ')[0];
  }
  // Try to extract from email
  const localPart = email.split('@')[0];
  const namePart = localPart.split(/[._-]/)[0];
  if (namePart && namePart.length > 2) {
    return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
  }
  return 'there';
}

/**
 * Get industry-specific pain points based on company/domain
 */
function getIndustryContext(email, company) {
  const domain = email.toLowerCase();
  
  if (domain.includes('insurance') || domain.includes('allstate') || domain.includes('farmers') || domain.includes('goosehead') || domain.includes('prudential')) {
    return {
      industry: 'insurance',
      painPoint: 'policy renewals slipping through the cracks',
      benefit: 'automated follow-ups that never miss a renewal opportunity',
      metric: 'policy retention rates'
    };
  }
  if (domain.includes('real') || domain.includes('realty') || domain.includes('kw.com') || domain.includes('exp') || domain.includes('ebby')) {
    return {
      industry: 'real estate',
      painPoint: 'leads going cold before you can follow up',
      benefit: 'instant response to every inquiry, 24/7',
      metric: 'lead-to-showing conversion'
    };
  }
  if (domain.includes('health') || domain.includes('care') || domain.includes('medical') || domain.includes('senior')) {
    return {
      industry: 'healthcare',
      painPoint: 'patient inquiries falling through the cracks',
      benefit: 'automated scheduling and follow-ups',
      metric: 'patient acquisition cost'
    };
  }
  if (domain.includes('marketing') || domain.includes('media') || domain.includes('agency') || domain.includes('digital')) {
    return {
      industry: 'marketing',
      painPoint: 'spending too much time on lead gen instead of client work',
      benefit: 'consistent pipeline without the manual hustle',
      metric: 'client acquisition efficiency'
    };
  }
  if (domain.includes('staff') || domain.includes('recruit') || domain.includes('hr') || domain.includes('talent')) {
    return {
      industry: 'staffing',
      painPoint: 'candidates ghosting before interviews',
      benefit: 'automated candidate engagement that keeps them warm',
      metric: 'placement rates'
    };
  }
  if (domain.includes('financial') || domain.includes('wealth') || domain.includes('invest') || domain.includes('capital')) {
    return {
      industry: 'financial services',
      painPoint: 'high-value prospects going to competitors who respond faster',
      benefit: 'instant, personalized responses to every inquiry',
      metric: 'prospect-to-client conversion'
    };
  }
  
  // Default B2B
  return {
    industry: 'business services',
    painPoint: 'qualified leads going cold due to slow follow-up',
    benefit: 'automated lead response that works around the clock',
    metric: 'lead conversion rates'
  };
}

/**
 * Video Thumbnail HTML Component - Pure HTML/CSS (no external images)
 */
function getVideoThumbnail(size = 'large') {
  const maxWidth = size === 'large' ? '480px' : '320px';
  const height = size === 'large' ? '270px' : '180px';
  
  return `
  <div style="margin: 24px 0; text-align: center;">
    <a href="${VIDEO_URL}" target="_blank" style="display: inline-block; text-decoration: none; width: 100%; max-width: ${maxWidth};">
      <div style="position: relative; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); height: ${height};">
        <!-- Video preview content -->
        <div style="position: absolute; top: 20px; left: 20px; right: 20px;">
          <p style="margin: 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Video Presentation</p>
          <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 600;">How We Generate 50+ Qualified Leads Per Month</p>
          <p style="margin: 8px 0 0 0; color: #64748b; font-size: 13px;">Effective Lead Marketing</p>
        </div>
        
        <!-- Play button -->
        <div style="position: absolute; bottom: 30px; left: 50%; margin-left: -32px; width: 64px; height: 64px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 50%; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.5);">
          <div style="position: absolute; top: 50%; left: 50%; margin-top: -10px; margin-left: -6px; width: 0; height: 0; border-left: 20px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent;"></div>
        </div>
        
        <!-- Duration badge -->
        <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px;">
          2:15
        </div>
      </div>
      <p style="margin: 12px 0 0 0; color: #2563eb; font-size: 14px; font-weight: 500;">▶ Click to watch video</p>
    </a>
  </div>`;
}

/**
 * Resources Box HTML Component - PDF and Audio Resources
 */
function getResourcesBox() {
  return `
  <div style="margin: 28px 0; padding: 24px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border: 1px solid #e2e8f0;">
    <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #1e293b;">📚 Free Resources For You:</p>
    
    <div style="margin-bottom: 12px;">
      <a href="${PDF_URL}" style="display: inline-flex; align-items: center; text-decoration: none; color: #2563eb; font-size: 14px; font-weight: 500;">
        <span style="display: inline-block; width: 24px; height: 24px; background: #fee2e2; border-radius: 6px; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px;">📄</span>
        Lead Machine Infrastructure Guide (PDF)
      </a>
    </div>
    
    <div style="margin-bottom: 12px;">
      <a href="${AUDIO_1_URL}" style="display: inline-flex; align-items: center; text-decoration: none; color: #2563eb; font-size: 14px; font-weight: 500;">
        <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 6px; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px;">🎧</span>
        AI Infrastructure Cost Analysis (Audio)
      </a>
    </div>
    
    <div>
      <a href="${AUDIO_2_URL}" style="display: inline-flex; align-items: center; text-decoration: none; color: #2563eb; font-size: 14px; font-weight: 500;">
        <span style="display: inline-block; width: 24px; height: 24px; background: #dbeafe; border-radius: 6px; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px;">🎧</span>
        7-Day Enterprise Sales System (Audio)
      </a>
    </div>
  </div>`;
}

/**
 * AI Sales Agent CTA - Talk to Alex
 */
function getAgentCTA() {
  return `
  <div style="margin: 28px 0; text-align: center;">
    <a href="${TALK_TO_ALEX_URL}" target="_blank" style="display: inline-block; text-decoration: none; width: 100%; max-width: 400px;">
      <div style="background: linear-gradient(135deg, #00C6B3 0%, #00A89C 100%); border-radius: 12px; padding: 24px; box-shadow: 0 4px 15px rgba(0, 198, 179, 0.3);">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
          <span style="display: inline-block; width: 12px; height: 12px; background: #22c55e; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 8px #22c55e;"></span>
          <span style="color: white; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">AI Consultant Online</span>
        </div>
        <p style="margin: 0 0 8px 0; color: white; font-size: 20px; font-weight: 600;">🎙️ Talk to Alex Now</p>
        <p style="margin: 0; color: rgba(255,255,255,0.85); font-size: 14px;">Have a real conversation with our AI sales consultant</p>
      </div>
      <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">Voice or text • Available 24/7 • Get instant answers</p>
    </a>
  </div>`;
}

/**
 * Email Sequence Templates
 */
const emailSequence = [
  // EMAIL 1: Initial Outreach - Soft Introduction with Video
  {
    id: 'email-1-intro',
    day: 0,
    subject: (data) => `Quick question about ${data.company}`,
    html: (data) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #374151; max-width: 560px; margin: 0 auto; padding: 32px 20px; background: #ffffff;">
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${data.firstName},</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I came across ${data.company} and noticed you're in the ${data.context.industry} space. Impressive work.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I'm curious—how are you currently handling ${data.context.painPoint}?</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">We've been helping similar companies solve this with ${data.context.benefit}. I recorded a quick 2-minute video explaining the approach:</p>

  ${getVideoThumbnail()}

  <p style="margin: 0 0 20px 0; font-size: 16px;">If it resonates, I'd love to hear your thoughts.</p>

  ${getSignature()}

</body>
</html>`
  },

  // EMAIL 2: Value Add - Share Insight (Day 3)
  {
    id: 'email-2-value',
    day: 3,
    subject: (data) => `Re: Quick question about ${data.company}`,
    html: (data) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #374151; max-width: 560px; margin: 0 auto; padding: 32px 20px; background: #ffffff;">
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${data.firstName},</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Following up on my previous note. I wanted to share something I thought might be useful for ${data.company}.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">We recently helped a ${data.context.industry} company improve their ${data.context.metric} by implementing automated lead response. The results:</p>
  
  <div style="margin: 20px 0; padding: 16px 20px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #2563eb;">
    <p style="margin: 0 0 8px 0; font-size: 15px;">→ Response time dropped from hours to under 5 minutes</p>
    <p style="margin: 0 0 8px 0; font-size: 15px;">→ 3x more qualified conversations per month</p>
    <p style="margin: 0; font-size: 15px;">→ No additional hiring needed</p>
  </div>

  <p style="margin: 0 0 20px 0; font-size: 16px;">Here's the video walkthrough if you missed it:</p>

  ${getVideoThumbnail('small')}

  <p style="margin: 0 0 20px 0; font-size: 16px;">I also put together some resources that might help:</p>

  ${getResourcesBox()}

  <p style="margin: 0 0 20px 0; font-size: 16px;">Would a quick 15-minute call make sense to explore if this could work for you?</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">
    <a href="${CALENDLY_URL}" style="color: #2563eb; text-decoration: none; font-weight: 500;">→ Grab a time here</a>
  </p>

  ${getSignature()}

</body>
</html>`
  },

  // EMAIL 3: Social Proof (Day 7)
  {
    id: 'email-3-proof',
    day: 7,
    subject: (data) => `How ${data.context.industry} companies are solving this`,
    html: (data) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #374151; max-width: 560px; margin: 0 auto; padding: 32px 20px; background: #ffffff;">
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${data.firstName},</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I keep seeing the same pattern with ${data.context.industry} companies:</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px; font-style: italic; color: #6b7280;">"We know we're losing leads, but we don't have time to fix it."</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">The irony? The fix actually gives you time back.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Here's what we've been building for companies like ${data.company}:</p>
  
  <ul style="margin: 0 0 20px 0; padding-left: 20px; font-size: 15px; color: #4b5563;">
    <li style="margin-bottom: 8px;">Leads get an instant, personalized response (not a generic autoresponder)</li>
    <li style="margin-bottom: 8px;">AI qualifies them based on your criteria</li>
    <li style="margin-bottom: 8px;">Hot prospects get booked directly on your calendar</li>
    <li style="margin-bottom: 8px;">You only talk to people ready to buy</li>
  </ul>

  <p style="margin: 0 0 20px 0; font-size: 16px;">The system goes live in 7 days. No ongoing management from your team.</p>

  ${getVideoThumbnail('small')}

  <p style="margin: 0 0 20px 0; font-size: 16px;">Have questions? Talk to our AI consultant Alex - available 24/7:</p>

  ${getAgentCTA()}

  <p style="margin: 0 0 20px 0; font-size: 16px;">Or if you prefer, <a href="${CALENDLY_URL}" style="color: #2563eb; text-decoration: none; font-weight: 500;">book a call directly →</a></p>

  ${getSignature()}

</body>
</html>`
  },

  // EMAIL 4: Direct Ask (Day 12)
  {
    id: 'email-4-direct',
    day: 12,
    subject: (data) => `15 minutes, ${data.firstName}?`,
    html: (data) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #374151; max-width: 560px; margin: 0 auto; padding: 32px 20px; background: #ffffff;">
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${data.firstName},</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I'll keep this brief.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I've reached out a few times about our lead automation system. I'm not sure if the timing is right or if this just isn't a priority for ${data.company} right now.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Either way, I'd rather know than keep following up.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;"><strong>Quick question:</strong> Is improving ${data.context.metric} something you're actively working on this quarter?</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">If yes, <a href="${CALENDLY_URL}" style="color: #2563eb; text-decoration: none; font-weight: 500;">let's find 15 minutes</a> to see if we can help.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Or chat with our AI consultant first - no commitment:</p>

  ${getAgentCTA()}

  <p style="margin: 0 0 20px 0; font-size: 16px;">If this isn't a priority, just let me know and I'll stop reaching out.</p>

  ${getSignature()}

</body>
</html>`
  },

  // EMAIL 5: Breakup Email (Day 18)
  {
    id: 'email-5-breakup',
    day: 18,
    subject: (data) => `Closing the loop`,
    html: (data) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #374151; max-width: 560px; margin: 0 auto; padding: 32px 20px; background: #ffffff;">
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${data.firstName},</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I haven't heard back, which usually means one of three things:</p>
  
  <ol style="margin: 0 0 20px 0; padding-left: 20px; font-size: 15px; color: #4b5563;">
    <li style="margin-bottom: 8px;">This isn't a priority right now</li>
    <li style="margin-bottom: 8px;">You're handling lead response internally and it's working well</li>
    <li style="margin-bottom: 8px;">My emails got buried (happens to the best of us)</li>
  </ol>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Whatever the case, I'm going to close the loop on my end.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Before I do, I wanted to leave you with some resources in case they're helpful down the road:</p>

  ${getResourcesBox()}
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">If things change and ${data.company} wants to explore automating your lead response, I'm always happy to chat.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Here's my calendar for whenever you're ready: <a href="${CALENDLY_URL}" style="color: #2563eb; text-decoration: none; font-weight: 500;">calendly.com/effective-leads</a></p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Wishing you and the ${data.company} team continued success.</p>

  ${getSignature()}

</body>
</html>`
  }
];

/**
 * Generate personalized email data for a lead
 */
function personalizeForLead(lead, sequenceIndex = 0) {
  const email = lead.email;
  const company = extractCompanyFromEmail(email);
  const firstName = extractFirstName(lead.name, email);
  const context = getIndustryContext(email, company);
  
  const data = {
    email,
    firstName,
    company,
    context,
    linkedin: lead.linkedin
  };
  
  const template = emailSequence[sequenceIndex];
  
  return {
    to: email,
    subject: template.subject(data),
    html: template.html(data),
    sequenceId: template.id,
    day: template.day,
    data
  };
}

module.exports = {
  emailSequence,
  personalizeForLead,
  extractCompanyFromEmail,
  extractFirstName,
  getIndustryContext,
  getVideoThumbnail,
  getResourcesBox,
  getSignature,
  getAgentCTA,
  VIDEO_URL,
  VIDEO_THUMBNAIL,
  CALENDLY_URL,
  PDF_URL,
  AUDIO_1_URL,
  AUDIO_2_URL,
  RESOURCES_PAGE_URL,
  TALK_TO_ALEX_URL,
  AGENT_ID,
  SITE_URL,
  CONTACT
};
