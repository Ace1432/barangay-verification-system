-- Barangay Verification System — MySQL schema
-- Run this once against your database (or let the app auto-create these
-- tables on first startup — see db/database.js).

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS residents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  birthdate DATE NULL,
  civil_status VARCHAR(50),
  address VARCHAR(500) NOT NULL,
  contact_number VARCHAR(50),
  years_of_residency INT DEFAULT 0,
  occupation VARCHAR(255),
  status ENUM('pending', 'verified') NOT NULL DEFAULT 'pending',
  date_registered DATE NOT NULL,
  notes TEXT,
  INDEX idx_full_name (full_name)
);

CREATE TABLE IF NOT EXISTS certificate_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resident_id INT NOT NULL,
  certificate_type VARCHAR(100) NOT NULL,
  purpose VARCHAR(500),
  extra JSON,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  date_requested DATE NOT NULL,
  date_decided DATE NULL,
  FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
);
