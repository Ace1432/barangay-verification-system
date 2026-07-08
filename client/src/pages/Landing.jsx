import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';

export default function Landing() {
  return (
    <div>
      <Topbar />
      <div className="mx-auto max-w-[1080px] px-8 pb-20 pt-10">
        <div className="px-5 py-15 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Official Barangay Service
          </span>
          <h1 className="mx-auto mt-2.5 mb-3.5 font-display text-4xl leading-tight text-navy-deep">
            Check residency status. Request official certificates.
          </h1>
          <p className="mx-auto max-w-[560px] text-base text-ink-soft">
            This portal confirms whether a person is a registered resident of the barangay, and lets
            barangay staff issue clearances and certificates once residency is verified.
          </p>
        </div>

        <div className="mt-11 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            to="/search"
            className="flex flex-col gap-3 rounded-sm border border-line bg-paper-white p-8 text-inherit no-underline shadow-[0_2px_10px_rgba(14,34,51,0.08)] transition hover:-translate-y-1 hover:shadow-[0_8px_22px_rgba(14,34,51,0.12)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-deep text-lg text-gold-light">
              🔍
            </div>
            <h3 className="font-display text-xl text-navy-deep">Check Resident Status</h3>
            <p className="m-0 text-[14.5px] text-ink-soft">
              Search a name to see if that person is a registered, verified resident of this barangay.
              Open to anyone — no account needed.
            </p>
            <span className="mt-auto text-sm font-semibold text-navy">Search by name &rarr;</span>
          </Link>

          <Link
            to="/admin/login"
            className="flex flex-col gap-3 rounded-sm border border-line bg-paper-white p-8 text-inherit no-underline shadow-[0_2px_10px_rgba(14,34,51,0.08)] transition hover:-translate-y-1 hover:shadow-[0_8px_22px_rgba(14,34,51,0.12)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-deep text-lg text-gold-light">
              💼
            </div>
            <h3 className="font-display text-xl text-navy-deep">Barangay Staff Login</h3>
            <p className="m-0 text-[14.5px] text-ink-soft">
              Register residents, verify records, and process requests for clearances, certificates, and
              permits.
            </p>
            <span className="mt-auto text-sm font-semibold text-navy">Staff sign in &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
