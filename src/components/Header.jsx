/**
 * @file Header.jsx
 * @description Top navigation bar for the User Management Dashboard.
 * Renders the app title, global action buttons (Add User), and the current
 * user session info placeholder. Kept stateless — all actions bubble up via props.
 *
 * @param {Object}   props
 * @param {Function} props.onAddUser - Callback to open the UserForm in create mode.
 */

import React from 'react';
import '../styles/Header.css';

const Header = ({ onAddUser }) => {
  return (
    <header className="header" role="banner">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">👥</span>
        <h1 className="header__title">User Management</h1>
      </div>

      <nav className="header__actions" aria-label="Primary actions">
        <button
          id="btn-add-user"
          className="btn btn--primary"
          onClick={onAddUser}
          aria-label="Add new user"
        >
          + Add User
        </button>
      </nav>
    </header>
  );
};

export default Header;
