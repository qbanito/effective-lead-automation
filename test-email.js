const { Resend } = require('resend');

const resend = new Resend('re_hZVa3mQJ_LLxzq5HarN3yyZX7LgmKk6i3');

const CALENDLY_URL = 'https://calendly.com/convoycubano/effective-leads-manager';
const VIDEO_URL = 'https://app.heygen.com/share/6e14c1dcfe7642609cd2296150b51d95';
const VIDEO_THUMBNAIL = 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=560&h=315&fit=crop';

async function sendTestEmail() {
  const firstName = 'Neiver';
  const companyName = 'Your Company';
  const industry = 'Technology';

  const html = <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <p style="margin-bottom: 16px;">Hi ,</p>
  
  <p style="margin-bottom: 16px;">I noticed <strong></strong> is doing great work in the  space.</p>
  
  <p style="margin-bottom: 16px; color: #3b82f6; font-weight: 600;">Quick question: How many qualified leads slip through the cracks because follow-up happens hours or days too late?</p>
  
  <!-- Video Section -->
  <div style="margin: 24px 0; text-align: center;">
    <p style="margin-bottom: 12px; font-weight: 600; color: #1e293b;"> Watch this 2-minute explanation:</p>
    <a href="" target="_blank" style="display: block; text-decoration: none;">
      <div style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        <img src="" alt="Watch Video" style="width: 100%; height: auto; display: block;" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(59, 130, 246, 0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <div style="width: 0; height: 0; border-left: 20px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent; margin-left: 4px;"></div>
        </div>
      </div>
      <p style="margin-top: 8px; color: #3b82f6; font-size: 14px;"> Click to watch video</p>
    </a>
  </div>

  <p style="margin-bottom: 16px;">At <strong>Effective Lead Marketing</strong>, we deploy autonomous growth infrastructure that handles acquisition, qualification, and bookinglive in 7 days.</p>
  
  <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #3b82f6;">
    <p style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">Our clients typically see:</p>
    <ul style="margin: 0; padding-left: 20px; color: #475569;">
      <li> <strong>342% increase</strong> in qualified pipeline</li>
      <li> <strong>40% reduction</strong> in acquisition costs</li>
      <li> <strong>24/7 lead response</strong> without hiring</li>
    </ul>
  </div>

  <p style="margin-bottom: 24px;">Would you be open to a 15-minute call to see if this could work for ?</p>
  
  <!-- Primary CTA Button -->
  <div style="text-align: center; margin: 32px 0;">
    <a href="" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">
       Schedule Your Free Strategy Call
    </a>
    <p style="margin-top: 12px; font-size: 13px; color: #64748b;">
       Takes 30 seconds  No commitment required
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
</html>;

  try {
    const result = await resend.emails.send({
      from: 'Effective Lead Marketing <onboarding@resend.dev>',
      to: ['convoycubano@gmail.com'],
      subject: ${companyName} - Stop Losing Leads to Slow Response Times,
      html: html,
    });
    console.log(' Email sent successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(' Error sending email:', error);
  }
}

sendTestEmail();
