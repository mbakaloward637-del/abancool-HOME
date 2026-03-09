

# PHP + MySQL Backend Integration Prompt for Kiro

Here is a complete, copy-paste-ready prompt that covers every page in your Abancool Technology app and tells Kiro exactly how to build the PHP/MySQL backend end-to-end.

---

## Full Kiro Prompt

```text
PROJECT: Abancool Technology — PHP + MySQL Backend Integration

Build a complete PHP REST API backend with MySQL database for the Abancool Technology
web hosting management platform. The React frontend communicates via fetch() to a
base URL like https://api.abancool.com (configurable). All responses are JSON.
Use PDO for database access. Use PHP sessions or JWT (Firebase JWT library) for auth.
Passwords hashed with password_hash() / password_verify().

────────────────────────────────────────────
DIRECTORY STRUCTURE
────────────────────────────────────────────

backend/
├── config/
│   ├── database.php          # PDO connection (host, db, user, pass from env)
│   └── cors.php              # CORS headers for React frontend
├── middleware/
│   ├── auth.php              # JWT verification middleware
│   └── admin.php             # Admin role check middleware
├── api/
│   ├── auth/
│   │   ├── register.php      # POST /api/auth/register
│   │   ├── login.php         # POST /api/auth/login
│   │   ├── google.php        # POST /api/auth/google (Google OAuth)
│   │   ├── logout.php        # POST /api/auth/logout
│   │   ├── forgot-password.php
│   │   └── reset-password.php
│   ├── profile/
│   │   ├── get.php           # GET /api/profile
│   │   └── update.php        # PUT /api/profile
│   ├── hosting/
│   │   ├── plans.php         # GET /api/hosting/plans
│   │   ├── orders.php        # GET /api/hosting/orders (user's orders)
│   │   └── purchase.php      # POST /api/hosting/purchase
│   ├── domains/
│   │   ├── list.php          # GET /api/domains (user's domains)
│   │   ├── search.php        # GET /api/domains/search?q=example
│   │   ├── register.php      # POST /api/domains/register
│   │   ├── renew.php         # POST /api/domains/renew
│   │   └── dns.php           # GET/PUT /api/domains/{id}/dns
│   ├── invoices/
│   │   ├── list.php          # GET /api/invoices
│   │   ├── detail.php        # GET /api/invoices/{id}
│   │   └── download.php      # GET /api/invoices/{id}/pdf
│   ├── payments/
│   │   ├── history.php       # GET /api/payments
│   │   ├── mpesa-stk.php     # POST /api/payments/mpesa (initiate STK push)
│   │   ├── mpesa-callback.php# POST /api/payments/mpesa/callback
│   │   ├── stripe-intent.php # POST /api/payments/stripe/intent
│   │   └── stripe-webhook.php# POST /api/payments/stripe/webhook
│   ├── support/
│   │   ├── tickets.php       # GET /api/support/tickets
│   │   ├── create.php        # POST /api/support/tickets
│   │   ├── detail.php        # GET /api/support/tickets/{id}
│   │   └── reply.php         # POST /api/support/tickets/{id}/reply
│   ├── cpanel/
│   │   ├── status.php        # GET /api/cpanel/status (check active hosting)
│   │   ├── stats.php         # GET /api/cpanel/stats (disk, cpu, email, db usage)
│   │   └── sso.php           # GET /api/cpanel/sso (generate cPanel SSO login URL)
│   ├── contact/
│   │   └── submit.php        # POST /api/contact (public contact form)
│   └── admin/
│       ├── dashboard.php     # GET /api/admin/dashboard (stats)
│       ├── clients.php       # GET /api/admin/clients
│       ├── hosting-plans.php # GET/POST/PUT/DELETE /api/admin/hosting-plans
│       ├── orders.php        # GET/PUT /api/admin/orders (activate, suspend)
│       ├── invoices.php      # GET/POST /api/admin/invoices
│       ├── payments.php      # GET /api/admin/payments
│       ├── tickets.php       # GET/PUT /api/admin/tickets
│       ├── domains.php       # GET /api/admin/domains
│       └── activity.php      # GET /api/admin/activity (recent activity log)
└── .env                      # DB_HOST, DB_NAME, DB_USER, DB_PASS, JWT_SECRET,
                              # MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE,
                              # MPESA_PASSKEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
                              # CPANEL_WHM_HOST, CPANEL_WHM_TOKEN, GOOGLE_CLIENT_ID

────────────────────────────────────────────
MySQL DATABASE SCHEMA
────────────────────────────────────────────

CREATE DATABASE abancool_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  company VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  google_id VARCHAR(100) NULL,
  avatar_url VARCHAR(500),
  role ENUM('client','admin') DEFAULT 'client',
  email_verified_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hosting Plans (admin-managed)
CREATE TABLE hosting_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  disk_space_gb INT DEFAULT 5,
  bandwidth_gb INT DEFAULT 20,
  email_accounts INT DEFAULT 5,
  databases_count INT DEFAULT 3,
  features JSON DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hosting Orders
CREATE TABLE hosting_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  domain VARCHAR(255),
  status ENUM('pending','active','suspended','cancelled','expired') DEFAULT 'pending',
  billing_cycle ENUM('monthly','yearly') DEFAULT 'monthly',
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_method ENUM('mpesa','stripe','bank_transfer'),
  payment_reference VARCHAR(100),
  cpanel_username VARCHAR(50),
  cpanel_url VARCHAR(500),
  starts_at DATETIME,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES hosting_plans(id)
);

-- Domains
CREATE TABLE domains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  extension VARCHAR(20) NOT NULL,
  nameservers VARCHAR(500) DEFAULT 'ns1.abancool.com, ns2.abancool.com',
  auto_renew BOOLEAN DEFAULT TRUE,
  status ENUM('active','expiring','expired','pending') DEFAULT 'active',
  registered_at DATETIME,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DNS Records
CREATE TABLE dns_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain_id INT NOT NULL,
  type ENUM('A','AAAA','CNAME','MX','TXT','NS','SRV') NOT NULL,
  name VARCHAR(255) NOT NULL,
  value VARCHAR(500) NOT NULL,
  ttl INT DEFAULT 3600,
  priority INT,
  FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
);

-- Invoices
CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  service_description VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('paid','unpaid','overdue','cancelled') DEFAULT 'unpaid',
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_at DATETIME NOT NULL,
  paid_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  invoice_id INT,
  method ENUM('mpesa','stripe','paypal','bank_transfer') NOT NULL,
  reference VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(5) DEFAULT 'KES',
  status ENUM('pending','completed','failed') DEFAULT 'pending',
  mpesa_receipt VARCHAR(50),
  stripe_payment_id VARCHAR(100),
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

-- Support Tickets
CREATE TABLE support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  department ENUM('billing','technical','sales') NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status ENUM('open','in_progress','waiting','closed') DEFAULT 'open',
  priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ticket Replies
CREATE TABLE ticket_replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Contact Form Submissions
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity Log
CREATE TABLE activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed default plans
INSERT INTO hosting_plans (name, slug, description, price_monthly, price_yearly,
  disk_space_gb, bandwidth_gb, email_accounts, databases_count, features) VALUES
('Starter','starter','Personal websites & blogs',420,4200,5,20,5,3,
  '["1 Website","Free SSL","Daily Backups","24/7 Support"]'),
('Standard','standard','Growing businesses',1200,12000,20,100,15,10,
  '["5 Websites","Free SSL","Daily Backups","Priority Support","Free Domain"]'),
('Business','business','High-traffic websites',2500,25000,50,250,50,25,
  '["Unlimited Websites","Free SSL","Hourly Backups","Priority Support","Free Domain","Staging Environment"]'),
('Enterprise','enterprise','Maximum power',5000,50000,100,500,100,50,
  '["Unlimited Websites","Free SSL","Real-time Backups","Dedicated Support","Free Domain","Staging Environment","Dedicated IP"]');

────────────────────────────────────────────
PAGE-BY-PAGE API MAPPING
────────────────────────────────────────────

1. LOGIN / REGISTER PAGE (ClientLoginPage.tsx)
   - POST /api/auth/register  → {name, email, phone, password}
     Returns: {token, user}
   - POST /api/auth/login     → {email, password}
     Returns: {token, user}
   - POST /api/auth/google    → {google_token}
     Verify with Google, create/find user, return {token, user}
   - POST /api/auth/forgot-password → {email}
   - POST /api/auth/reset-password  → {token, password}
   Frontend: Store JWT in localStorage, send as Authorization: Bearer <token>

2. DASHBOARD OVERVIEW (DashboardOverview.tsx)
   - GET /api/hosting/orders       → count active services
   - GET /api/domains              → count active domains
   - GET /api/invoices?status=unpaid → pending invoices
   - GET /api/payments             → sum total spent
   - GET /api/invoices?limit=5     → recent invoices table

3. CPANEL PAGE (ClientCpanel.tsx)
   - GET /api/cpanel/status  → returns active hosting order with plan details or null
     If null → show "Hosting Required" paywall
   - GET /api/cpanel/stats   → calls WHM API to get disk, cpu, db, email usage
     WHM API: GET https://{whm_host}:2087/json-api/accountsummary?user={cpanel_user}
     Auth: Authorization: whm root:{whm_token}
   - GET /api/cpanel/sso     → generate cPanel session URL via WHM API
     WHM: POST /json-api/create_user_session?user={cpanel_user}&service=cpaneld
     Returns: {url: "https://cpanel.../cpsess.../"}

4. HOSTING PAGE (ClientHosting.tsx)
   - GET /api/hosting/plans         → all active plans
   - POST /api/hosting/purchase     → {plan_id, billing_cycle, domain}
     Creates hosting_order (pending), creates invoice, returns invoice_id
     After payment confirmation → auto-provisions via WHM API:
       POST /json-api/createacct?username=X&domain=Y&plan=Z

5. DOMAINS PAGE (ClientDomains.tsx)
   - GET /api/domains               → user's domains with expiry, status
   - POST /api/domains/renew        → {domain_id}
     Creates invoice for renewal
   - GET /api/domains/{id}/dns      → DNS records for domain
   - PUT /api/domains/{id}/dns      → update DNS records

6. DOMAIN SEARCH (DomainsPage.tsx — public)
   - GET /api/domains/search?q=example
     Check availability via registrar API (e.g., Resellerclub, Enom)
     Returns: [{domain, ext, available, price, premium}]
   - POST /api/domains/register     → {domain, extension, years}
     Creates domain record + invoice

7. INVOICES PAGE (ClientInvoices.tsx)
   - GET /api/invoices              → all user invoices
   - GET /api/invoices/{id}/pdf     → generate PDF (use TCPDF or Dompdf)

8. PAYMENTS PAGE (ClientPayments.tsx)
   - GET /api/payments              → user's payment history

   M-Pesa Integration:
   - POST /api/payments/mpesa       → {invoice_id, phone}
     Steps: Get OAuth token from Daraja API → send STK push
     Daraja: POST https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
   - POST /api/payments/mpesa/callback  → Safaricom callback
     On success: update payment status, update invoice to 'paid',
     activate hosting order, provision cPanel account via WHM

   Stripe Integration:
   - POST /api/payments/stripe/intent  → {invoice_id}
     Create PaymentIntent via Stripe PHP SDK
   - POST /api/payments/stripe/webhook → Stripe webhook
     On payment_intent.succeeded: same activation flow as M-Pesa

9. SUPPORT PAGE (ClientSupport.tsx)
   - GET /api/support/tickets          → user's tickets
   - POST /api/support/tickets         → {department, subject, message}
     Auto-generates ticket_number (TKT-XXX)
   - GET /api/support/tickets/{id}     → ticket detail + replies
   - POST /api/support/tickets/{id}/reply → {message}

10. PROFILE PAGE (ClientProfile.tsx)
    - GET /api/profile                 → user profile data
    - PUT /api/profile                 → {name, email, phone, company}
    - PUT /api/profile/password        → {current_password, new_password}

11. CONTACT PAGE (ContactPage.tsx — public)
    - POST /api/contact                → {name, email, phone, message}
      Stores in contact_messages, optionally sends email notification

12. ADMIN DASHBOARD (AdminDashboard.tsx)
    - GET /api/admin/dashboard → {
        total_clients, hosting_services, active_domains,
        open_invoices, monthly_revenue, open_tickets
      }
    - GET /api/admin/activity?limit=10 → recent activity log

13. ADMIN PAGES (not yet built, but routes exist)
    - GET/POST/PUT/DELETE /api/admin/hosting-plans → CRUD plans
    - GET/PUT /api/admin/orders → list orders, activate/suspend
    - GET/POST /api/admin/invoices → list, create manual invoices
    - GET /api/admin/payments → all payments
    - GET/PUT /api/admin/tickets → manage tickets
    - GET /api/admin/clients → list all clients
    - GET /api/admin/domains → list all domains

────────────────────────────────────────────
PAYMENT → CPANEL AUTO-PROVISIONING FLOW
────────────────────────────────────────────

1. User selects plan → POST /api/hosting/purchase
   → Creates hosting_order (status: pending) + invoice (status: unpaid)
2. User pays → POST /api/payments/mpesa or stripe
3. Callback confirms payment →
   a. payments.status = 'completed'
   b. invoices.status = 'paid'
   c. hosting_orders.status = 'active'
   d. WHM API: POST /json-api/createacct
      → creates cPanel account, returns username + URL
   e. Update hosting_orders: cpanel_username, cpanel_url, starts_at, expires_at
   f. Log activity
   g. Send email confirmation to user

────────────────────────────────────────────
REACT FRONTEND CHANGES NEEDED
────────────────────────────────────────────

Create src/lib/api.ts:
  const API_BASE = import.meta.env.VITE_API_URL || 'https://api.abancool.com';

  export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });
    if (res.status === 401) { redirect to /client/login }
    return res.json();
  }

Then replace all hardcoded data arrays in each page with:
  const { data } = useQuery({ queryKey: ['invoices'], queryFn: () => apiFetch('/api/invoices') });

────────────────────────────────────────────
SECURITY REQUIREMENTS
────────────────────────────────────────────

- All endpoints except /auth/*, /contact, /hosting/plans, /domains/search
  require valid JWT
- Admin endpoints require role = 'admin' check
- Input validation with filter_var() and prepared statements (PDO)
- Rate limiting on auth endpoints (5 attempts/minute)
- CORS restricted to frontend domain
- HTTPS only
- M-Pesa callback IP whitelisting
- Stripe webhook signature verification

────────────────────────────────────────────
ENVIRONMENT VARIABLES (.env)
────────────────────────────────────────────

DB_HOST=localhost
DB_NAME=abancool_db
DB_USER=root
DB_PASS=
JWT_SECRET=your-256-bit-secret
FRONTEND_URL=https://abancool.com

MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=174379
MPESA_PASSKEY=
MPESA_CALLBACK_URL=https://api.abancool.com/api/payments/mpesa/callback
MPESA_ENV=sandbox

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

CPANEL_WHM_HOST=server.abancool.com
CPANEL_WHM_PORT=2087
CPANEL_WHM_TOKEN=

GOOGLE_CLIENT_ID=

SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_PORT=587
```

This prompt gives Kiro everything needed: the full MySQL schema, every API endpoint mapped to each React page, the payment-to-cPanel auto-provisioning flow, directory structure, security requirements, and the frontend API helper pattern. Copy and paste it directly into Kiro to begin implementation.

