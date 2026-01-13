const { Resend } = require('resend');

const resend = new Resend('re_hZVa3mQJ_LLxzq5HarN3yyZX7LgmKk6i3');

const CALENDLY_URL = 'https://calendly.com/convoycubano/effective-leads-manager';
const VIDEO_URL = 'https://app.heygen.com/share/6e14c1dcfe7642609cd2296150b51d95';
const VIDEO_THUMBNAIL = 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=560&h=315&fit=crop';

async function sendTestEmail() {
  const firstName = 'Neiver';
  const companyName = 'Your Company';
  const industry = 'Technology';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #374151; max-width: 560px; margin: 0 auto; padding: 32px 20px; background: #ffffff;">
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${firstName},</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I came across ${companyName} and was impressed by what you're building in the ${industry} space.</p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">I wanted to reach out because we've been helping companies like yours solve a specific problem: <strong>leads going cold because follow-up takes too long.</strong></p>
  
  <p style="margin: 0 0 20px 0; font-size: 16px;">We built an infrastructure that responds to and qualifies leads automatically—usually within minutes instead of hours or days.</p>

  <!-- Simple Video Link -->
  <div style="margin: 28px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
    <p style="margin: 0 0 12px 0; font-size: 15px; color: #6b7280;">I recorded a quick 2-minute video explaining how it works:</p>
    <a href="${VIDEO_URL}" style="color: #2563eb; font-size: 15px; text-decoration: none; font-weight: 500;">→ Watch the video</a>
  </div>

  <p style="margin: 0 0 20px 0; font-size: 16px;">A few results from recent clients:</p>
  
  <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 15px; color: #4b5563;">
    <li style="margin-bottom: 8px;">3-4x more qualified conversations per month</li>
    <li style="margin-bottom: 8px;">Response time dropped from hours to under 5 minutes</li>
    <li style="margin-bottom: 8px;">No additional hiring needed</li>
  </ul>

  <p style="margin: 0 0 24px 0; font-size: 16px;">If this sounds relevant, I'd be happy to show you how it could work for ${companyName}. No pitch—just a 15-minute walkthrough.</p>
  
  <p style="margin: 0 0 24px 0; font-size: 16px;">
    <a href="${CALENDLY_URL}" style="color: #2563eb; text-decoration: none; font-weight: 500;">Here's my calendar</a> if you'd like to find a time.
  </p>

  <p style="margin: 0 0 8px 0; font-size: 16px;">Best,</p>
  <p style="margin: 0; font-size: 16px; font-weight: 500;">The Effective Lead Team</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #9ca3af;">
    <p style="margin: 0;">Effective Lead Marketing</p>
    <p style="margin: 4px 0 0 0;">Reply "stop" to unsubscribe</p>
  </div>

</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: 'Effective Lead Marketing <info@effectiveleadmarketing.com>',
      to: ['convoycubano@gmail.com'],
      subject: `${companyName} - Stop Losing Leads to Slow Response Times`,
      html: html,
    });
    console.log('✅ Email sent successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendTestEmail();
