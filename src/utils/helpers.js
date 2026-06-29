import { SORT_ORDER, DEPARTMENTS } from './constants.js';

/**
 * Assigns a department by rotating through the DEPARTMENTS array.
 * We use (id - 1) so that id=1 maps to index 0 (Engineering), not index 1.
 */
export function generateDepartment(id) {
  return DEPARTMENTS[(Math.max(0, id - 1)) % DEPARTMENTS.length];
}

/**
 * Transforms a raw JSONPlaceholder user object into our app's shape.
 * Splits "Leanne Graham" → firstName: "Leanne", lastName: "Graham".
 * Three-word names like "Mary Jane Watson" → firstName: "Mary", lastName: "Jane Watson".
 */
export function transformUser(apiUser) {
  const parts = apiUser.name.trim().split(' ');
  return {
    id: apiUser.id,
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
    email: apiUser.email,
    department: generateDepartment(apiUser.id),
  };
}

/**
 * Returns background, text, and border colors for a department badge.
 * Kept here so UserRow and ConfirmDelete both use the same color mapping
 * without duplicating the object in two places.
 */
export function getDepartmentColor(department) {
  const colorMap = {
    Engineering: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
    Design:      { bg: '#fce7f3', color: '#be185d', border: '#fbcfe8' },
    Marketing:   { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
    Sales:       { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
    HR:          { bg: '#f3e8ff', color: '#7c3aed', border: '#e9d5ff' },
    Finance:     { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' },
    IT:          { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
    Operations:  { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  };
  return colorMap[department] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
}

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
