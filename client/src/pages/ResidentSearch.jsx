import { useState } from 'react';
import Topbar, { TopbarLink } from '../components/Topbar';
import Badge from '../components/Badge';
import { api } from '../api';

export default function ResidentSearch() {
  const [name, setName] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function doSearch() {
    const trimmed = name.trim();
    if (!trimmed) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.searchResidents(trimmed);
      setResults(data);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') doSearch();
  }

  return (
    <div>
      <Topbar actions={<TopbarLink to="/">&larr; Home</TopbarLink>} />
      <div className="mx-auto max-w-[720px] px-8 pb-20 pt-10">
        <h1 className="mb-1.5 font-display text-2xl text-navy-deep">Check Resident Status</h1>
        <p className="text-ink-soft">
          Search a full name to see if that person is registered with this barangay. This is a read-only
          lookup — for a certificate or clearance, the resident must visit the barangay office in person.
        </p>

        <div className="mt-7.5 rounded-sm border border-line bg-paper-white p-9 shadow-[0_2px_10px_rgba(14,34,51,0.08)]">
          <label className="mb-1.5 block text-[13px] font-semibold text-ink-soft" htmlFor="searchInput">
            Full name
          </label>
          <div className="flex gap-2.5">
            <input
              id="searchInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g. Juan Dela Cruz"
              autoComplete="off"
              className="flex-1 rounded-sm border border-line bg-paper-white px-3 py-2.5 text-[14.5px] focus:border-gold focus:outline focus:outline-2 focus:outline-gold-light"
            />
            <button
              onClick={doSearch}
              className="cursor-pointer rounded-sm bg-navy-deep px-5 py-2.5 text-[14.5px] font-semibold text-white hover:bg-navy"
            >
              Search
            </button>
          </div>
          <div className="mt-1.5 text-[12.5px] text-ink-soft">
            Try: Juan Dela Cruz, Maria Santos, or Pedro Ramirez (sample records)
          </div>
        </div>

        <div className="mt-2">
          {loading && (
            <div className="mt-3.5 rounded-sm border border-line bg-paper-white p-10 text-center text-ink-soft">
              Searching...
            </div>
          )}

          {!loading && results && results.length === 0 && (
            <div className="mt-3.5 rounded-sm border border-line bg-paper-white p-10 text-center text-ink-soft">
              <p className="font-semibold text-ink">No matching record found.</p>
              <p className="text-[13.5px]">
                This person may not yet be registered with the barangay, or the name may be spelled
                differently. Visit the barangay office to register.
              </p>
            </div>
          )}

          {!loading &&
            results &&
            results.map((r, i) => (
              <div
                key={i}
                className="mt-3.5 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-line bg-paper-white p-5"
              >
                <div>
                  <div className="text-base font-semibold">{r.fullName}</div>
                  <div className="mt-0.5 text-[13.5px] text-ink-soft">{r.address}</div>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
