const VARIANTS = {
  verified: ['bg-green-bg', 'text-green', 'Registered Resident'],
  pending: ['bg-amber-bg', 'text-amber', 'Pending Verification'],
  approved: ['bg-green-bg', 'text-green', 'Approved'],
  rejected: ['bg-red-bg', 'text-red', 'Rejected'],
};

export default function Badge({ status, label }) {
  const [bg, textColor, defaultLabel] = VARIANTS[status] || ['bg-gray-100', 'text-gray-500', 'Not Registered'];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-semibold ${bg} ${textColor}`}>
      {label || defaultLabel}
    </span>
  );
}
