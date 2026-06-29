import '../styles/Pagination.css';
import { PAGE_SIZE_OPTIONS } from '../utils/constants.js';

/**
 * Pagination — shows page controls, page size selector, and result count.
 */
export default function Pagination({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange }) {
  const pageCount = Math.ceil(totalItems / pageSize);
  const firstItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItemIndex = Math.min(currentPage * pageSize, totalItems);

  // Build page number buttons — show max 5 pages with ellipsis
  function getPageNumbers() {
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= pageCount - 2) {
      return [
        pageCount - 4,
        pageCount - 3,
        pageCount - 2,
        pageCount - 1,
        pageCount,
      ];
    }
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{firstItemIndex}–{lastItemIndex}</strong> of <strong>{totalItems}</strong> users
      </div>

      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ← Prev
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'page-btn-active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount || pageCount === 0}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>

      <div className="pagination-size">
        <label htmlFor="page-size">Rows per page:</label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
}