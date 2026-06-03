import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  className = '',
  placeholder,
  type = 'text',
  inputMode,
  ...rest
}: TextInputProps) {
  const fieldId = id ?? name ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-cream/50 uppercase font-bold tracking-widest text-[11px]">
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`u-form-input ${className}`}
        {...rest}
      />
      {error ? <p className="text-[10px] text-tomato font-bold uppercase">{error}</p> : null}
    </div>
  );
}
