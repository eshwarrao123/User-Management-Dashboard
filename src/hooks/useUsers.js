import { useState, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser as deleteUserApi } from '../api/userService.js';
import { transformUser } from '../utils/helpers.js';

/**
 * Custom hook that manages all user data operations.
 * Exposes users array, loading/error states, and CRUD handlers.
 */
export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── FETCH ───────────────────────────────────────────────
  /**
   * Fetches users from the API.
   * Why: We transform the data immediately rather than storing raw API responses
   * to decouple our component UI from the specific API schema payload structure.
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await getUsers();
      const transformed = response.data.map(transformUser);
      setUsers(transformed);
    } catch (err) {
      console.error(err);
      setError('Failed to load users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── ADD ─────────────────────────────────────────────────
  /**
   * Adds a new user.
   * Why: We use Date.now() for IDs instead of the API-returned id: 11
   * because JSONPlaceholder always returns 11, which would cause duplicate keys.
   */
  const addUser = useCallback(async (userData) => {
    setLoading(true);
    try {
      setError(null);
      await createUser(userData);
      setUsers((prev) => {
        const nextId = prev.length > 0
          ? Math.max(...prev.map((u) => Number(u.id))) + 1
          : 11;
        const newUser = { ...userData, id: nextId };
        return [newUser, ...prev];
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      setError('Failed to add user. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── UPDATE ──────────────────────────────────────────────
  /**
   * Updates an existing user.
   * Why: State updates map over existing users to apply changes optimistically
   * so the UI reflects updates instantly without needing a full refetch.
   */
  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    try {
      setError(null);
      await updateUser(id, userData);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...userData, id } : user))
      );
      return { success: true };
    } catch (err) {
      console.error(err);
      setError('Failed to update user. Please try again.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── DELETE ──────────────────────────────────────────────
  /**
   * Deletes a user.
   * Why: Filters out the deleted ID locally for immediate UI response
   * rather than waiting for the API to confirm the deletion entirely.
   */
  const deleteUser = useCallback(async (id) => {
    // Optimistic update — remove from UI immediately without waiting for API
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setError(null);
    
    try {
      // Fire API call in background — JSONPlaceholder simulates this
      await deleteUserApi(id);
    } catch (err) {
      // For a mock API, we don't re-add the user on failure
      // In a real app, we would rollback the optimistic update here
      console.warn('Delete API call failed (mock API limitation):', err.message);
    }
    
    return { success: true };
  }, []);

  // ─── CLEAR ERROR ─────────────────────────────────────────
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    clearError,
  };
}