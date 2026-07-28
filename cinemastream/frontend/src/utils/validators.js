// Client-side mirrors of the joi rules enforced server-side
// (backend/src/utils/validation.js) -- these give instant feedback in the
// UI, but the backend is still the source of truth and validates again.

const NAME_PATTERN = /^[a-zA-Z ]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const isValidName = (value) => NAME_PATTERN.test((value || '').trim());

export const isValidEmail = (value) => EMAIL_PATTERN.test((value || '').trim());

export const isValidPassword = (value) => (value || '').length >= MIN_PASSWORD_LENGTH;

export const passwordsMatch = (password, confirmPassword) => password === confirmPassword;

export const getPasswordError = (value) =>
  isValidPassword(value) ? null : `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;

export const getNameError = (value) =>
  isValidName(value) ? null : 'Name must contain letters and spaces only';

export const getEmailError = (value) => (isValidEmail(value) ? null : 'Invalid email entered');
