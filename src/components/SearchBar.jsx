/**
 * @file SearchBar.jsx
 * @description Controlled search input used to filter the user list by name or email.
 * Debouncing is intentionally left to the parent (via helpers.debounce) to keep
 * this component pure and reusable in other contexts.
 *
 * @param {Object}   props
 * @param {string}   props.value       - Current search query value (controlled).
 * @param {Function} props.onChange    - Callback receiving the new query string.
 * @param {string}   [props.placeholder] - Input placeholder text.
 */

import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search by name or email…',
}) => {
  const handleChange = (e) => onChange(e.target.value);

  const handleClear = () => onChange('');

  return (
    <div className="search-bar" role="search">
      <span className="search-bar__icon" aria-hidden="true">🔍</span>
      <input
        id="input-search"
        type="search"
        className="search-bar__input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search users"
        autoComplete="off"
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
