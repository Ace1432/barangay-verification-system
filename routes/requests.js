const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');
const { requireAuth } = require('./auth');
const { toApiResident, toApiRequest } = require('../db/mappers');
const { generateCertificate, CERT_LABELS } = require('../certificates/generator');

// ADMIN: list all certificate requests (with resident info attached)
router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT cr.*, r.full_name AS resident_full_name, r.status AS resident_status
     FROM certificate_requests cr
     JOIN residents r ON cr.resident_id = r.id
     ORDER BY cr.id DESC`
  );
  const enriched = rows.map((row) => ({
    ...toApiRequest(row),
    residentName: row.resident_full_name,
    residentStatus: row.resident_status,
  }));
  res.json(enriched);
});

// ADMIN: create a new certificate request on behalf of a resident (walk-in)
router.post('/', requireAuth, async (req, res) => {
  const { residentId, certificateType, purpose, extra } = req.body;
  if (!CERT_LABELS[certificateType]) return res.status(400).json({ error: 'Invalid certificate type.' });

  const [residentRows] = await pool.query('SELECT * FROM residents WHERE id = ?', [residentId]);
  const resident = residentRows[0];
  if (!resident) return res.status(404).json({ error: 'Resident not found.' });

  const status = resident.status === 'verified' ? 'approved' : 'pending';
  const dateDecided = status === 'approved' ? new Date() : null;

  try {
    const [result] = await pool.query(
      `INSERT INTO certificate_requests
       (resident_id, certificate_type, purpose, extra, status, date_requested, date_decided)
       VALUES (?, ?, ?, ?, ?, CURDATE(), ?)`,
      [resident.id, certificateType, purpose || '', JSON.stringify(extra || {}), status, dateDecided]
    );
    const [rows] = await pool.query('SELECT * FROM certificate_requests WHERE id = ?', [result.insertId]);
    res.status(201).json(toApiRequest(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create certificate request.' });
  }
});

// ADMIN: approve or reject a request (manual verification step)
router.put('/:id/decision', requireAuth, async (req, res) => {
  const id = req.params.id;
  const { decision } = req.body; // 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(decision)) return res.status(400).json({ error: 'Invalid decision.' });

  const [existing] = await pool.query('SELECT * FROM certificate_requests WHERE id = ?', [id]);
  if (!existing[0]) return res.status(404).json({ error: 'Request not found.' });

  await pool.query('UPDATE certificate_requests SET status = ?, date_decided = CURDATE() WHERE id = ?', [decision, id]);
  const [rows] = await pool.query('SELECT * FROM certificate_requests WHERE id = ?', [id]);
  res.json(toApiRequest(rows[0]));
});

// ADMIN: generate/download the PDF for an approved request
router.get('/:id/pdf', requireAuth, async (req, res) => {
  const id = req.params.id;
  const [requestRows] = await pool.query('SELECT * FROM certificate_requests WHERE id = ?', [id]);
  const requestRow = requestRows[0];
  if (!requestRow) return res.status(404).send('Request not found.');
  if (requestRow.status !== 'approved') return res.status(400).send('This request has not been approved yet.');

  const [residentRows] = await pool.query('SELECT * FROM residents WHERE id = ?', [requestRow.resident_id]);
  const residentRow = residentRows[0];
  if (!residentRow) return res.status(404).send('Resident not found.');

  generateCertificate(requestRow.certificate_type, toApiResident(residentRow), toApiRequest(requestRow), res);
});

// ADMIN: reference list of certificate types (for building the request form)
router.get('/meta/types', requireAuth, (req, res) => {
  res.json(CERT_LABELS);
});

module.exports = router;
