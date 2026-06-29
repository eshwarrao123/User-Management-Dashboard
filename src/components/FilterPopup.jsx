import '../styles/FilterPopup.css';
import { useState, useEffect } from 'react';
import { DEPARTMENTS } from '../utils/constants.js';

/**
 * FilterPopup — modal panel for filtering users by multiple fields.
 * Controlled by isOpen prop. Calls onApply with filter criteria object.
 */
export default function FilterPopup({ isOpen, onClose, onApply, onClear, initialFilters }) {
  const [filterState, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });

  // Sync local state when initialFilters changes (e.g. after clear from outside)
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Don't render anything when closed
  if (!isOpen) return null;

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function handleApply() {
    onApply(filterState);
    onClose();
  }

  function handleClear() {
    const empty = { firstName: '', lastName: '', email: '', department: '' };
    setFilters(empty);
    onClear();
    onClose();
  }

  // Count how many filterState are active
  const activeCount = Object.values(filterState).filter((v) => v.trim() !== '').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Stop click from bubbling to overlay */}
      <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
        <div className="filter-header">
          <h2 className="filter-title">Filter Users</h2>
          {activeCount > 0 && (
            <span className="filter-badge">{activeCount} active</span>
          )}
          <button className="modal-close" onClick={onClose} aria-label="Close filter">
            ✕
          </button>
        </div>

        <div className="filter-body">
          <div className="filter-field">
            <label htmlFor="filter-firstName">First Name</label>
            <input
              id="filter-firstName"
              type="text"
              placeholder="e.g. John"
              value={filterState.firstName}
              onChange={(e) => handleFilterChange('firstName', e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-lastName">Last Name</label>
            <input
              id="filter-lastName"
              type="text"
              placeholder="e.g. Smith"
              value={filterState.lastName}
              onChange={(e) => handleFilterChange('lastName', e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-email">Email</label>
            <input
              id="filter-email"
              type="text"
              placeholder="e.g. john@example.com"
              value={filterState.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label htmlFor="filter-department">Department</label>
            <select
              id="filter-department"
              value={filterState.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-footer">
          <button className="btn-secondary" onClick={handleClear}>
            Clear All
          </button>
          <button className="btn-primary" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}