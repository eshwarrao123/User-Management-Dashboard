/**
 * @file ConfirmDelete.jsx
 * @description Confirmation dialog shown before permanently deleting a user.
 * Prevents accidental data loss by requiring an explicit confirm action.
 *
 * @param {Object}   props
 * @param {Object}   props.user          - The user object targeted for deletion.
 * @param {Function} props.onConfirm     - Callback invoked when deletion is confirmed.
 * @param {Function} props.onCancel      - Callback invoked when the dialog is dismissed.
 * @param {boolean}  props.isDeleting    - Disables buttons while delete is in flight.
 */

import React from 'react';
import '../styles/ConfirmDelete.css';

const ConfirmDelete = ({ user, onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-delete"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-desc"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="confirm-delete__icon" aria-hidden="true">🗑️</div>

        <h2 id="confirm-delete-title" className="confirm-delete__title">
          Delete User
        </h2>

        <p id="confirm-delete-desc" className="confirm-delete__message">
          Are you sure you want to permanently delete{' '}
          <strong>{user?.name ?? 'this user'}</strong>? This action cannot be
          undone.
        </p>

        <div className="confirm-delete__actions">
          <button
            id="btn-delete-cancel"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="btn-delete-confirm"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
