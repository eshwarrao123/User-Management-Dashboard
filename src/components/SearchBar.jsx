import '../styles/SearchBar.css';
/**
 * SearchBar — controlled search input with a clear button.
 */
export default function SearchBar({ searchQuery, onSearch }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search users"
      />
      {searchQuery && (
        <button
          className="search-clear"
          onClick={() => onSearch('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}