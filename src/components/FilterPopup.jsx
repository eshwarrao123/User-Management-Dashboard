/**
 * @file FilterPopup.jsx
 * @description Dropdown panel that allows users to filter the table by department
 * and/or status. Closes when the user clicks outside (handled via ref + effect in parent).
 *
 * @param {Object}   props
 * @param {Object}   props.filterCriteria          - Current active filter state.
 * @param {string}   props.filterCriteria.department
 * @param {string}   props.filterCriteria.status
 * @param {Function} props.onFilterChange          - Callback: (key, value) => void.
 * @param {Function} props.onReset                 - Callback to clear all filters.
 * @param {Function} props.onClose                 - Callback to close the popup.
 */

import React from 'react';
import { DEPARTMENTS, USER_STATUS } from '../utils/constants';
import '../styles/FilterPopup.css';

const FilterPopup = ({ filterCriteria, onFilterChange, onReset, onClose }) => {
  return (
    <aside
      className="filter-popup"
      role="dialog"
      aria-modal="true"
      aria-label="Filter users"
    >
      <div className="filter-popup__header">
        <h2 className="filter-popup__title">Filters</h2>
        <button
          className="filter-popup__close"
          onClick={onClose}
          aria-label="Close filters"
        >
          ✕
        </button>
      </div>

      <div className="filter-popup__body">
        {/* Department Filter */}
        <label className="filter-popup__label" htmlFor="filter-department">
          Department
        </label>
        <select
          id="filter-department"
          className="filter-popup__select"
          value={filterCriteria.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <label className="filter-popup__label" htmlFor="filter-status">
          Status
        </label>
        <select
          id="filter-status"
          className="filter-popup__select"
          value={filterCriteria.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {Object.values(USER_STATUS).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-popup__footer">
        <button className="btn btn--ghost" onClick={onReset}>
          Reset
        </button>
        <button className="btn btn--primary" onClick={onClose}>
          Apply
        </button>
      </div>
    </aside>
  );
};

export default FilterPopup;
