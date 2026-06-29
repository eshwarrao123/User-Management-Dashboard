/**
 * @file App.jsx
 * @description Root application component for the User Management Dashboard.
 *
 * Owns all top-level UI state and orchestrates data flow between:
 * - useUsers hook (remote data + mutations)
 * - Filtering / sorting / pagination derived state
 * - Modal visibility flags
 *
 * Design principle: "One source of truth at the top." All child components
 * receive data and callbacks as props — no prop-drilling workarounds needed
 * at this scale. If state grows significantly, consider React Context or Zustand.
 */

import React, { useState, useMemo, useCallback } from 'react';

import Header      from './components/Header';
import SearchBar   from './components/SearchBar';
import FilterPopup from './components/FilterPopup';
import UserTable   from './components/UserTable';
import Pagination  from './components/Pagination';
import UserForm    from './components/UserForm';
import ConfirmDelete from './components/ConfirmDelete';

import useUsers from './hooks/useUsers';
import { filterUsers, sortUsers, paginateItems, getTotalPages } from './utils/helpers';
import { SORT_ORDER, DEFAULT_PAGE_SIZE } from './utils/constants';

import './styles/App.css';

const App = () => {
  // ------------------------------------------------------------------
  // Remote data via custom hook
  // ------------------------------------------------------------------
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();

  // ------------------------------------------------------------------
  // Search & Filter state
  // ------------------------------------------------------------------
  const [searchQuery,    setSearchQuery]    = useState('');
  const [filterCriteria, setFilterCriteria] = useState({ department: '', status: '' });
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // ------------------------------------------------------------------
  // Sort state
  // ------------------------------------------------------------------
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.ASC);

  // ------------------------------------------------------------------
  // Pagination state
  // ------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize,    setPageSize]    = useState(DEFAULT_PAGE_SIZE);

  // ------------------------------------------------------------------
  // Modal visibility flags
  // ------------------------------------------------------------------
  const [showUserForm,     setShowUserForm]     = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // ------------------------------------------------------------------
  // Selected user (for edit / delete flows)
  // ------------------------------------------------------------------
  const [selectedUser, setSelectedUser] = useState(null);

  // ------------------------------------------------------------------
  // In-flight mutation flags
  // ------------------------------------------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting,   setIsDeleting]   = useState(false);

  // ------------------------------------------------------------------
  // Derived data (memoised to avoid redundant recalculation)
  // ------------------------------------------------------------------
  const filteredUsers = useMemo(
    () => filterUsers(users, searchQuery, filterCriteria),
    [users, searchQuery, filterCriteria]
  );

  const sortedUsers = useMemo(
    () => sortUsers(filteredUsers, sortField, sortOrder),
    [filteredUsers, sortField, sortOrder]
  );

  const totalPages    = useMemo(() => getTotalPages(sortedUsers.length, pageSize), [sortedUsers.length, pageSize]);
  const paginatedUsers = useMemo(
    () => paginateItems(sortedUsers, currentPage, pageSize),
    [sortedUsers, currentPage, pageSize]
  );

  // ------------------------------------------------------------------
  // Sort handler — toggles direction when same field is clicked twice
  // ------------------------------------------------------------------
  const handleSort = useCallback((field) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortOrder((o) => (o === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC));
        return prev;
      }
      setSortOrder(SORT_ORDER.ASC);
      return field;
    });
    setCurrentPage(1);
  }, []);

  // ------------------------------------------------------------------
  // Filter handlers
  // ------------------------------------------------------------------
  const handleFilterChange = useCallback((key, value) => {
    setFilterCriteria((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilterCriteria({ department: '', status: '' });
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  // ------------------------------------------------------------------
  // Pagination handlers
  // ------------------------------------------------------------------
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // ------------------------------------------------------------------
  // UserForm handlers
  // ------------------------------------------------------------------
  const openAddForm = useCallback(() => {
    setSelectedUser(null);
    setShowUserForm(true);
  }, []);

  const openEditForm = useCallback((user) => {
    setSelectedUser(user);
    setShowUserForm(true);
  }, []);

  const closeUserForm = useCallback(() => {
    setShowUserForm(false);
    setSelectedUser(null);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    let result;

    if (selectedUser) {
      result = await updateUser(selectedUser.id, formData);
    } else {
      result = await createUser(formData);
    }

    setIsSubmitting(false);

    if (!result.error) {
      closeUserForm();
    } else {
      // Surface API errors — in a full app, use a toast notification here
      console.error('Submit error:', result.error);
    }
  }, [selectedUser, createUser, updateUser, closeUserForm]);

  // ------------------------------------------------------------------
  // ConfirmDelete handlers
  // ------------------------------------------------------------------
  const openConfirmDelete = useCallback((user) => {
    setSelectedUser(user);
    setShowConfirmDelete(true);
  }, []);

  const closeConfirmDelete = useCallback(() => {
    setShowConfirmDelete(false);
    setSelectedUser(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    const result = await deleteUser(selectedUser.id);
    setIsDeleting(false);

    if (!result.error) {
      closeConfirmDelete();
    } else {
      console.error('Delete error:', result.error);
    }
  }, [selectedUser, deleteUser, closeConfirmDelete]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="app">
      <Header onAddUser={openAddForm} />

      <main className="app__main" id="main-content">
        {/* Global error banner */}
        {error && (
          <div className="app__error-banner" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Toolbar: search + filter toggle */}
        <div className="app__toolbar">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />

          <div className="app__filter-wrapper">
            <button
              id="btn-toggle-filter"
              className={`btn btn--secondary ${showFilterPopup ? 'btn--active' : ''}`}
              onClick={() => setShowFilterPopup((prev) => !prev)}
              aria-expanded={showFilterPopup}
              aria-haspopup="dialog"
            >
              ⚙️ Filters
              {(filterCriteria.department || filterCriteria.status) && (
                <span className="filter-badge" aria-label="Active filters">●</span>
              )}
            </button>

            {showFilterPopup && (
              <FilterPopup
                filterCriteria={filterCriteria}
                onFilterChange={handleFilterChange}
                onReset={handleFilterReset}
                onClose={() => setShowFilterPopup(false)}
              />
            )}
          </div>
        </div>

        {/* Data table */}
        <UserTable
          users={paginatedUsers}
          loading={loading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={openEditForm}
          onDelete={openConfirmDelete}
        />

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedUsers.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </main>

      {/* Modals */}
      {showUserForm && (
        <UserForm
          initialData={selectedUser}
          onSubmit={handleFormSubmit}
          onClose={closeUserForm}
          isSubmitting={isSubmitting}
        />
      )}

      {showConfirmDelete && (
        <ConfirmDelete
          user={selectedUser}
          onConfirm={handleDeleteConfirm}
          onCancel={closeConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default App;
