import Badge from '../Badge';
import { CERT_LABELS } from '../../api';

function StatCard({ num, label }) {
  return (
    <div className="rounded-sm border border-line bg-paper-white p-5 shadow-[0_2px_10px_rgba(14,34,51,0.08)]">
      <div className="font-display text-[28px] text-navy-deep">{num}</div>
      <div className="text-[12.5px] uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  );
}

export default function OverviewTab({ residents, requests }) {
  const total = residents.length;
  const verified = residents.filter((r) => r.status === 'verified').length;
  const pendingRes = residents.filter((r) => r.status === 'pending').length;
  const pendingReq = requests.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-navy-deep">Overview</h2>
      </div>
      <div className="mb-6.5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard num={total} label="Total Residents" />
        <StatCard num={verified} label="Verified Residents" />
        <StatCard num={pendingRes} label="Pending Verification" />
        <StatCard num={pendingReq} label="Pending Requests" />
      </div>
      <div className="rounded-sm border border-line bg-paper-white p-5 shadow-[0_2px_10px_rgba(14,34,51,0.08)]">
        <h3 className="mb-2.5 text-base font-semibold">Recent Certificate Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Resident</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Certificate</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Status</th>
                <th className="border-b-2 border-line px-3.5 py-2.5 text-left text-xs uppercase tracking-wide text-ink-soft">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 6).map((r) => (
                <tr key={r.id} className="hover:bg-gold/5">
                  <td className="border-b border-line px-3.5 py-3">{r.residentName}</td>
                  <td className="border-b border-line px-3.5 py-3">{CERT_LABELS[r.certificateType] || r.certificateType}</td>
                  <td className="border-b border-line px-3.5 py-3"><Badge status={r.status} /></td>
                  <td className="border-b border-line px-3.5 py-3">{r.dateRequested}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-ink-soft">
                    No requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
