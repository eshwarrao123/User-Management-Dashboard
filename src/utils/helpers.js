/**
 * @file helpers.js
 * @description General-purpose utility functions for the User Management Dashboard.
 * These are pure functions with no side-effects, making them easy to test and reuse.
 */

import { SORT_ORDER } from './constants';

/**
 * Sorts an array of user objects by a given field and direction.
 * Performs a stable sort — preserves original order of equal elements.
 * @param {Object[]} users - Array of user objects to sort.
 * @param {string} field - The key to sort by (e.g. 'name', 'email').
 * @param {string} order - Sort direction: 'asc' or 'desc'.
 * @returns {Object[]} A new sorted array (does not mutate the original).
 */
export const sortUsers = (users, field, order) => {
  if (!field) return [...users];

  return [...users].sort((a, b) => {
    const aVal = String(a[field] ?? '').toLowerCase();
    const bVal = String(b[field] ?? '').toLowerCase();

    if (aVal < bVal) return order === SORT_ORDER.ASC ? -1 : 1;
    if (aVal > bVal) return order === SORT_ORDER.ASC ? 1 : -1;
    return 0;
  });
};

/**
 * Filters an array of users based on a search query (name or email match)
 * and additional filter criteria (department, status).
 * @param {Object[]} users - Full list of users.
 * @param {string} searchQuery - Free-text search string.
 * @param {Object} filterCriteria - Structured filter options.
 * @param {string} [filterCriteria.department] - Department to filter by.
 * @param {string} [filterCriteria.status] - Status to filter by.
 * @returns {Object[]} Filtered array of users.
 */
export const filterUsers = (users, searchQuery, filterCriteria = {}) => {
  const query = searchQuery?.trim().toLowerCase() ?? '';

  return users.filter((user) => {
    // Free-text search across name and email
    const matchesSearch =
      !query ||
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query);

    // Department filter
    const matchesDepartment =
      !filterCriteria.department ||
      user.department === filterCriteria.department;

    // Status filter
    const matchesStatus =
      !filterCriteria.status || user.status === filterCriteria.status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });
};

/**
 * Paginates an array, returning only the slice for the requested page.
 * @param {Array} items - The full array to paginate.
 * @param {number} currentPage - The 1-indexed page number.
 * @param {number} pageSize - Number of items per page.
 * @returns {Array} The slice of items for the given page.
 */
export const paginateItems = (items, currentPage, pageSize) => {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
};

/**
 * Calculates the total number of pages for a dataset.
 * @param {number} totalItems - Total number of items.
 * @param {number} pageSize - Items per page.
 * @returns {number} Total page count (minimum 1).
 */
export const getTotalPages = (totalItems, pageSize) =>
  Math.max(1, Math.ceil(totalItems / pageSize));

/**
 * Returns a debounced version of a function that delays invocation by `delay` ms.
 * Useful for search inputs to avoid firing an API call on every keystroke.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Milliseconds to wait before invoking fn.
 * @returns {Function} Debounced function.
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Formats a date string into a human-readable locale format.
 * @param {string|Date} dateInput - ISO date string or Date object.
 * @param {string} [locale='en-US'] - BCP 47 locale string.
 * @returns {string} Formatted date, or '—' if input is falsy.
 */
export const formatDate = (dateInput, locale = 'en-US') => {
  if (!dateInput) return '—';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateInput));
};

/**
 * Generates initials from a full name string (up to 2 characters).
 * Used for avatar placeholder fallbacks.
 * @param {string} name - Full name.
 * @returns {string} Uppercase initials (e.g. 'John Doe' → 'JD').
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};
