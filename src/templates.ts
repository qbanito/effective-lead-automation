import { EmailTemplate } from './types.js';

/**
 * Professional Email Templates for B2B Lead Outreach
 * Effective Lead Marketing - High-Converting Templates
 */

// Calendly booking link
const CALENDLY_URL = 'https://calendly.com/convoycubano/effective-leads-manager';

// HeyGen video embed
const VIDEO_THUMBNAIL = 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=560&h=315&fit=crop';
const VIDEO_URL = 'https://app.heygen.com/share/6e14c1dcfe7642609cd2296150b51d95';

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'initial-outreach',
    name: 'Initial Outreach - Value Proposition',
    subject: '{{companyName}} - Stop Losing Leads to Slow Response Times',
    variables: ['firstName', 'companyName', 'industry'],
    textContent: `Hi {{firstName}},

I noticed {{companyName}} is doing great work in the {{industry}} space. 

Quick question: How many qualified leads slip through the cracks because follow-up happens hours or days too late?

I recorded a quick 2-minute video explaining how we solve this: ${VIDEO_URL}

At Effective Lead Marketing, we deploy autonomous growth infrastructure that handles acquisition, qualification, and booking—live in 7 days.

Our clients typically see:
• 342% increase in qualified pipeline
• 40% reduction in acquisition costs  
• 24/7 lead response without hiring

Would you be open to a 15-minute call to see if this could work for {{companyName}}?

👉 Book a time here: ${CALENDLY_URL}

Best regards,
The Effective Lead Team

P.S. We only accept 2 new clients per cycle due to implementation intensity.

---
Effective Lead Marketing
www.effectiveleadmarketing.com
Unsubscribe: Reply "STOP" to opt out`,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <p style="margin-bottom: 16px;">Hi {{firstName}},</p>
  
  <p style="margin-bottom: 16px;">I noticed <strong>{{companyName}}</strong> is doing great work in the {{industry}} space.</p>
  
  <p style="margin-bottom: 16px; color: #3b82f6; font-weight: 600;">Quick question: How many qualified leads slip through the cracks because follow-up happens hours or days too late?</p>
  
  <!-- Video Section -->
  <div style="margin: 24px 0; text-align: center;">
    <p style="margin-bottom: 12px; font-weight: 600; color: #1e293b;">🎬 Watch this 2-minute explanation:</p>
    <a href="${VIDEO_URL}" target="_blank" style="display: block; text-decoration: none;">
      <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        <img src="${VIDEO_THUMBNAIL}" alt="Watch Video" style="width: 100%; height: auto; display: block;" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(59, 130, 246, 0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <div style="width: 0; height: 0; border-left: 20px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent; margin-left: 4px;"></div>
        </div>
      </div>
      <p style="margin-top: 8px; color: #3b82f6; font-size: 14px;">▶️ Click to watch video</p>
    </a>
  </div>
  
  <p style="margin-bottom: 16px;">At <strong>Effective Lead Marketing</strong>, we deploy autonomous growth infrastructure that handles acquisition, qualification, and booking—live in 7 days.</p>
  
  <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #3b82f6;">
    <p style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">Our clients typically see:</p>
    <ul style="margin: 0; padding-left: 20px; color: #475569;">
      <li>📈 <strong>342% increase</strong> in qualified pipeline</li>
      <li>💰 <strong>40% reduction</strong> in acquisition costs</li>
      <li>🤖 <strong>24/7 lead response</strong> without hiring</li>
    </ul>
  </div>
  
  <p style="margin-bottom: 24px;">Would you be open to a 15-minute call to see if this could work for {{companyName}}?</p>
  
  <!-- Primary CTA Button -->
  <div style="text-align: center; margin: 32px 0;">
    <a href="${CALENDLY_URL}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">
      📅 Schedule Your Free Strategy Call
    </a>
    <p style="margin-top: 12px; font-size: 13px; color: #64748b;">
      ⚡ Takes 30 seconds • No commitment required
    </p>
  </div>
  
  <p style="margin-top: 24px; margin-bottom: 8px;">Best regards,<br><strong>The Effective Lead Team</strong></p>
  
  <p style="font-size: 12px; color: #64748b; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
    P.S. We only accept 2 new clients per cycle due to implementation intensity.
  </p>
  
  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;">Effective Lead Marketing<br>
    <a href="https://www.effectiveleadmarketing.com" style="color: #3b82f6;">www.effectiveleadmarketing.com</a></p>
    <p style="margin: 8px 0 0 0;">Unsubscribe: Reply "STOP" to opt out</p>
  </div>
  
</body>
</html>`
  },
  
  {
    id: 'follow-up-1',
    name: 'Follow-up #1 - Case Study + Video',
    subject: 'Re: {{companyName}} - Quick case study (+ video)',
    variables: ['firstName', 'companyName'],
    textContent: `Hi {{firstName}},

Following up on my previous email about automating {{companyName}}'s lead acquisition.

Just wanted to share a quick win from last month:

A consulting firm in your space went from 12 qualified calls/month to 47 in just 21 days after we deployed their system.

The difference? Instant AI-powered qualification + automated booking.

🎬 Quick 2-min video if you missed it: ${VIDEO_URL}

If you're curious how this would look for {{companyName}}, I'd be happy to walk you through a quick demo.

👉 Book your spot: ${CALENDLY_URL}

No pressure—just 15 minutes to see if it makes sense.

Best,
The Effective Lead Team

---
Effective Lead Marketing
www.effectiveleadmarketing.com`,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <p style="margin-bottom: 16px;">Hi {{firstName}},</p>
  
  <p style="margin-bottom: 16px;">Following up on my previous email about automating <strong>{{companyName}}'s</strong> lead acquisition.</p>
  
  <p style="margin-bottom: 16px;">Just wanted to share a quick win from last month:</p>
  
  <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #f59e0b;">
    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #92400e;">
      📊 A consulting firm in your space went from <strong>12 qualified calls/month</strong> to <strong>47</strong> in just 21 days.
    </p>
  </div>
  
  <p style="margin-bottom: 16px;">The difference? <strong>Instant AI-powered qualification + automated booking.</strong></p>
  
  <!-- Video Reminder -->
  <div style="margin: 24px 0; text-align: center; background: #f8fafc; border-radius: 12px; padding: 20px;">
    <p style="margin: 0 0 12px 0; font-weight: 600; color: #1e293b;">🎬 Missed the video? Watch it here:</p>
    <a href="${VIDEO_URL}" target="_blank" style="display: inline-block; background: #1e293b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
      ▶️ Watch 2-Min Explainer
    </a>
  </div>
  
  <p style="margin-bottom: 24px;">If you're curious how this would look for {{companyName}}, I'd be happy to walk you through a quick demo.</p>
  
  <!-- Primary CTA -->
  <div style="text-align: center; margin: 32px 0;">
    <a href="${CALENDLY_URL}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">
      📅 Book Your 15-Min Demo
    </a>
  </div>
  
  <p style="margin-bottom: 24px; color: #64748b;">No pressure—just 15 minutes to see if it makes sense.</p>
  
  <p style="margin-top: 24px;">Best,<br><strong>The Effective Lead Team</strong></p>
  
  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;">Effective Lead Marketing<br>
    <a href="https://www.effectiveleadmarketing.com" style="color: #3b82f6;">www.effectiveleadmarketing.com</a></p>
  </div>
  
</body>
</html>`
  },

  {
    id: 'follow-up-2',
    name: 'Follow-up #2 - Last Touch',
    subject: 'Last one from me, {{firstName}}',
    variables: ['firstName', 'companyName'],
    textContent: `Hi {{firstName}},

I know you're busy running {{companyName}}, so I'll keep this brief.

I've reached out a couple of times about our autonomous lead generation system. If now isn't the right time, I completely understand.

Just wanted to leave you with this:

Most of our clients come to us after realizing they've been leaving $50K-$200K/year on the table from leads that went cold due to slow follow-up.

If that resonates, my calendar is always open: ${CALENDLY_URL}

Either way, I wish you and {{companyName}} continued success.

Best,
The Effective Lead Team

P.S. I won't follow up again—ball's in your court.

---
Effective Lead Marketing
www.effectiveleadmarketing.com`,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <p style="margin-bottom: 16px;">Hi {{firstName}},</p>
  
  <p style="margin-bottom: 16px;">I know you're busy running <strong>{{companyName}}</strong>, so I'll keep this brief.</p>
  
  <p style="margin-bottom: 16px;">I've reached out a couple of times about our autonomous lead generation system. If now isn't the right time, I completely understand.</p>
  
  <p style="margin-bottom: 16px;">Just wanted to leave you with this:</p>
  
  <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #ef4444;">
    <p style="margin: 0; color: #991b1b; font-weight: 500;">
      Most of our clients come to us after realizing they've been leaving <strong>$50K-$200K/year</strong> on the table from leads that went cold due to slow follow-up.
    </p>
  </div>
  
  <p style="margin-bottom: 24px;">If that resonates, my calendar is always open:</p>
  
  <!-- Final CTA - Urgency -->
  <div style="text-align: center; margin: 32px 0;">
    <a href="${CALENDLY_URL}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);">
      📅 One Last Chance - Book a Call
    </a>
    <p style="margin-top: 10px; font-size: 12px; color: #64748b;">
      ⏰ I won't follow up again after this
    </p>
  </div>
  
  <p style="margin-top: 16px;">Either way, I wish you and {{companyName}} continued success.</p>
  
  <p style="margin-top: 24px;">Best,<br><strong>The Effective Lead Team</strong></p>
  
  <p style="font-size: 12px; color: #64748b; margin-top: 16px; font-style: italic;">
    P.S. I won't follow up again—ball's in your court.
  </p>
  
  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;">Effective Lead Marketing<br>
    <a href="https://www.effectiveleadmarketing.com" style="color: #3b82f6;">www.effectiveleadmarketing.com</a></p>
  </div>
  
</body>
</html>`
  }
];

/**
 * Get template by ID
 */
export function getTemplate(templateId: string): EmailTemplate | undefined {
  return emailTemplates.find(t => t.id === templateId);
}

/**
 * Replace template variables with actual values
 */
export function personalizeTemplate(
  template: EmailTemplate,
  data: Record<string, string>
): { subject: string; html: string; text: string } {
  let subject = template.subject;
  let html = template.htmlContent;
  let text = template.textContent;
  
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(placeholder, value || '');
    html = html.replace(placeholder, value || '');
    text = text.replace(placeholder, value || '');
  }
  
  return { subject, html, text };
}
