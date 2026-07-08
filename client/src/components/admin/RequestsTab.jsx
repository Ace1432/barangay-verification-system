import { useState } from 'react';
import Badge from '../Badge';
import { Button } from '../Form';
import RequestModal from './RequestModal';
import { api, CERT_LABELS } from '../../api';
import { useToast } from '../../context/ToastContext';

export default function RequestsTab({ requests, residents, refresh }) {
  const [modalOpen, setModalOpen] = useState(false);
  const showToast = useToast();

  async function handleSubmit(payload) {
    try {
      await api.createRequest(payload);
      showToast('Certificate request submitted.');
      setModalOpen(false);
      refresh();
    } catch (err) {
      showToast(err.data?.error || 'Something went wrong.');
    }
  }

  async function decide(id, decision) {
    await api.decideRequest(id, decision);
    showToast(`Request ${decision}.`);
    refresh();
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-navy-deep">Certificate Requests</h2>
        <Button variant="gold" onClick={() => setModalOpen(true)}>+ New Request</Button>
      </div>

      <div className="rounded-sm border border-line bg-paper-white shadow-[0_2px_10px_rgba(14,34,51,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Resident</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Certificate</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Purpose</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Status</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Date</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gold/5">
                  <td className="border-b border-line px-3.5 py-3">{r.residentName}</td>
                  <td className="border-b border-line px-3.5 py-3">{CERT_LABELS[r.certificateType] || r.certificateType}</td>
                  <td className="border-b border-line px-3.5 py-3">{r.purpose || '—'}</td>
                  <td className="border-b border-line px-3.5 py-3"><Badge status={r.status} /></td>
                  <td className="border-b border-line px-3.5 py-3">{r.dateRequested}</td>
                  <td className="border-b border-line px-3.5 py-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="primary" onClick={() => decide(r.id, 'approved')}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => decide(r.id, 'rejected')}>Reject</Button>
                      </div>
                    )}
                    {r.status === 'approved' && (
                      <a
                        href={api.pdfUrl(r.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block cursor-pointer rounded-sm bg-gold px-3 py-1.5 text-[13px] font-semibold text-navy-deep no-underline hover:bg-gold-light"
                      >
                        Download PDF
                      </a>
                    )}
                    {r.status === 'rejected' && <span className="text-ink-soft">—</span>}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-ink-soft">
                    No certificate requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        residents={residents}
      />
    </div>
  );
}
