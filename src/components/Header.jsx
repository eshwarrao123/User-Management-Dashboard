import React from 'react';
import '../styles/Header.css';

export default function Header({ onAddUser }) {
  return (
    <header className="app-header">
      <h1 className="app-title">👥 UserHub</h1>
      <button className="btn-add" onClick={onAddUser}>
        + Add User
      </button>
    </header>
  );
}