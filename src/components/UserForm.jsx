import '../styles/UserForm.css';
import { useState, useEffect } from 'react';
import { validateUserForm } from '../utils/validators.js';
import { DEPARTMENTS } from '../utils/constants.js';

/**
 * UserForm — modal for adding a new user or editing an existing one.
 * mode: "add" | "edit"
 * initialData: null for add, user object for edit
 */
const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

export default function UserForm({ isOpen, onClose, onSubmit, initialData, mode }) {

  const [formValues, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // When modal opens in edit mode, populate fields from initialData
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          email: initialData.email || '',
          department: initialData.department || '',
        });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, initialData, mode]);

  if (!isOpen) return null;

  function handleFieldChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  async function handleFormSubmit() {
    // Run validation before touching the API
    const validationErrors = validateUserForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(formValues);
    setSubmitting(false);

    if (result?.success) {
      onClose();
    }
  }

  function handleOverlayClick() {
    if (!submitting) onClose();
  }

  const isEditMode = mode === 'edit';

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="form-panel" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="form-header">
          <h2 className="form-title">
            {isEditMode ? '✏️ Edit User' : '➕ Add New User'}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="form-body">

          {/* First Name */}
          <div className="form-field">
            <label htmlFor="form-firstName">
              First Name <span className="required-star">*</span>
            </label>
            <input
              id="form-firstName"
              type="text"
              placeholder="e.g. John"
              value={formValues.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className={errors.firstName ? 'input-error' : ''}
            />
            {errors.firstName && (
              <span className="field-error">{errors.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div className="form-field">
            <label htmlFor="form-lastName">
              Last Name <span className="required-star">*</span>
            </label>
            <input
              id="form-lastName"
              type="text"
              placeholder="e.g. Smith"
              value={formValues.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className={errors.lastName ? 'input-error' : ''}
            />
            {errors.lastName && (
              <span className="field-error">{errors.lastName}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-field form-field-full">
            <label htmlFor="form-email">
              Email <span className="required-star">*</span>
            </label>
            <input
              id="form-email"
              type="email"
              placeholder="e.g. john@example.com"
              value={formValues.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          {/* Department */}
          <div className="form-field form-field-full">
            <label htmlFor="form-department">
              Department <span className="required-star">*</span>
            </label>
            <select
              id="form-department"
              value={formValues.department}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              className={errors.department ? 'input-error' : ''}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <span className="field-error">{errors.department}</span>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="form-footer">
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleFormSubmit}
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : isEditMode
                ? 'Update User'
                : 'Save User'}
          </button>
        </div>

      </div>
    </div>
  );
}