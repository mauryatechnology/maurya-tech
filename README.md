# Maurya Technologies — Enterprise Multi-Country Web Platform & Micro-SaaS Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_ReplicaSet-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Live_Payments-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Turnstile_Protected-F38020?style=for-the-badge&logo=cloudflare)](https://www.cloudflare.com/products/turnstile/)

A modern, full-stack Next.js enterprise digital agency platform, micro-SaaS digital product engine, localized programmatic SEO network, and interactive financial/engineering calculator hub for **Maurya Technologies**.

---

## 🌟 Key Architecture & Capabilities

### 1. Global Multi-Country Programmatic Hubs
- Dynamic country-specific directories: `/[country]/tools` and `/[country]/guides` (supporting `in`, `us`, `uk`, `ca`, `au`, `global`).
- Locale-aware currency formatters, dynamic tax slab calculations (including India Budget 2026 New Regime & UK PAYE bands), and dynamic schema markup (`SoftwareApplication`, `FAQPage`, `BreadcrumbList`).

### 2. Interactive Calculator Suite (100% Client-Side, 0ms Latency)
All 10 tools operate entirely in the browser for instant user feedback and zero server overhead:
1. **CTC to In-Hand Salary Calculator** — New 2026 Budget tax slabs, EPF 12%, Professional Tax, and UK PAYE rates.
2. **EMI & Loan Amortization Calculator** — Month-by-month principal vs interest repayment breakdown with export options.
3. **Percentage & Profit/Loss Calculator** — Multi-mode percent calculations, discount computations, and margin estimators.
4. **Age & Date Milestone Calculator** — Exact chronological breakdown with workdays, leap year corrections, and milestone countdowns.
5. **ATS Resume Keyword Scorer** — Real-time keyword density, action verb extraction, and ATS compliance analyzer.
6. **Hourly to Annual Pay Converter** — Dual-mode conversion calibrated for 1099, W2, UK IR35, and Indian contractor billing.
7. **CGPA to Percentage & US 4.0 GPA Converter** — Multi-university conversion formulas (CBSE 9.5, VTU, Mumbai Univ) and WES 4.0 GPA letter grade calibrations.
8. **ATS Resume & CV Builder** — Live split-screen builder with mobile preview toggle, sample tech profile loader, and clean print/PDF export.
9. **Unit Conversion Matrix** — Multi-category engineering conversions (Length, Mass, Temperature, Digital Data, Speed, Area).
10. **Freelance & Retainer Rate Calculator** — Overhead, billable hours, profit margin, and retainer formula generator.

### 3. Digital Product & Checkout Engine
- **Instant Checkout**: Integrates Razorpay checkout modals (`CheckoutModal.jsx`) for seamless UPI, credit card, and net banking payments.
- **Webhook Fulfillment**: Dedicated server-to-server webhook endpoint (`/api/webhooks/razorpay`) with HMAC-SHA256 signature verification for asynchronous payment capture.
- **Secure File Distribution**: Time-limited cryptographic download tokens (valid for 7 days) via `/api/products/download?token=...`.
- **Automated Email Delivery**: Instant purchase receipts and download links sent via Nodemailer SMTP.

### 4. Enterprise Admin CMS with Strict RBAC
- **Role-Based Access Control**: Strict multi-tier permission hierarchy:
  - `superadmin` (Level 3): Platform automation rules, cron management, and system administration.
  - `admin` (Level 2): Market configuration, calculator tools, orders, affiliate monetization, audit logs, and job applications.
  - `editor` (Level 1): Blog posts, content studio generation, projects, and services.
  - `viewer` (Level 0): Read-only access.
- **Monetization & Affiliate Offers CMS**: Track active campaigns, click metrics, EPC, and geo-targeted offers (`/admin/monetization`).
- **AI Content Studio**: Interactive draft generator with live progress bars and Quality Gate scores (`/admin/automation`).
- **Content Versioning & Audit Trail**: Automated snapshots (`ContentVersion`) and immutable audit logs (`AuditLog`) on all administrative modifications.

