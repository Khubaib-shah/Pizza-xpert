import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react';
import { isEmail, normalizeEmail } from '../../utils/validation';

interface EmailInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export default function EmailInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  className = '',
  placeholder = 'name@example.com',
  ...rest
}: EmailInputProps) {
  const fieldId = id ?? name ?? label.replace(/\s+/g, '-').toLowerCase();

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const formatted = normalizeEmail(event.target.value);
    onChange(formatted);
    onBlur?.(event);
  };

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-cream/50 uppercase font-medium tracking-widest text-[11px]">
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onBlur={handleBlur}
        className={`u-form-input ${className}`}
        autoComplete="email"
        {...rest}
      />
      {error ? <p className="text-[10px] text-tomato font-medium uppercase">{error}</p> : null}
    </div>
  );
}
