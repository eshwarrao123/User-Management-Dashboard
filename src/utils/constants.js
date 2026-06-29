/**
 * @file constants.js
 * @description Application-wide constants used across the User Management Dashboard.
 * Centralizing these values prevents magic strings/numbers scattered through the codebase.
 */

/** Base URL for the users REST API. Override via .env VITE_API_URL at build time. */
export const API_URL = import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com/users';

/**
 * List of available departments for filtering and form selection.
 * @type {string[]}
 */
export const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'IT',
  'Operations',
];

/**
 * Options for the number of rows displayed per page in the user table.
 * @type {number[]}
 */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/** Default number of rows per page on initial load. */
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[1]; // 10

/** Supported sort directions. */
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

/** Field keys available for sorting the user table. */
export const SORT_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  DEPARTMENT: 'department',
  ROLE: 'role',
  STATUS: 'status',
};

/** User status values. */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
};
