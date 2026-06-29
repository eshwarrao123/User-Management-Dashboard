const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const readFile = (p) => fs.readFileSync(path.join(srcDir, p), 'utf-8');
const writeFile = (p, content) => fs.writeFileSync(path.join(srcDir, p), content, 'utf-8');

// 1. CONSTANTS
let constants = readFile('utils/constants.js');
constants = constants.replace(/export const PAGE_SIZE_OPTIONS = \[.*?\];/g, 'export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];');
constants = constants.replace(/export const DEPARTMENTS = \[\s*[\s\S]*?\];/g, "export const DEPARTMENTS = [\n  'Engineering',\n  'Design',\n  'Marketing',\n  'Sales',\n  'HR',\n  'Finance',\n  'IT',\n  'Operations',\n];");
writeFile('utils/constants.js', constants);

// 2. HELPERS
let helpers = readFile('utils/helpers.js');
helpers = helpers.replace(/export const transformUser = \(apiUser\) => \{[\s\S]*?\};/g, 
"/**\n * Generates a deterministic department based on user ID.\n * Why: We use (id - 1) % length so that ID 1 maps to index 0, preventing an off-by-one mapping\n * while keeping departments consistently assigned per user without storing them.\n */\nexport function generateDepartment(id) {\n  const deptIndex = (Math.max(0, id - 1)) % DEPARTMENTS.length;\n  return DEPARTMENTS[deptIndex];\n}\n\n/**\n * Transforms an API user object into the format expected by the app.\n * Why: The API returns names in a single string, but our table requires separate first and last names.\n * Splitting on the first space assumes \"FirstName LastName\", handling basic cases client-side.\n * @param {Object} apiUser - User object from the API.\n * @returns {Object} Transformed user object.\n */\nexport const transformUser = (apiUser) => {\n  const nameParts = (apiUser.name || '').trim().split(' ');\n  const firstName = nameParts[0] || '';\n  const lastName = nameParts.slice(1).join(' ');\n  \n  return {\n    id: apiUser.id,\n    firstName,\n    lastName,\n    email: apiUser.email || '',\n    department: generateDepartment(apiUser.id || 0),\n  };\n};\n\nexport function getDepartmentColor(department) {\n  const colorMap = {\n    Engineering: { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },\n    Design:      { bg: '#fce7f3', color: '#be185d', border: '#fbcfe8' },\n    Marketing:   { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },\n    Sales:       { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },\n    HR:          { bg: '#f3e8ff', color: '#7c3aed', border: '#e9d5ff' },\n    Finance:     { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' },\n    IT:          { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },\n    Operations:  { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },\n  }\n  return colorMap[department] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }\n}"
);
if (!helpers.includes('DEPARTMENTS')) {
  helpers = "import { DEPARTMENTS } from './constants.js';\n" + helpers;
}
writeFile('utils/helpers.js', helpers);

// 3. VALIDATORS
let validators = readFile('utils/validators.js');
validators = validators.replace('export const validateUserForm = (formData) => {', "/**\n * Validates user form data.\n * Why: This runs entirely client-side before any API call to save network round-trips\n * and give instant feedback to the user on input errors.\n */\nexport const validateUserForm = (formData) => {");
writeFile('utils/validators.js', validators);

// 4. USEUSERS HOOK
let useUsers = readFile('hooks/useUsers.js');
useUsers = useUsers.replace('const fetchUsers = useCallback', "/**\n   * Fetches users from the API.\n   * Why: We transform the data immediately rather than storing raw API responses\n   * to decouple our component UI from the specific API schema payload structure.\n   */\n  const fetchUsers = useCallback");
useUsers = useUsers.replace('const addUser = useCallback', "/**\n   * Adds a new user.\n   * Why: We use Date.now() for IDs instead of the API-returned id: 11\n   * because JSONPlaceholder always returns 11, which would cause duplicate keys.\n   */\n  const addUser = useCallback");
useUsers = useUsers.replace('const editUser = useCallback', "/**\n   * Updates an existing user.\n   * Why: State updates map over existing users to apply changes optimistically\n   * so the UI reflects updates instantly without needing a full refetch.\n   */\n  const updateUser = useCallback");
useUsers = useUsers.replace('const removeUser = useCallback', "/**\n   * Deletes a user.\n   * Why: Filters out the deleted ID locally for immediate UI response\n   * rather than waiting for the API to confirm the deletion entirely.\n   */\n  const deleteUser = useCallback");
useUsers = useUsers.replace(/editUser,/g, 'updateUser,');
useUsers = useUsers.replace(/removeUser,/g, 'deleteUser,');
writeFile('hooks/useUsers.js', useUsers);

