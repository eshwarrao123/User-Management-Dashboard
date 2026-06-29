/**
 * @file UserForm.jsx
 * @description Modal form for creating a new user or editing an existing one.
 * Validates fields on submit using validateUserForm from validators.js.
 * Operates in two modes, determined by whether `initialData` is provided:
 *   - Create mode: blank form, calls onSubmit with new payload.
 *   - Edit mode:   pre-filled form, calls onSubmit with merged payload.
 *
 * @param {Object}         props
 * @param {Object|null}    props.initialData  - Existing user data for edit mode, or null.
 * @param {Function}       props.onSubmit     - Async callback: (formData) => void.
 * @param {Function}       props.onClose      - Callback to close/cancel the modal.
 * @param {boolean}        props.isSubmitting - Disables the submit button while in flight.
 */

import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, USER_STATUS } from '../utils/constants';
import { validateUserForm, isFormValid } from '../utils/validators';
import '../styles/UserForm.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  department: '',
  role: '',
  phone: '',
  status: USER_STATUS.ACTIVE,
};

const UserForm = ({ initialData, onSubmit, onClose, isSubmitting }) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Pre-fill form when editing an existing user
  useEffect(() => {
    if (initialData) {
      setFormData({
        name:       initialData.name       ?? '',
        email:      initialData.email      ?? '',
        department: initialData.department ?? '',
        role:       initialData.role       ?? '',
        phone:      initialData.phone      ?? '',
        status:     initialData.status     ?? USER_STATUS.ACTIVE,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate touched fields on change for inline feedback
    if (touched[name]) {
      const newErrors = validateUserForm({ ...formData, [name]: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateUserForm(formData);
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields as touched to surface all errors at once
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validateUserForm(formData);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) return;

    onSubmit(formData);
  };

  const fieldError = (field) => touched[field] && errors[field];

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="user-form"
        role="dialog"
        aria-modal="true"
        aria-label={isEditMode ? 'Edit user' : 'Add new user'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-form__header">
          <h2 className="user-form__title">
            {isEditMode ? 'Edit User' : 'Add New User'}
          </h2>
          <button className="user-form__close" onClick={onClose} aria-label="Close form">
            ✕
          </button>
        </div>

        <form className="user-form__body" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className={`form-field ${fieldError('name') ? 'form-field--error' : ''}`}>
            <label className="form-field__label" htmlFor="form-name">Full Name *</label>
            <input
              id="form-name"
              className="form-field__input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Jane Doe"
              autoComplete="name"
            />
            {fieldError('name') && (
              <span className="form-field__error" role="alert">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className={`form-field ${fieldError('email') ? 'form-field--error' : ''}`}>
            <label className="form-field__label" htmlFor="form-email">Email Address *</label>
            <input
              id="form-email"
              className="form-field__input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. jane@company.com"
              autoComplete="email"
            />
            {fieldError('email') && (
              <span className="form-field__error" role="alert">{errors.email}</span>
            )}
          </div>

          {/* Department */}
          <div className={`form-field ${fieldError('department') ? 'form-field--error' : ''}`}>
            <label className="form-field__label" htmlFor="form-department">Department *</label>
            <select
              id="form-department"
              className="form-field__input"
              name="department"
              value={formData.department}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {fieldError('department') && (
              <span className="form-field__error" role="alert">{errors.department}</span>
            )}
          </div>

          {/* Role */}
          <div className={`form-field ${fieldError('role') ? 'form-field--error' : ''}`}>
            <label className="form-field__label" htmlFor="form-role">Role *</label>
            <input
              id="form-role"
              className="form-field__input"
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Senior Engineer"
            />
            {fieldError('role') && (
              <span className="form-field__error" role="alert">{errors.role}</span>
            )}
          </div>

          {/* Phone (optional) */}
          <div className={`form-field ${fieldError('phone') ? 'form-field--error' : ''}`}>
            <label className="form-field__label" htmlFor="form-phone">Phone</label>
            <input
              id="form-phone"
              className="form-field__input"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. +1 555 000 0000"
              autoComplete="tel"
            />
            {fieldError('phone') && (
              <span className="form-field__error" role="alert">{errors.phone}</span>
            )}
          </div>

          {/* Status */}
          <div className="form-field">
            <label className="form-field__label" htmlFor="form-status">Status</label>
            <select
              id="form-status"
              className="form-field__input"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {Object.values(USER_STATUS).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="user-form__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="btn-form-submit"
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
