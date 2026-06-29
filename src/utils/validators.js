/**
 * @file validators.js
 * @description Pure validation functions for user form fields.
 */

export const isRequired = (value) => {
  if (!value || String(value).trim() === '') return false;
  return true;
};

export const isMinLength = (value, min) => {
  if (!value) return false;
  return String(value).trim().length >= min;
};

export const isOnlyLettersAndSpaces = (value) => {
  if (!value) return false;
  return /^[a-zA-Z\s]+$/.test(value);
};

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
};

/**
 * Validates user form data.
 * Why: This runs entirely client-side before any API call to save network round-trips
 * and give instant feedback to the user on input errors.
 */
export const validateUserForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.firstName)) {
    errors.firstName = 'First name is required.';
  } else if (!isMinLength(formData.firstName, 2)) {
    errors.firstName = 'First name must be at least 2 characters.';
  } else if (!isOnlyLettersAndSpaces(formData.firstName)) {
    errors.firstName = 'First name can only contain letters.';
  }

  if (!isRequired(formData.lastName)) {
    errors.lastName = 'Last name is required.';
  } else if (!isMinLength(formData.lastName, 2)) {
    errors.lastName = 'Last name must be at least 2 characters.';
  } else if (!isOnlyLettersAndSpaces(formData.lastName)) {
    errors.lastName = 'Last name can only contain letters.';
  }

  if (!isRequired(formData.email)) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!isRequired(formData.department)) {
    errors.department = 'Department is required.';
  }

  return errors;
};