// 5. APP.JSX
let appJsx = readFile('App.jsx');
appJsx = appJsx.replace('import UserTable', "import Header from './components/Header.jsx';\nimport UserTable");
appJsx = appJsx.replace(/editUser,/g, 'updateUser,');
appJsx = appJsx.replace(/removeUser,/g, 'deleteUser,');
appJsx = appJsx.replace('await editUser(', 'await updateUser(');
appJsx = appJsx.replace('await removeUser(', 'await deleteUser(');
appJsx = appJsx.replace(/<header className="app-header">[\s\S]*?<\/header>/g, '<Header onAddUser={handleOpenAddForm} />');
appJsx = appJsx.replace('const searchedUsers = useMemo', "/**\n   * Derived Data Pipeline\n   * Why: We use useMemo instead of useEffect+useState to compute this synchronously during render,\n   * avoiding extra renders. The 4-step pipeline ensures separation of concerns:\n   * 1. Search: Filters full set by text query.\n   * 2. Filter: Narrows down by specific fields.\n   * 3. Sort: Orders the results.\n   * 4. Paginate: Slices the ordered array for the current page.\n   */\n  const searchedUsers = useMemo");
writeFile('App.jsx', appJsx);

// 6. HEADER.JSX
const headerJsx = "import React from 'react';\nimport '../styles/Header.css';\n\nexport default function Header({ onAddUser }) {\n  return (\n    <header className=\"app-header\">\n      <h1 className=\"app-title\">\uD83D\uDC65 UserHub</h1>\n      <button className=\"btn-add\" onClick={onAddUser}>\n        + Add User\n      </button>\n    </header>\n  );\n}";
writeFile('components/Header.jsx', headerJsx);

// 7. USERTABLE.JSX
let userTable = readFile('components/UserTable.jsx');
userTable = "import '../styles/UserTable.css';\n" + userTable;
userTable = userTable.replace(/getSortArrow/g, "renderSortIndicator");
userTable = userTable.replace("{sortableColumns.map", "<th>#</th>\n              {sortableColumns.map");
userTable = userTable.replace("<UserRow\n              key={user.id}", "<UserRow\n              key={user.id}\n              rowIndex={index + 1}");
userTable = userTable.replace("{users.map((user) => (", "{users.map((user, index) => (");
writeFile('components/UserTable.jsx', userTable);

// 8. USERROW.JSX
let userRow = readFile('components/UserRow.jsx');
if(!userRow.includes('getDepartmentColor')) {
  userRow = "import { getDepartmentColor } from '../utils/helpers.js';\n" + userRow;
}
userRow = userRow.replace(/<td>\{user.id\}<\/td>/g, '<td>{rowIndex}</td>\n      <td>{user.id}</td>');
userRow = userRow.replace('const UserRow = ({ user, onEdit, onDelete }) => {', 'const UserRow = ({ user, rowIndex, onEdit, onDelete }) => {');
userRow = userRow.replace('<td>{user.email}</td>', "<td><a href={`mailto:${user.email}`} className=\"email-link\">{user.email}</a></td>");

userRow = userRow.replace(/<span className="department-badge">\{user\.department\}<\/span>/g, "<span\n        className=\"department-badge\"\n        style={{\n          background: getDepartmentColor(user.department).bg,\n          color: getDepartmentColor(user.department).color,\n          border: `1px solid ${getDepartmentColor(user.department).border}`\n        }}\n      >\n        {user.department}\n      </span>");
writeFile('components/UserRow.jsx', userRow);

