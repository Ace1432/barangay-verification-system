const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body (e.g. PDF endpoints aren't called through this helper)
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  // residents
  searchResidents: (name) => request(`/residents/search?name=${encodeURIComponent(name)}`),
  listResidents: () => request('/residents'),
  createResident: (payload) => request('/residents', { method: 'POST', body: JSON.stringify(payload) }),
  updateResident: (id, payload) => request(`/residents/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteResident: (id) => request(`/residents/${id}`, { method: 'DELETE' }),

  // requests
  listRequests: () => request('/requests'),
  createRequest: (payload) => request('/requests', { method: 'POST', body: JSON.stringify(payload) }),
  decideRequest: (id, decision) =>
    request(`/requests/${id}/decision`, { method: 'PUT', body: JSON.stringify({ decision }) }),
  pdfUrl: (id) => `${BASE}/requests/${id}/pdf`,
};

export const CERT_LABELS = {
  barangay_clearance: 'Barangay Clearance',
  certificate_of_residency: 'Certificate of Residency',
  certificate_of_indigency: 'Certificate of Indigency',
  certificate_of_good_moral: 'Certificate of Good Moral Character',
  certificate_of_cohabitation: 'Certificate of Cohabitation',
  certificate_of_unemployment: 'Certificate of Unemployment',
  business_clearance: 'Business Clearance',
  first_time_jobseeker: "First-Time Job Seeker Certificate",
};
