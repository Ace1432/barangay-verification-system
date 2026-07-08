import { Link } from 'react-router-dom';

export default function Topbar({ subtitle, actions }) {
  return (
    <div className="flex items-center justify-between border-b-[3px] border-gold bg-navy-deep px-8 py-3.5 text-paper-white">
      <div className="flex items-center gap-3">
        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-2 border-gold font-display text-sm font-bold text-gold-light">
          BSI
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-[0.14em] text-gold-light">
            Barangay Trinidad,S.C
          </span>
          <span className="font-display text-[17px] font-semibold">
            {subtitle || 'Resident Verification System'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">{actions}</div>
    </div>
  );
}

export function TopbarLink({ to, children }) {
  return (
    <Link
      to={to}
      className="rounded-sm border border-white/30 px-3.5 py-1.5 text-sm text-white no-underline hover:border-gold hover:text-gold-light"
    >
      {children}
    </Link>
  );
}

export function TopbarButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-sm border border-white/30 bg-transparent px-3.5 py-1.5 text-sm text-white hover:border-gold hover:text-gold-light"
    >
      {children}
    </button>
  );
}
