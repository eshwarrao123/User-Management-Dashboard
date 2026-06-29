import { useEffect } from 'react';
import { getDepartmentColor } from '../utils/helpers.js';
import '../styles/ConfirmDelete.css';

/**
 * ConfirmDelete — safety confirmation modal before deleting a user.
 * Pressing Escape or clicking the overlay cancels the action.
 */
export default function ConfirmDelete({ isOpen, user, onConfirm, onCancel }) {

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !user) return null;

  const deptColors = getDepartmentColor(user.department);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-panel" onClick={(e) => e.stopPropagation()}>

        <div className="confirm-header">
          <span className="confirm-icon">⚠️</span>
          <h2 className="confirm-title">Delete User</h2>
        </div>

        <div className="confirm-body">
          <p className="confirm-message">
            Are you sure you want to delete{' '}
            <strong>{user.firstName} {user.lastName}</strong>?
          </p>
          <p className="confirm-sub">This action cannot be undone.</p>
        </div>

        <div className="confirm-user-card">
          <div className="confirm-user-info">
            <span className="confirm-user-avatar">
              {user.firstName[0]}{user.lastName[0]}
            </span>
            <div>
              <p className="confirm-user-name">{user.firstName} {user.lastName}</p>
              <p className="confirm-user-email">{user.email}</p>
            </div>
          </div>
          <span
            className="department-badge"
            style={{
              background: deptColors.bg,
              color: deptColors.color,
              border: `1px solid ${deptColors.border}`,
            }}
          >
            {user.department}
          </span>
        </div>

        <div className="confirm-footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            🗑️ Delete User
          </button>
        </div>

      </div>
    </div>
  );
}