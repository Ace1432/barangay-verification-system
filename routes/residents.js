const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');
const { requireAuth } = require('./auth');
const { toApiResident } = require('../db/mappers');

// PUBLIC: search residents by name (view-only, limited fields)
router.get('/search', async (req, res) => {
  const q = (req.query.name || '').trim();
  if (!q) return res.json([]);
  try {
    const [rows] = await pool.query(
      'SELECT full_name, address, status, date_registered FROM residents WHERE full_name LIKE ?',
      [`%${q}%`]
    );
    const results = rows.map((r) => {
      const full = toApiResident(r);
      return { fullName: full.fullName, address: full.address, status: full.status, dateRegistered: full.dateRegistered };
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed.' });
  }
});

// ADMIN: list all residents
router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM residents ORDER BY full_name');
  res.json(rows.map(toApiResident));
});

// ADMIN: get single resident
router.get('/:id', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM residents WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Resident not found.' });
  res.json(toApiResident(rows[0]));
});

// ADMIN: register a new resident
router.post('/', requireAuth, async (req, res) => {
  const { fullName, birthdate, civilStatus, address, contactNumber, yearsOfResidency, occupation, status, notes } = req.body;
  if (!fullName || !address) return res.status(400).json({ error: 'Full name and address are required.' });

  try {
    const [result] = await pool.query(
      `INSERT INTO residents
       (full_name, birthdate, civil_status, address, contact_number, years_of_residency, occupation, status, date_registered, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
      [
        fullName,
        birthdate || null,
        civilStatus || '',
        address,
        contactNumber || '',
        Number(yearsOfResidency) || 0,
        occupation || '',
        status || 'pending',
        notes || '',
      ]
    );
    const [rows] = await pool.query('SELECT * FROM residents WHERE id = ?', [result.insertId]);
    res.status(201).json(toApiResident(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not register resident.' });
  }
});

// ADMIN: update / verify a resident
router.put('/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const [existingRows] = await pool.query('SELECT * FROM residents WHERE id = ?', [id]);
  if (!existingRows[0]) return res.status(404).json({ error: 'Resident not found.' });

  const current = toApiResident(existingRows[0]);
  const merged = { ...current, ...req.body };

  await pool.query(
    `UPDATE residents SET
      full_name = ?, birthdate = ?, civil_status = ?, address = ?, contact_number = ?,
      years_of_residency = ?, occupation = ?, status = ?, notes = ?
     WHERE id = ?`,
    [
      merged.fullName,
      merged.birthdate || null,
      merged.civilStatus || '',
      merged.address,
      merged.contactNumber || '',
      Number(merged.yearsOfResidency) || 0,
      merged.occupation || '',
      merged.status || 'pending',
      merged.notes || '',
      id,
    ]
  );

  const [rows] = await pool.query('SELECT * FROM residents WHERE id = ?', [id]);
  res.json(toApiResident(rows[0]));
});

// ADMIN: delete a resident record
router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM residents WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;