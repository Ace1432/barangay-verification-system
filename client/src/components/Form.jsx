export function Field({ label, children }) {
  return (
    <div className="mt-3.5">
      <label className="mb-1.5 block text-[13px] font-semibold text-ink-soft">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-sm border border-line bg-paper-white px-3 py-2.5 text-[14.5px] text-ink focus:border-gold focus:outline focus:outline-2 focus:outline-gold-light focus:outline-offset-1';

export function TextInput(props) {
  return <input {...props} className={inputClass + (props.className || '')} />;
}

export function Select(props) {
  return <select {...props} className={inputClass + (props.className || '')} />;
}

export function TextArea(props) {
  return <textarea {...props} className={inputClass + (props.className || '')} />;
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'bg-navy-deep text-white hover:bg-navy',
    gold: 'bg-gold text-navy-deep hover:bg-gold-light',
    outline: 'bg-transparent border border-line text-ink hover:border-navy',
    danger: 'bg-red-bg text-red border border-red hover:bg-red/10',
  };
  const sizes = {
    md: 'px-5 py-2.5 text-[14.5px]',
    sm: 'px-3 py-1.5 text-[13px]',
  };
  return (
    <button
      {...props}
      className={`cursor-pointer rounded-sm font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}
