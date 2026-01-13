# 🚀 Effective Lead Automation System

Automated lead capture and email outreach system powered by **Apify** and **Resend**. Designed to run autonomously via GitHub Actions.

## 📋 Overview

This system automates the B2B lead generation pipeline:

1. **Lead Scraping** - Captures leads from Google Maps, business directories, and websites using Apify actors
2. **Email Outreach** - Sends personalized, professional emails using Resend API
3. **Campaign Tracking** - Logs all activities and maintains lead status
4. **Automated Scheduling** - Runs daily via GitHub Actions (Monday-Friday, 9 AM EST)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Apify API     │────▶│  Lead Database  │────▶│   Resend API    │
│   (Scraping)    │     │   (JSON/Cache)  │     │   (Emails)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                       │
         └──────────────────────┼───────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   GitHub Actions      │
                    │   (Automation)        │
                    └───────────────────────┘
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/effective-lead-automation.git
cd effective-lead-automation
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Run the pipeline**
```bash
# Full pipeline (scrape + email)
npm run full-pipeline

# Scrape only
npm run scrape

# Send emails only
npm run send-emails
```

### GitHub Actions Setup

1. **Add Repository Secrets** (Settings → Secrets → Actions):
   - `APIFY_API_TOKEN` - Your Apify API token
   - `RESEND_API_KEY` - Your Resend API key
   - `FROM_EMAIL` - Sender email (must be verified in Resend)
   - `FROM_NAME` - Sender display name

2. **Add Repository Variables** (optional):
   - `TARGET_INDUSTRY` - Industries to target (comma-separated)
   - `TARGET_LOCATION` - Geographic location

3. **Enable GitHub Actions** in your repository

4. **Manual Run**: Go to Actions → Lead Automation Pipeline → Run workflow

## 📁 Project Structure

```
effective-lead-automation/
├── .github/
│   └── workflows/
│       ├── lead-automation.yml    # Main automation workflow
│       └── weekly-report.yml      # Weekly statistics report
├── src/
│   ├── index.ts           # Main entry point
│   ├── config.ts          # Configuration management
│   ├── types.ts           # TypeScript interfaces
│   ├── scraper.ts         # Apify lead scraper
│   ├── emailSender.ts     # Resend email sender
│   ├── templates.ts       # Email templates
│   └── storage.ts         # Data persistence
├── data/                  # Generated data (gitignored)
│   ├── leads.json
│   ├── sent_emails.json
│   └── campaign_log.json
├── .env.example           # Environment template
├── package.json
└── README.md
```

## 📧 Email Templates

The system includes 3 professional B2B email templates:

1. **Initial Outreach** - Value proposition introduction
2. **Follow-up #1** - Case study share
3. **Follow-up #2** - Last touch / break-up email

Templates support personalization variables:
- `{{firstName}}` - Lead's first name
- `{{companyName}}` - Company name
- `{{industry}}` - Industry vertical

## ⚙️ Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `APIFY_API_TOKEN` | Apify API authentication | Required |
| `RESEND_API_KEY` | Resend API authentication | Required |
| `FROM_EMAIL` | Sender email address | Required |
| `FROM_NAME` | Sender display name | Effective Lead Marketing |
| `TARGET_INDUSTRY` | Industries to scrape | SaaS,Consulting |
| `TARGET_LOCATION` | Geographic target | United States |
| `MIN_COMPANY_SIZE` | Minimum employees | 10 |
| `MAX_COMPANY_SIZE` | Maximum employees | 500 |

## 🔒 Security

- API keys are stored as GitHub Secrets
- Lead data is cached securely in GitHub Actions
- No sensitive data is committed to the repository
- Emails include unsubscribe option for compliance

## 📊 Monitoring

- **GitHub Actions Summary**: Each run generates a report
- **Weekly Reports**: Automated weekly statistics
- **Artifacts**: Campaign data preserved for 30 days

## 🛡️ Rate Limits

- **Apify**: Respects API rate limits automatically
- **Resend**: 30-second delay between emails
- **Daily Cap**: 50 emails/day (configurable)

## 📝 License

MIT License - Effective Lead Marketing

---

**Built with ❤️ by Effective Lead Marketing**
