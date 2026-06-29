# User Management Dashboard

A full-featured User Management Dashboard built with React, allowing administrators to view, search, filter, sort, add, edit, and delete users through a clean and responsive interface.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework with functional components and hooks |
| Vite | Build tool and dev server |
| Axios | HTTP client for REST API communication |
| JSONPlaceholder | Mock REST API for user data |
| Vitest | Unit test runner |
| React Testing Library | Component testing utilities |

---

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- npm

### Installation

```bash
# Navigate into the project directory
cd user-management-dashboard

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── api/
│   └── userService.js        # Axios functions for GET, POST, PUT, DELETE
│
├── components/
│   ├── Header.jsx            # Top navigation bar with app title and Add User button
│   ├── UserTable.jsx         # Data table with sortable headers, skeleton, empty state
│   ├── UserRow.jsx           # Individual table row with Edit and Delete actions
│   ├── UserForm.jsx          # Modal form for adding and editing users
│   ├── SearchBar.jsx         # Real-time search input with clear button
│   ├── FilterPopup.jsx       # Multi-field filter panel with Apply and Clear
│   ├── Pagination.jsx        # Page controls with size selector and result count
│   └── ConfirmDelete.jsx     # Safety confirmation modal before deletion
│
├── hooks/
│   └── useUsers.js           # Custom hook managing all user state and API calls
│
├── utils/
│   ├── validators.js         # Form validation functions and validateUserForm
│   ├── constants.js          # API_URL, DEPARTMENTS array, PAGE_SIZE_OPTIONS
│   └── helpers.js            # helper functions for formatting, sorting, and pagination
│
├── styles/                   # Component-specific CSS and global variables
│   ├── App.css               # Layout styling
│   ├── index.css             # Global reset and tokens
│   └── ...                   # Component-specific styles
│
├── tests/
│   ├── setup.js              # Testing library configuration
│   ├── validators.test.js    # Unit tests for all validator functions
│   ├── helpers.test.js       # Unit tests for helpers
│   ├── SearchBar.test.jsx    # Component tests for search input behaviour
│   ├── Pagination.test.jsx   # Component tests for page controls
│   └── UserForm.test.jsx     # Component tests for form validation and submission
│
├── App.jsx                   # Root component with all state and derived data logic
└── main.jsx                  # Application entry point
```

---

## Features

### View Users
Fetches all users from the JSONPlaceholder `/users` endpoint on mount using a custom `useUsers` hook. 

### Search & Filter
Real-time filtering across name and email fields. A modal panel allows narrowing results by Department and Status. Active filters display as badges on the trigger button.

### Sort
Clicking any column header sorts the visible results by that field. Clicking the same header again toggles between ascending and descending order.

### Pagination
Supports multiple page sizes. Shows a result count. Page boundaries disable Prev/Next buttons automatically.

### Add & Edit User
A modal form with validation. On valid submission, sends a `POST` or `PUT` request to the API.

### Delete User
Clicking the delete icon opens a confirmation modal before deletion.

### Error Handling
All API calls are wrapped in `try/catch` blocks inside the `useUsers` hook. Failures surface as a dismissable error banner at the top of the page without crashing the application.
