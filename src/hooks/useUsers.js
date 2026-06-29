/**
 * @file useUsers.js
 * @description Custom React hook that encapsulates all user-data fetching logic.
 *
 * Separating data-fetching into a hook keeps components free of async boilerplate
 * and makes the logic independently testable and reusable across multiple views.
 *
 * Exposes: users, loading, error, refetch, createUser, updateUser, deleteUser.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getUsers as fetchUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from '../api/userService';

/**
 * Custom hook for managing the users collection.
 * @param {Object} [queryParams={}] - Optional query params forwarded to the API.
 * @returns {{
 *   users: Object[],
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function,
 *   createUser: Function,
 *   updateUser: Function,
 *   deleteUser: Function,
 * }}
 */
const useUsers = (queryParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ------------------------------------------------------------------
  // Fetch / Refetch
  // ------------------------------------------------------------------

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await fetchUsers(queryParams);

    if (fetchError) {
      setError(fetchError);
    } else {
      setUsers(data);
    }

    setLoading(false);
  // Stringify params to avoid stale closure issues with object identity
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryParams)]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ------------------------------------------------------------------
  // Create
  // ------------------------------------------------------------------

  /**
   * Creates a new user and optimistically appends it to local state.
   * Rolls back on failure.
   * @param {Object} userData
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  const createUser = useCallback(async (userData) => {
    const { data, error: createError } = await apiCreateUser(userData);
    if (createError) return { success: false, error: createError };

    setUsers((prev) => [...prev, data]);
    return { success: true, error: null };
  }, []);

  // ------------------------------------------------------------------
  // Update
  // ------------------------------------------------------------------

  /**
   * Updates an existing user in-place within local state.
   * @param {string|number} userId
   * @param {Object} updatedData
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  const updateUser = useCallback(async (userId, updatedData) => {
    const { data, error: updateError } = await apiUpdateUser(userId, updatedData);
    if (updateError) return { success: false, error: updateError };

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
    return { success: true, error: null };
  }, []);

  // ------------------------------------------------------------------
  // Delete
  // ------------------------------------------------------------------

  /**
   * Removes a user from local state after successful API deletion.
   * @param {string|number} userId
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  const deleteUser = useCallback(async (userId) => {
    const { error: deleteError } = await apiDeleteUser(userId);
    if (deleteError) return { success: false, error: deleteError };

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    return { success: true, error: null };
  }, []);

  return {
    users,
    loading,
    error,
    refetch: loadUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default useUsers;