// 9. SEARCHBAR.JSX
let searchBar = readFile('components/SearchBar.jsx');
searchBar = "import '../styles/SearchBar.css';\n" + searchBar;
writeFile('components/SearchBar.jsx', searchBar);

// 10. FILTERPOPUP.JSX
let filterPopup = readFile('components/FilterPopup.jsx');
filterPopup = "import '../styles/FilterPopup.css';\n" + filterPopup;
filterPopup = filterPopup.replace(/filters/g, 'filterState');
filterPopup = filterPopup.replace(/handleChange/g, 'handleFilterChange');
writeFile('components/FilterPopup.jsx', filterPopup);

// 11. PAGINATION.JSX
let pagination = readFile('components/Pagination.jsx');
pagination = "import '../styles/Pagination.css';\n" + pagination;
pagination = pagination.replace(/totalPages/g, 'pageCount');
pagination = pagination.replace(/startItem/g, 'firstItemIndex');
pagination = pagination.replace(/endItem/g, 'lastItemIndex');
pagination = pagination.replace(/<span className="pagination-info">/, "<span className=\"pagination-info\">\n      <span className=\"page-of-total\">Page {currentPage} of {pageCount}</span>");
writeFile('components/Pagination.jsx', pagination);

// 12. USERFORM.JSX
let userForm = readFile('components/UserForm.jsx');
userForm = "import '../styles/UserForm.css';\n" + userForm;
userForm = userForm.replace(/formData/g, 'formValues');
userForm = userForm.replace(/emptyForm/g, 'initialFormState');
userForm = userForm.replace(/handleChange/g, 'handleFieldChange');
userForm = userForm.replace(/handleSubmit/g, 'handleFormSubmit');
writeFile('components/UserForm.jsx', userForm);

// 13. CONFIRMDELETE.JSX
let confirmDelete = readFile('components/ConfirmDelete.jsx');
confirmDelete = "import '../styles/ConfirmDelete.css';\nimport { getDepartmentColor } from '../utils/helpers.js';\n" + confirmDelete;
confirmDelete = confirmDelete.replace(/<span className="department-badge">\{user\.department\}<\/span>/g, "<span\n              className=\"department-badge\"\n              style={{\n                background: getDepartmentColor(user.department).bg,\n                color: getDepartmentColor(user.department).color,\n                border: `1px solid ${getDepartmentColor(user.department).border}`\n              }}\n            >\n              {user.department}\n            </span>");
writeFile('components/ConfirmDelete.jsx', confirmDelete);

// CSS FILES
const globalCss = readFile('styles/global.css');

const extractBlocks = (cssStr) => {
    const blocks = [];
    let currentBlock = "";
    let inBraces = 0;
    const lines = cssStr.split('\n');
    let header = "";
    for (let line of lines) {
        if (line.trim().startsWith('/*') && inBraces === 0) {
           header += line + "\n";
           if(line.includes('*/')) {
             currentBlock += header;
             header = "";
           }
           continue;
        } else if (header.length > 0 && inBraces === 0) {
           if(line.includes('*/')) {
             header += line + "\n";
             currentBlock += header;
             header = "";
             continue;
           } else {
             header += line + "\n";
             continue;
           }
        }
        
        currentBlock += line + '\n';
        if (line.includes('{')) inBraces++;
        if (line.includes('}')) inBraces--;
        
        if (inBraces === 0 && currentBlock.trim()) {
            blocks.push(currentBlock);
            currentBlock = "";
        }
    }
    return blocks;
};

const blocks = extractBlocks(globalCss);

