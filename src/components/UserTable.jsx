/**
 * @file UserTable.jsx
 * @description Data table that renders the paginated, filtered, sorted list of users.
 * Delegates individual row rendering to UserRow. Handles empty-state and loading-state UI.
 * Column headers are clickable for sorting.
 *
 * @param {Object}    props
 * @param {Object[]}  props.users        - The (already filtered + paginated) user array.
 * @param {boolean}   props.loading      - Whether data is being fetched.
 * @param {string}    props.sortField    - Currently active sort field key.
 * @param {string}    props.sortOrder    - 'asc' | 'desc'.
 * @param {Function}  props.onSort       - Callback: (field: string) => void.
 * @param {Function}  props.onEdit       - Callback: (user: Object) => void.
 * @param {Function}  props.onDelete     - Callback: (user: Object) => void.
 */

import React from 'react';
import UserRow from './UserRow';
import { SORT_ORDER } from '../utils/constants';
import '../styles/UserTable.css';

/** Column definitions: label shown in header and the sort field key. */
const COLUMNS = [
  { label: 'Name',       field: 'name' },
  { label: 'Department', field: 'department' },
  { label: 'Role',       field: 'role' },
  { label: 'Status',     field: 'status' },
  { label: 'Created',    field: 'createdAt' },
  { label: 'Actions',    field: null }, // not sortable
];

const SortIcon = ({ field, sortField, sortOrder }) => {
  if (field !== sortField) return <span className="sort-icon sort-icon--idle">⇅</span>;
  return (
    <span className="sort-icon sort-icon--active">
      {sortOrder === SORT_ORDER.ASC ? '↑' : '↓'}
    </span>
  );
};

const UserTable = ({ users, loading, sortField, sortOrder, onSort, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="user-table__loading" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>Loading users…</p>
      </div>
    );
  }

  return (
    <div className="user-table__wrapper">
      <table className="user-table" aria-label="Users data table">
        <thead className="user-table__head">
          <tr>
            {COLUMNS.map(({ label, field }) => (
              <th
                key={label}
                className={`user-table__th ${field ? 'user-table__th--sortable' : ''}`}
                onClick={field ? () => onSort(field) : undefined}
                aria-sort={
                  field === sortField
                    ? sortOrder === SORT_ORDER.ASC
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                scope="col"
              >
                {label}
                {field && (
                  <SortIcon
                    field={field}
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="user-table__body">
          {users.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="user-table__empty">
                No users found matching your criteria.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
