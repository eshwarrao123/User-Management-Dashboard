import { useEffect, useState, useMemo } from 'react';
import useUsers from './hooks/useUsers.js';
import Header from './components/Header.jsx';
import UserTable from './components/UserTable.jsx';
import SearchBar from './components/SearchBar.jsx';
import Pagination from './components/Pagination.jsx';
import FilterPopup from './components/FilterPopup.jsx';
import UserForm from './components/UserForm.jsx';
import ConfirmDelete from './components/ConfirmDelete.jsx';
import './styles/global.css';

function App() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    clearError,
  } = useUsers();

  // ─── UI STATE ─────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    firstName: '', lastName: '', email: '', department: '',
  });

  // ─── FORM STATE ───────────────────────────────────────────
  const [showUserForm, setShowUserForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);

  // ─── DELETE STATE ─────────────────────────────────────────
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // ─── TOAST STATE ──────────────────────────────────────────
  const [toast, setToast] = useState(null);

  // ─── FETCH ON MOUNT ───────────────────────────────────────
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
  }

  // ─── DERIVED DATA ─────────────────────────────────────────

  /**
   * Derived Data Pipeline
   * Why: We use useMemo instead of useEffect+useState to compute this synchronously during render,
   * avoiding extra renders. The 4-step pipeline ensures separation of concerns:
   * 1. Search: Filters full set by text query.
   * 2. Filter: Narrows down by specific fields.
   * 3. Sort: Orders the results.
   * 4. Paginate: Slices the ordered array for the current page.
   */
  const searchedUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const filteredUsers = useMemo(() => {
    return searchedUsers.filter((u) => {
      const f = filterCriteria;
      if (f.firstName && !u.firstName.toLowerCase().includes(f.firstName.toLowerCase())) return false;
      if (f.lastName && !u.lastName.toLowerCase().includes(f.lastName.toLowerCase())) return false;
      if (f.email && !u.email.toLowerCase().includes(f.email.toLowerCase())) return false;
      if (f.department && u.department !== f.department) return false;
      return true;
    });
  }, [searchedUsers, filterCriteria]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const valA = String(a[sortField]).toLowerCase();
      const valB = String(b[sortField]).toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  const activeFilterCount = Object.values(filterCriteria).filter(
    (v) => v.trim() !== ''
  ).length;

  // ─── HANDLERS: SEARCH / SORT / PAGE ──────────────────────

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  }

  function handlePageChange(page) { setCurrentPage(page); }
  function handlePageSizeChange(size) { setPageSize(size); setCurrentPage(1); }

  function handleApplyFilter(criteria) {
    setFilterCriteria(criteria);
    setCurrentPage(1);
  }

  function handleClearFilter() {
    setFilterCriteria({ firstName: '', lastName: '', email: '', department: '' });
    setCurrentPage(1);
  }

  // ─── HANDLERS: ADD / EDIT ─────────────────────────────────

  function handleOpenAddForm() {
    clearError();
    setSelectedUser(null);
    setFormMode('add');
    setShowUserForm(true);
  }

  function handleOpenEditForm(user) {
    clearError();
    setSelectedUser(user);
    setFormMode('edit');
    setShowUserForm(true);
  }

  function handleCloseForm() {
    setShowUserForm(false);
    setSelectedUser(null);
  }

  async function handleFormSubmit(formData) {
    clearError();
    if (formMode === 'add') {
      const result = await addUser(formData);
      if (result.success) {
        showToast('User added successfully!', 'success');
      } else {
        showToast('Failed to add user. Try again.', 'error');
      }
      return result;
    }

    if (formMode === 'edit') {
      const result = await updateUser(selectedUser.id, formData);
      if (result.success) {
        showToast('User updated successfully!', 'success');
      } else {
        showToast('Failed to update user. Try again.', 'error');
      }
      return result;
    }
  }

  // ─── HANDLERS: DELETE ─────────────────────────────────────

  function handleDeleteClick(user) {
    clearError();
    setUserToDelete(user);
    setShowConfirmDelete(true);
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return;
    const result = await deleteUser(userToDelete.id);
    if (result.success) {
      showToast(
        `${userToDelete.firstName} ${userToDelete.lastName} deleted.`,
        'success'
      );
    } else {
      showToast('Failed to delete user. Try again.', 'error');
    }
    setShowConfirmDelete(false);
    setUserToDelete(null);
  }

  function handleCancelDelete() {
    setShowConfirmDelete(false);
    setUserToDelete(null);
  }

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="app">
      <Header onAddUser={handleOpenAddForm} />

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={clearError} className="error-close">✕</button>
          </div>
        )}

        <div className="toolbar">
          <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
          <button
            className={`btn-filter ${activeFilterCount > 0 ? 'btn-filter-active' : ''}`}
            onClick={() => setShowFilterPopup(true)}
          >
            ⚙ Filter
            {activeFilterCount > 0 && (
              <span className="filter-count-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>

        <UserTable
          users={paginatedUsers}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteClick}
          loading={loading}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={sortedUsers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </main>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      {/* Modals */}
      <FilterPopup
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
        initialFilters={filterCriteria}
      />

      <UserForm
        isOpen={showUserForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
        mode={formMode}
      />

      <ConfirmDelete
        isOpen={showConfirmDelete}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default App;