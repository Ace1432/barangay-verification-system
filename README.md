# Barangay San Isidro — Resident Verification System

A full-stack web app for a barangay to verify residents and issue official certificates.

## What it does

**Public (no login):**
- Search a name to check if someone is a registered/verified resident — read-only, no editing.

**Admin (staff login required):**
- Register new residents and record their details
- Verify or update a resident's status (Pending → Verified)
- Process certificate requests, with **manual approval** required unless the resident is already verified
- Generate real, downloadable PDF certificates for all 8 types:
  1. Barangay Clearance
  2. Certificate of Residency
  3. Certificate of Indigency
  4. Certificate of Good Moral Character
  5. Certificate of Cohabitation
  6. Certificate of Unemployment
  7. Business Clearance
  8. First-Time Job Seeker Certificate

## Tech stack

- **Backend:** Node.js + Express
- **Database:** MySQL (via `mysql2`)
- **PDF generation:** PDFKit (generates real, official-looking PDF certificates on demand)
- **Frontend:** React + Tailwind CSS (built with Vite), served as a single-page app by Express
- **Auth:** Session-based login for admin (bcrypt-hashed passwords)

## Project structure

```
barangay-system/
├── server.js                 # Express app entry point — serves the API and the built React app
├── package.json               # Backend dependencies + convenience scripts
├── .env.example                # Copy to .env and fill in your MySQL credentials
├── db/
│   ├── database.js             # MySQL connection pool + auto-creates tables & seed data on startup
│   ├── schema.sql               # Table definitions (residents, certificate_requests, admins)
│   └── mappers.js               # Converts DB rows (snake_case) <-> API objects (camelCase)
├── routes/
│   ├── auth.js                  # Admin login/logout
│   ├── residents.js             # Resident CRUD + public search
│   └── requests.js              # Certificate requests + PDF generation
├── certificates/
│   └── generator.js             # PDF templates for all 8 certificate types
└── client/                     # React + Tailwind frontend (Vite)
    ├── src/
    │   ├── pages/                 # Landing, ResidentSearch, AdminLogin, AdminDashboard
    │   ├── components/            # Topbar, Badge, Modal, Form controls, admin/ tabs
    │   └── api.js                  # Fetch helper for calling the Express API
    ├── vite.config.js              # Dev proxy: /api → http://localhost:3000
    └── dist/                       # Production build output (created by `npm run build`)
```

## Setting up MySQL (using MySQL Workbench)

1. **Create the database.** Open MySQL Workbench, connect to your local MySQL server, and run:
   ```sql
   CREATE DATABASE barangay_db;
   ```
   (Optional but recommended — create a dedicated app user instead of using `root`:)
   ```sql
   CREATE USER 'barangay_app'@'localhost' IDENTIFIED BY 'choose-a-password';
   GRANT ALL PRIVILEGES ON barangay_db.* TO 'barangay_app'@'localhost';
   FLUSH PRIVILEGES;
   ```
2. **You don't need to manually create tables** — `db/schema.sql` is included for reference, but the app automatically runs `CREATE TABLE IF NOT EXISTS` for all three tables (`residents`, `certificate_requests`, `admins`) the first time it starts up, and seeds the demo admin account + sample residents.
3. **Configure the connection.** Copy `.env.example` to `.env` and fill in whichever credentials you used in Workbench:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root                  (or barangay_app, if you created that user)
   DB_PASSWORD=your-mysql-password
   DB_NAME=barangay_db
   ```

You can inspect/query the data anytime directly in Workbench once the app has run at least once and created the tables.

## Running locally

```
cp .env.example .env      # then edit .env with your MySQL credentials
npm install                 # installs backend deps AND runs client's npm install automatically
npm run build                 # builds the React app into client/dist
npm start                       # starts Express on http://localhost:3000
```

Open **http://localhost:3000** — the whole app (frontend + API) is served from this one Express server.

### Development mode (hot-reload while editing the frontend)

Run these in two terminals:

```
npm run dev:server     # Terminal 1 — Express API on http://localhost:3000
npm run dev:client      # Terminal 2 — Vite dev server on http://localhost:5173 (proxies /api to :3000)
```

While developing, open **http://localhost:5173** — Vite's dev server gives instant hot-reload and proxies all `/api/*` calls to the Express backend automatically.

## Deploying to Railway (recommended free/simple option)

Railway can host both the app **and** a MySQL database for you, so you don't need to run your own MySQL server in production.

1. **Push this project to a GitHub repo** (Railway deploys from Git).
2. **Create a new Railway project** → "Deploy from GitHub repo" → select your repo.
3. **Add a MySQL database** to the same project: in Railway, click "+ New" → "Database" → "Add MySQL". Railway provisions it and gives you connection credentials automatically.
4. **Set environment variables** on your app service (Railway dashboard → your service → "Variables" tab). Railway can auto-fill the DB ones by referencing the MySQL service's variables, or you can copy them in manually:
   ```
   SESSION_SECRET=<generate a long random string>
   NODE_ENV=production
   ADMIN_USERNAME=<pick your own>
   ADMIN_PASSWORD=<pick your own, don't use admin123>
   SEED_SAMPLE_DATA=false
   DB_HOST=<from the MySQL service Railway created>
   DB_PORT=<from the MySQL service>
   DB_USER=<from the MySQL service>
   DB_PASSWORD=<from the MySQL service>
   DB_NAME=<from the MySQL service>
   ```
   (`PORT` is set automatically by Railway — you don't need to set it.)
5. **Deploy.** Railway runs `npm install && npm run build` (via `railway.json`), then `npm start`. On first boot, the app automatically creates the tables in your new MySQL database and seeds the admin account.
6. You get a public URL like `https://your-app.up.railway.app` — that's your live site.

**Important:** `ADMIN_USERNAME`/`ADMIN_PASSWORD` only take effect the **first time** the app starts (when there's no admin account yet in the database). To reset the admin password later, update it directly in the `admins` table via MySQL Workbench (or add a password-reset endpoint).

## Demo login (local dev)

- Username: `admin`
- Password: `admin123`

Three sample residents are pre-loaded so you can try the search right away: **Juan Dela Cruz** (verified), **Maria Santos** (verified), **Pedro Ramirez** (pending).

## How the verification workflow works

1. **Resident registration** — Admin adds a resident's details (name, address, civil status, etc). New residents start as "Pending" by default.
2. **Verification** — Admin manually checks the resident's records/proof of address and updates their status to "Verified."
3. **Certificate request** — Admin creates a request for a resident and picks a certificate type.
   - If the resident is already **Verified**, the request is auto-approved.
   - If the resident is still **Pending**, the request sits in "Pending" status until admin manually approves or rejects it.
4. **Release** — Once approved, admin clicks "Download PDF" to generate the official certificate.

## Notes for taking this further

- **Add ID/proof upload:** currently verification is manual (admin checks in person). You could add a file upload for residents to submit a photo/ID as part of registration.
- **Add more admin roles:** currently there's a single "admin" role. You could add a "verifier" role vs. a "records officer" role with different permissions.
- **Add audit logging:** track who approved/rejected each request and when, for accountability.
- **Connection pooling in production:** the current pool (`connectionLimit: 10`) is fine for a small barangay office; increase it if usage grows significantly.
