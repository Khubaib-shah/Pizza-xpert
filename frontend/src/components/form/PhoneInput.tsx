import type { ChangeEvent, FocusEvent, InputHTMLAttributes, KeyboardEvent } from 'react';
import { formatPakistaniPhone, isPakistaniPhone } from '../../utils/validation';

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export default function PhoneInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  className = '',
  placeholder = '0312 1212121',
  ...rest
}: PhoneInputProps) {
  const fieldId = id ?? name ?? label.replace(/\s+/g, '-').toLowerCase();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const formatted = formatPakistaniPhone(rawValue);
    onChange(formatted);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const valueToCheck = event.target.value;
    const result = isPakistaniPhone(valueToCheck);
    if (result.valid && result.formatted) {
      onChange(result.formatted);
    }
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    if (!/[0-9+]/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-cream/50 uppercase font-medium tracking-widest text-[11px]">
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        type="tel"
        inputMode="tel"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`u-form-input ${className}`}
        {...rest}
      />
      {error ? <p className="text-[10px] text-tomato font-medium uppercase">{error}</p> : null}
    </div>
  );
}
