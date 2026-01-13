/**
 * Send Test Emails - All 5 Email Sequence
 * Sends to convoycubano@gmail.com for preview
 */

const { Resend } = require('resend');
const { personalizeForLead, emailSequence } = require('./email-templates.cjs');

const resend = new Resend('re_hZVa3mQJ_LLxzq5HarN3yyZX7LgmKk6i3');

// Test lead data
const testLead = {
  name: 'Alex Manager',
  email: 'alex@insuranceagency.com', // Simulated domain for personalization
  linkedin: 'https://linkedin.com/in/alex-manager'
};

const testRecipient = 'convoycubano@gmail.com';

async function sendTestEmails() {
  console.log('📧 Sending 5 test emails to:', testRecipient);
  console.log('━'.repeat(50));
  
  for (let i = 0; i < emailSequence.length; i++) {
    const emailData = personalizeForLead(testLead, i);
    
    // Override recipient to test email
    const subject = `[TEST Email ${i + 1}/5 - Day ${emailData.day}] ${emailData.subject}`;
    
    try {
      const result = await resend.emails.send({
        from: 'Effective Lead Marketing <info@effectiveleadmarketing.com>',
        to: testRecipient,
        subject: subject,
        html: emailData.html
      });
      
      console.log(`✅ Email ${i + 1}/5 sent (Day ${emailData.day})`);
      console.log(`   Subject: ${emailData.subject}`);
      console.log(`   ID: ${result.data?.id || 'N/A'}`);
      console.log('');
      
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Email ${i + 1} failed:`, error.message);
    }
  }
  
  console.log('━'.repeat(50));
  console.log('✅ All test emails sent! Check your inbox.');
}

sendTestEmails();
