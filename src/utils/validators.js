/**
 * @file validators.js
 * @description Pure validation functions for user form fields.
 * Each validator returns `null` on success or a human-readable error string on failure.
 * Keeping validation logic here (not inside components) keeps components lean and
 * makes it trivial to unit-test rules in isolation.
 */

/**
 * Validates that a value is non-empty after trimming whitespace.
 * @param {string} value - The input value to check.
 * @param {string} [fieldName='Field'] - Label used in the error message.
 * @returns {string|null} Error message or null if valid.
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || String(value).trim() === '') {
    return `${fieldName} is required.`;
  }
  return null;
};

/**
 * Validates an email address against a standard RFC-5322 simplified pattern.
 * @param {string} email - The email string to validate.
 * @returns {string|null} Error message or null if valid.
 */
export const validateEmail = (email) => {
  const requiredError = validateRequired(email, 'Email');
  if (requiredError) return requiredError;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).toLowerCase())) {
    return 'Please enter a valid email address.';
  }
  return null;
};

/**
 * Validates a full name: required, at least two words, no numeric characters.
 * @param {string} name - The name string to validate.
 * @returns {string|null} Error message or null if valid.
 */
export const validateName = (name) => {
  const requiredError = validateRequired(name, 'Name');
  if (requiredError) return requiredError;

  const trimmed = String(name).trim();
  if (trimmed.split(/\s+/).length < 2) {
    return 'Please enter a full name (first and last).';
  }
  if (/\d/.test(trimmed)) {
    return 'Name must not contain numbers.';
  }
  return null;
};

/**
 * Validates a phone number: optional field, but if provided must be 10–15 digits.
 * @param {string} phone - The phone number string to validate.
 * @returns {string|null} Error message or null if valid.
 */
export const validatePhone = (phone) => {
  if (!phone || String(phone).trim() === '') return null; // optional field
  const digits = String(phone).replace(/[\s\-().+]/g, '');
  if (!/^\d{10,15}$/.test(digits)) {
    return 'Phone number must be between 10 and 15 digits.';
  }
  return null;
};

/**
 * Validates the entire user form object and returns a map of field -> error.
 * @param {Object} formData - The form values to validate.
 * @param {string} formData.name
 * @param {string} formData.email
 * @param {string} formData.department
 * @param {string} formData.role
 * @param {string} [formData.phone]
 * @returns {Object.<string, string>} Map of field names to error strings (empty = no errors).
 */
export const validateUserForm = (formData) => {
  const errors = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const departmentError = validateRequired(formData.department, 'Department');
  if (departmentError) errors.department = departmentError;

  const roleError = validateRequired(formData.role, 'Role');
  if (roleError) errors.role = roleError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
};

/**
 * Checks whether a validation errors object contains any errors.
 * @param {Object} errors - The errors map from validateUserForm.
 * @returns {boolean} True if there are no validation errors.
 */
export const isFormValid = (errors) => Object.keys(errors).length === 0;
