/**
 * @file userService.js
 * @description Axios-based API service for all User CRUD operations.
 *
 * All functions are async and wrap their calls in try/catch so callers receive
 * a consistent `{ data, error }` shape rather than raw exceptions.
 * The API_URL is sourced from constants so it can be swapped via env vars.
 */

import axios from 'axios';
import { API_URL } from '../utils/constants';

/** Pre-configured axios instance with the base URL and default headers. */
const apiClient = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000, // 10 second timeout
});

// ---------------------------------------------------------------------------
// Response interceptor — normalise error shape from the server
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ---------------------------------------------------------------------------
// CRUD Operations
// ---------------------------------------------------------------------------

/**
 * Fetches a paginated list of users.
 * Supports optional query params for server-side filtering / pagination.
 * @param {Object} [params={}] - Optional query parameters (page, limit, search…).
 * @returns {Promise<{data: Object[], error: string|null}>}
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await apiClient.get('/', { params });
    return { data: response.data, error: null };
  } catch (err) {
    console.error('[userService] getUsers failed:', err.message);
    return { data: [], error: err.message };
  }
};

/**
 * Creates a new user record on the server.
 * @param {Object} userData - The user payload to POST.
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.department
 * @param {string} userData.role
 * @param {string} [userData.phone]
 * @param {string} [userData.status]
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/', userData);
    return { data: response.data, error: null };
  } catch (err) {
    console.error('[userService] createUser failed:', err.message);
    return { data: null, error: err.message };
  }
};

/**
 * Updates an existing user record by ID.
 * Uses PUT (full replace). Swap to PATCH here if partial updates are needed.
 * @param {string|number} userId - The ID of the user to update.
 * @param {Object} updatedData - The new user payload.
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export const updateUser = async (userId, updatedData) => {
  try {
    const response = await apiClient.put(`/${userId}`, updatedData);
    return { data: response.data, error: null };
  } catch (err) {
    console.error(`[userService] updateUser(${userId}) failed:`, err.message);
    return { data: null, error: err.message };
  }
};

/**
 * Deletes a user record by ID.
 * @param {string|number} userId - The ID of the user to delete.
 * @returns {Promise<{data: boolean, error: string|null}>}
 */
export const deleteUser = async (userId) => {
  try {
    await apiClient.delete(`/${userId}`);
    return { data: true, error: null };
  } catch (err) {
    console.error(`[userService] deleteUser(${userId}) failed:`, err.message);
    return { data: false, error: err.message };
  }
};