const classifyBlock = (blockStr) => {
    const t = blockStr;
    if (t.includes('.app-header') || t.includes('.app-title')) return 'Header.css';
    if (t.includes('.search-bar') || t.includes('.search-icon') || t.includes('.search-input') || t.includes('.search-clear')) return 'SearchBar.css';
    
    if (t.includes('.table-wrapper') || t.includes('.user-table') || t.includes('thead th') || 
        t.includes('tbody td') || t.includes('.user-row') || t.includes('.sortable-th') || 
        t.includes('.active-sort') || t.includes('.sort-arrow') || t.includes('.department-badge') || 
        t.includes('.actions-cell') || t.includes('.btn-icon') || t.includes('.btn-edit') || 
        t.includes('.btn-delete') || t.includes('.skeleton-row') || t.includes('.skeleton-cell') || 
        t.includes('.empty-state') || t.includes('.email-link')) {
        
        if (t.includes('@keyframes shimmer')) return 'UserTable.css';
        return 'UserTable.css';
    }
    
    if (t.includes('.pagination') || t.includes('.pagination-info') || t.includes('.pagination-controls') || 
        t.includes('.page-btn') || t.includes('.page-btn-active') || t.includes('.pagination-size') || t.includes('.page-of-total')) return 'Pagination.css';
        
    if (t.includes('.filter-panel') || t.includes('.filter-header') || t.includes('.filter-title') || 
        t.includes('.filter-badge') || t.includes('.filter-body') || t.includes('.filter-field') || 
        t.includes('.filter-footer') || (t.includes('.btn-filter') && !t.includes('.btn-filter-active')) || t.includes('.btn-filter-active') || t.includes('.filter-count-badge')) return 'FilterPopup.css';
        
    if (t.includes('.form-panel') || t.includes('.form-header') || t.includes('.form-title') || 
        t.includes('.form-body') || t.includes('.form-field') || t.includes('.form-field-full') || 
        t.includes('.required-star') || t.includes('.input-error') || t.includes('.field-error') || 
        t.includes('.form-footer')) return 'UserForm.css';
        
    if (t.includes('.confirm-panel') || t.includes('.confirm-header') || t.includes('.confirm-icon') || 
        t.includes('.confirm-title') || t.includes('.confirm-body') || t.includes('.confirm-message') || 
        t.includes('.confirm-sub') || t.includes('.confirm-user-card') || t.includes('.confirm-user-info') || 
        t.includes('.confirm-user-avatar') || t.includes('.confirm-user-name') || t.includes('.confirm-user-email') || 
        t.includes('.confirm-footer')) return 'ConfirmDelete.css';
        
    return 'global.css';
};

const categorized = {
    'global.css': [],
    'Header.css': [],
    'SearchBar.css': [],
    'UserTable.css': [],
    'Pagination.css': [],
    'FilterPopup.css': [],
    'UserForm.css': [],
    'ConfirmDelete.css': []
};

categorized['global.css'].push("body { background: var(--bg); }\n.app { background: var(--bg); min-height: 100vh; }\n.app-main { background: var(--bg); padding: var(--space-6); }");
categorized['UserTable.css'].push(".email-link { color: var(--primary); text-decoration: none; }\n.email-link:hover { text-decoration: underline; }");
categorized['Pagination.css'].push(".page-of-total { font-size: var(--text-xs); color: var(--text-muted); white-space: nowrap; }");

for (let block of blocks) {
    if (block.includes('@import')) {
       categorized['global.css'].unshift(block);
       continue;
    }
    
    if (block.includes('@keyframes shimmer')) {
        categorized['UserTable.css'].push(block);
        continue;
    }
    
    if (block.includes('@keyframes')) {
        categorized['global.css'].push(block);
        continue;
    }
    
    if (block.includes('.toast')) {
        categorized['global.css'].push(block);
        continue;
    }

    const cat = classifyBlock(block);
    categorized[cat].push(block);
}

for (let file in categorized) {
    if (!fs.existsSync(path.join(srcDir, 'styles'))) {
      fs.mkdirSync(path.join(srcDir, 'styles'));
    }
    writeFile('styles/' + file, categorized[file].join('\n'));
}

console.log("SUCCESS");
