export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/50 p-5">
      <div className="max-h-[85vh] w-full max-w-[520px] overflow-y-auto rounded-sm bg-paper-white p-7.5">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold text-navy-deep">{title}</h3>
          <span onClick={onClose} className="cursor-pointer text-xl text-ink-soft hover:text-ink">
            &times;
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
