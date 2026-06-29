import { getDepartmentColor } from '../utils/helpers.js';
import '../styles/UserRow.css';

/**
 * UserRow — renders a single user as a table row.
 * rowIndex is the 1-based position within the current page (not the user's database ID).
 */
export default function UserRow({ user, rowIndex, onEdit, onDelete }) {
  const deptColors = getDepartmentColor(user.department);

  return (
    <tr className="user-row">
      <td className="row-index">{rowIndex}</td>
      <td>{user.id}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>
        <a
          href={`mailto:${user.email}`}
          className="email-link"
        >
          {user.email}
        </a>
      </td>
      <td>
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
      </td>
      <td className="actions-cell">
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(user)}
          aria-label={`Edit ${user.firstName} ${user.lastName}`}
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={() => onDelete(user)}
          aria-label={`Delete ${user.firstName} ${user.lastName}`}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}