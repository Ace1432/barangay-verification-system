const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'barangay_db',
  waitForConnections: true,
  connectionLimit: 10,
});

async function initializeDatabase() {
  // Create tables if they don't exist yet (schema.sql is the source of truth)
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const withoutComments = schema
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');
  const statements = withoutComments
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    await pool.query(stmt);
  }

  // Seed the admin account if none exists.
  // Set ADMIN_USERNAME / ADMIN_PASSWORD env vars before first run to avoid
  // deploying with the default demo credentials.
  const [admins] = await pool.query('SELECT COUNT(*) AS count FROM admins');
  if (admins[0].count === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO admins (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, 'Barangay Administrator', 'admin']
    );
  }

  // Seed a few sample residents so the search demo has data to show.
  // Set SEED_SAMPLE_DATA=false in production if you don't want demo records.
  const shouldSeedSamples = process.env.SEED_SAMPLE_DATA !== 'false';
  const [residents] = await pool.query('SELECT COUNT(*) AS count FROM residents');
  if (shouldSeedSamples && residents[0].count === 0) {
    const sampleResidents = [
      ['Juan Dela Cruz', '1990-05-12', 'Married', '123 Mabini St., Purok 1', '09171234567', 10, 'Employed', 'verified', '2020-01-15', ''],
      ['Maria Santos', '1985-11-03', 'Single', '45 Rizal Ave., Purok 2', '09181234567', 5, 'Unemployed', 'verified', '2021-03-10', ''],
      ['Pedro Ramirez', '1998-02-20', 'Single', '78 Bonifacio St., Purok 3', '09191234567', 1, 'Student', 'pending', '2026-06-01', 'Awaiting proof of address verification'],
    ];
    for (const r of sampleResidents) {
      await pool.query(
        `INSERT INTO residents
         (full_name, birthdate, civil_status, address, contact_number, years_of_residency, occupation, status, date_registered, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        r
      );
    }
  }
}

module.exports = { pool, initializeDatabase };
