/**
 * Formats a phone number input string as user types/edits.
 * Default format: +52 (XXX) XXX XXXX
 * 
 * @param {string} input - Raw or partial phone string
 * @returns {string} Formatted phone string
 */
export const formatPhoneNumber = (input) => {
  if (!input) return '';

  const str = String(input);
  const digits = str.replace(/\D/g, '');

  if (!digits) return '';

  const trimmed = str.trim();
  // If user explicitly enters another country code with '+' (e.g. +1 ...)
  if (trimmed.startsWith('+') && !trimmed.startsWith('+52') && !digits.startsWith('52')) {
    const countryCode = digits.slice(0, 1);
    const rest = digits.slice(1, 11);
    if (rest.length <= 3) return `+${countryCode} (${rest}`;
    if (rest.length <= 6) return `+${countryCode} (${rest.slice(0, 3)}) ${rest.slice(3)}`;
    return `+${countryCode} (${rest.slice(0, 3)}) ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }

  // Handle Mexican numbers (+52)
  let numberDigits = digits;
  if (numberDigits.startsWith('52')) {
    numberDigits = numberDigits.slice(2);
  }

  // Cap at 10 digits for local portion
  const clean10 = numberDigits.slice(0, 10);

  if (clean10.length === 0) return '';
  if (clean10.length <= 3) return `+52 (${clean10}`;
  if (clean10.length <= 6) return `+52 (${clean10.slice(0, 3)}) ${clean10.slice(3)}`;
  return `+52 (${clean10.slice(0, 3)}) ${clean10.slice(3, 6)} ${clean10.slice(6)}`;
};
