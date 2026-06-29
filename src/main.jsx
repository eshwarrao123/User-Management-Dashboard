/**
 * @file main.jsx
 * @description Application entry point.
 * Mounts the React tree into the DOM and wraps it with BrowserRouter for routing.
 * StrictMode is intentionally enabled in development to surface lifecycle issues early.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