### 5. Multi-Layer Anti-Bot & Security Architecture
- **Layer 1: Invisible Honeypot Traps** (`website_hp` input) to silently trap automated web scrapers.
- **Layer 2: Cloudflare Turnstile** seamless bot challenge widgets integrated on public contact and career forms (`TurnstileWidget.jsx`).
- **Layer 3: Heuristic Spam Engine**: Real-time scoring based on consonant clusters, disposable domains, Cyrillic characters, and promotional keywords.
- **Layer 4: In-Memory IP Rate Limiting** with progressive backoff.
- **Layer 5: Enterprise Auth**: Bcrypt work factor 12 password hashing, HTTP-only JWT cookies, and SSRF protocol validation on uploaded documents.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Framework** | Next.js 16 (Turbopack, App Router) |
| **UI Library** | React 19, Radix UI primitives, Lucide React, Framer Motion |
| **Styling** | Tailwind CSS with custom theme variables (Dark/Light mode support) |
| **Database** | MongoDB Atlas ReplicaSet with Mongoose 9 |
| **Storage** | Vercel Blob Storage (`@vercel/blob`) |
| **Payment Gateway** | Razorpay Live API & Webhooks |
| **Bot Defense** | Cloudflare Turnstile |
| **Mailing Service** | Nodemailer (Gmail Relay on Port 465 SSL) |
| **Authentication** | Jose JWT + BcryptJS |

---

## 📁 Project Structure

```text
maurya-tech/
├── app/
│   ├── [country]/                # Localized tools and guides (/in, /us, /uk, etc.)
│   ├── admin/                    # Admin CMS dashboard pages
│   │   ├── automation/           # AI Content Studio & cron rules
│   │   ├── blogs/                # Blog post management with version history
│   │   ├── monetization/         # Affiliate offers & ad placements
│   │   ├── markets/              # Country hubs configuration
│   │   ├── orders/               # Customer transactions & downloads
│   │   ├── tools/                # Interactive calculator catalog
│   │   └── audit/                # Immutable security audit log
│   ├── api/                      # Next.js API route handlers
│   │   ├── automation/           # AI draft generation & scheduler
│   │   ├── monetization/         # Affiliate offer CRUD & click tracking
│   │   ├── products/             # Checkout, verification, download tokens
│   │   ├── webhooks/             # Razorpay HMAC signature webhook receiver
│   │   └── contact/              # Honeypot + Turnstile protected contact API
│   ├── blog/                     # Public blog and technical guides
│   ├── careers/                  # Job postings & applicant intake
│   └── contact/                  # Contact and inquiry page
├── components/
│   ├── common/                   # Shared UI (TurnstileWidget, ThemeToggle, etc.)
│   ├── products/                 # Digital products showcase & CheckoutModal
│   ├── tools/                    # CalculatorContainer & 10 calculator engines
│   └── pages/                    # Modular page views (Contact, Projects, Careers)
├── data/                         # Fallback data (countries, tools, products, jobs)
├── lib/
│   ├── auth.js                   # JWT session helpers, role levels & RBAC enforcement
│   ├── turnstile.js              # Cloudflare Turnstile server-side verification
│   ├── mongodb.js                # Cached MongoDB Mongoose connection
│   ├── emailService.js           # SMTP mail relay
│   ├── rateLimit.js              # In-memory IP rate limiter
│   └── models/                   # Mongoose schemas (Order, Post, AffiliateOffer, etc.)
└── scripts/
    └── cleanup_database.mjs      # Safe database purge utility with --dry-run
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer
- **MongoDB**: Active MongoDB Atlas cluster or local instance
- **Razorpay Account**: API Key ID and Key Secret
- **Gmail App Password**: For SMTP notification emails

### 1. Clone & Install
```bash
git clone https://github.com/mauryatechnology/maurya-tech.git
cd maurya-tech
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/maurya-tech

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SUPPORT_EMAIL=your-email@gmail.com

# Authentication
JWT_SECRET=your-secure-random-secret-key-at-least-32-chars

# Razorpay Payments
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Automation Cron
CRON_SECRET=7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🧹 Database Maintenance

To safely audit and clean legacy documents from your MongoDB database without risking active user data:

```bash
# Safe preview mode (read-only, no deletions)
node scripts/cleanup_database.mjs --dry-run

# Live purge (cleans orphaned unaggregated analytics and legacy bot inquiries)
node scripts/cleanup_database.mjs --confirm-live-cleanup
```

---

## 📄 License

Proprietary © 2026 [Maurya Technologies](https://maurya-tech.com). All rights reserved.
>>>>>>> aeb3135 (docs: create comprehensive enterprise README for maurya-tech)
