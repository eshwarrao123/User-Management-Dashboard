import { getDepartmentColor } from '../utils/helpers.js';
import UserRow from './UserRow.jsx';
import '../styles/UserTable.css';

/**
 * UserTable — renders the full data table with sortable column headers.
 * Handles loading skeleton and empty state internally.
 * The # column shows position within the current page, not the user's ID.
 */
export default function UserTable({ users, sortField, sortOrder, onSort, onEdit, onDelete, loading }) {

  const sortableColumns = [
    { key: 'id',         label: 'ID' },
    { key: 'firstName',  label: 'First Name' },
    { key: 'lastName',   label: 'Last Name' },
    { key: 'email',      label: 'Email' },
    { key: 'department', label: 'Department' },
  ];

  function renderSortIndicator(key) {
    if (sortField !== key) return <span className="sort-arrow inactive">↕</span>;
    return (
      <span className="sort-arrow active">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              {sortableColumns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="skeleton-row">
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j}><div className="skeleton-cell" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>No users found.</p>
          <small>Try adjusting your search or filters.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table" role="table">
        <thead>
          <tr>
            {/* # column is not sortable — it reflects page position only */}
            <th scope="col" className="col-index">#</th>
            {sortableColumns.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                className={`sortable-th ${sortField === col.key ? 'active-sort' : ''}`}
                scope="col"
              >
                {col.label} {renderSortIndicator(col.key)}
              </th>
            ))}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              rowIndex={index + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}