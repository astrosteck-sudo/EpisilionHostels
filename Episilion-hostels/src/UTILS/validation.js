import validator from "validator";

/**
 * Shared validation helpers.
 *
 * The app previously had three different email validators (a hand-rolled
 * regex, the `validator` package, and the native `type="email"` attribute).
 * Everything now goes through this module so rules stay consistent.
 */

export const PASSWORD_MIN_LENGTH = 8;

/** Validate an email address. Returns an error message, or "" when valid. */
export function validateEmail(email) {
  const value = (email ?? "").trim();
  if (!value) return "Email address is required.";
  if (!validator.isEmail(value)) return "Enter a valid email address.";
  return "";
}

/** Validate a person's name. Returns an error message, or "" when valid. */
export function validateName(name) {
  const value = (name ?? "").trim();
  if (!value) return "Full name is required.";
  if (value.length < 2) return "Full name must be at least 2 characters.";
  if (!/^[\p{L}\p{M}'\-.\s]+$/u.test(value)) {
    return "Full name can only contain letters, spaces, hyphens and apostrophes.";
  }
  return "";
}

/**
 * Validate a password. Returns an error message, or "" when valid.
 * Mirrors the guidance already shown to users on the change-password screen.
 */
export function validatePassword(password) {
  const value = password ?? "";
  if (!value) return "Password is required.";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[a-zA-Z]/.test(value)) {
    return "Password must include at least one letter.";
  }
  if (!/\d/.test(value)) {
    return "Password must include at least one number.";
  }
  return "";
}

/** Validate that two passwords match. */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

/** Validate a hostel name (manager login). */
export function validateHostelName(name) {
  const value = (name ?? "").trim();
  if (!value) return "Hostel name is required.";
  if (value.length < 2) return "Hostel name must be at least 2 characters.";
  return "";
}

/**
 * Validate a currency amount. Returns an error message, or "" when valid.
 * @param {string|number} value
 * @param {object} [options]
 * @param {string} [options.label] - used in the error message
 * @param {boolean} [options.required=false]
 */
export function validateAmount(value, options = {}) {
  const { label = "This field", required = false } = options;
  const raw = (value ?? "").toString().trim();

  if (!raw) {
    return required ? `${label} is required.` : "";
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return `${label} must be a valid number.`;
  }
  if (parsed < 0) {
    return `${label} cannot be negative.`;
  }
  return "";
}

/**
 * Validate a whole, non-negative number (e.g. minutes from campus).
 */
export function validateWholeNumber(value, options = {}) {
  const { label = "This field", required = false } = options;
  const raw = (value ?? "").toString().trim();

  if (!raw) {
    return required ? `${label} is required.` : "";
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return `${label} must be a valid number.`;
  }
  if (!Number.isInteger(parsed)) {
    return `${label} must be a whole number.`;
  }
  if (parsed < 0) {
    return `${label} cannot be negative.`;
  }
  return "";
}

/**
 * Validate free text with a minimum length.
 */
export function validateMinLength(value, minLength, options = {}) {
  const { label = "This field" } = options;
  const text = (value ?? "").trim();
  if (!text) return `${label} is required.`;
  if (text.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }
  return "";
}
