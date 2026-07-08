function toApiResident(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    birthdate: row.birthdate ? formatDate(row.birthdate) : '',
    civilStatus: row.civil_status || '',
    address: row.address,
    contactNumber: row.contact_number || '',
    yearsOfResidency: row.years_of_residency || 0,
    occupation: row.occupation || '',
    status: row.status,
    dateRegistered: row.date_registered ? formatDate(row.date_registered) : '',
    notes: row.notes || '',
  };
}

function toApiRequest(row) {
  if (!row) return null;
  let extra = row.extra;
  if (typeof extra === 'string') {
    try { extra = JSON.parse(extra); } catch (e) { extra = {}; }
  }
  return {
    id: row.id,
    residentId: row.resident_id,
    certificateType: row.certificate_type,
    purpose: row.purpose || '',
    extra: extra || {},
    status: row.status,
    dateRequested: row.date_requested ? formatDate(row.date_requested) : '',
    dateDecided: row.date_decided ? formatDate(row.date_decided) : null,
  };
}

function formatDate(value) {
  // mysql2 returns DATE columns as JS Date objects by default; normalize to YYYY-MM-DD
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

module.exports = { toApiResident, toApiRequest, formatDate };
