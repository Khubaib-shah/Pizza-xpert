export type ValidationResult = {
  valid: boolean;
  error?: string;
  formatted?: string;
};

const NAME_REGEX = /^[\p{L}][\p{L}\s'\-]{1,79}Rs/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+Rs/;

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function sanitizeNameInput(value: string): string {
  return value.replace(/[^\p{L}\s'\-]/gu, '');
}

export function isAlphaName(value: string): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, error: 'Full name is required' };
  }
  if (!NAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Enter a valid name without numbers or special characters',
    };
  }
  return { valid: true };
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isEmail(value: string): ValidationResult {
  const trimmed = normalizeEmail(value);
  if (!trimmed) {
    return { valid: false, error: 'Email address is required' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email address' };
  }
  return { valid: true, formatted: trimmed };
}

export function normalizePakistaniPhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatPakistaniPhone(value: string): string {
  const digits = normalizePakistaniPhone(value);
  if (digits.startsWith('92')) {
    const rest = digits.slice(2).slice(0, 10);
    if (rest.length <= 3) return `+92 ${rest}`.trim();
    if (rest.length <= 7) return `+92 ${rest.slice(0, 3)} ${rest.slice(3)}`.trim();
    return `+92 ${rest.slice(0, 3)} ${rest.slice(3, 10)}`.trim();
  }
  if (digits.startsWith('03')) {
    const truncated = digits.slice(0, 11);
    if (truncated.length <= 4) return truncated;
    return `${truncated.slice(0, 4)} ${truncated.slice(4)}`.trim();
  }
  return digits;
}

export function isPakistaniPhone(value: string): ValidationResult {
  const digits = normalizePakistaniPhone(value);
  if (!digits) {
    return { valid: false, error: 'Phone number is required' };
  }

  if (digits.startsWith('92')) {
    const rest = digits.slice(2);
    if (rest.length !== 10) {
      return { valid: false, error: 'Pakistani numbers starting with 92 must contain 10 digits after the country code' };
    }
    return { valid: true, formatted: formatPakistaniPhone(digits) };
  }

  if (digits.startsWith('03')) {
    if (digits.length !== 11) {
      return { valid: false, error: 'Pakistani mobile numbers starting with 03 must be 11 digits long' };
    }
    return { valid: true, formatted: formatPakistaniPhone(digits) };
  }

  return {
    valid: false,
    error: 'Use a Pakistani phone number starting with 92 or 03',
  };
}
