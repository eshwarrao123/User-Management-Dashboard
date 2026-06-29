/**
 * @file UserRow.jsx
 * @description Renders a single row within the UserTable.
 * Stateless — receives user data and callbacks for edit / delete actions.
 *
 * @param {Object}   props
 * @param {Object}   props.user         - User object to display.
 * @param {Function} props.onEdit       - Callback invoked with the user to edit.
 * @param {Function} props.onDelete     - Callback invoked with the user to delete.
 */

import React from 'react';
import { getInitials, formatDate } from '../utils/helpers';
import '../styles/UserRow.css';

/** Maps status values to CSS modifier classes. */
const STATUS_CLASS = {
  active: 'badge--success',
  inactive: 'badge--danger',
  pending: 'badge--warning',
};

const UserRow = ({ user, onEdit, onDelete }) => {
  const { id, name, email, department, role, status, createdAt } = user;
  const initials = getInitials(name);
  const badgeClass = STATUS_CLASS[status] ?? 'badge--neutral';

  return (
    <tr className="user-row" data-user-id={id}>
      {/* Avatar + Name */}
      <td className="user-row__cell user-row__cell--name">
        <div className="user-row__identity">
          <span className="user-row__avatar" aria-hidden="true">
            {initials}
          </span>
          <div>
            <span className="user-row__name">{name}</span>
            <span className="user-row__email">{email}</span>
          </div>
        </div>
      </td>

      <td className="user-row__cell">{department || '—'}</td>
      <td className="user-row__cell">{role || '—'}</td>

      {/* Status Badge */}
      <td className="user-row__cell">
        <span className={`badge ${badgeClass}`}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'}
        </span>
      </td>

      <td className="user-row__cell">{formatDate(createdAt)}</td>

      {/* Actions */}
      <td className="user-row__cell user-row__cell--actions">
        <button
          id={`btn-edit-${id}`}
          className="btn btn--icon"
          onClick={() => onEdit(user)}
          aria-label={`Edit ${name}`}
          title="Edit user"
        >
          ✏️
        </button>
        <button
          id={`btn-delete-${id}`}
          className="btn btn--icon btn--danger-icon"
          onClick={() => onDelete(user)}
          aria-label={`Delete ${name}`}
          title="Delete user"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
