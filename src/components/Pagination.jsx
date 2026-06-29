/**
 * @file Pagination.jsx
 * @description Pagination controls: page size selector, prev/next buttons, and
 * a page indicator. Keeps no internal state — fully controlled by the parent.
 *
 * @param {Object}   props
 * @param {number}   props.currentPage    - 1-indexed current page number.
 * @param {number}   props.totalPages     - Total number of pages available.
 * @param {number}   props.pageSize       - Items currently shown per page.
 * @param {number}   props.totalItems     - Total item count (for display).
 * @param {Function} props.onPageChange   - Callback: (newPage: number) => void.
 * @param {Function} props.onPageSizeChange - Callback: (newSize: number) => void.
 */

import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';
import '../styles/Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="Table pagination">
      {/* Items count summary */}
      <span className="pagination__summary">
        {totalItems === 0
          ? 'No results'
          : `Showing ${startItem}–${endItem} of ${totalItems} users`}
      </span>

      {/* Page size selector */}
      <div className="pagination__size">
        <label htmlFor="page-size-select" className="pagination__size-label">
          Rows per page:
        </label>
        <select
          id="page-size-select"
          className="pagination__size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Page navigation */}
      <div className="pagination__nav" role="group" aria-label="Page navigation">
        <button
          id="btn-page-first"
          className="pagination__btn"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          «
        </button>
        <button
          id="btn-page-prev"
          className="pagination__btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        <span className="pagination__indicator" aria-current="page">
          {currentPage} / {totalPages}
        </span>

        <button
          id="btn-page-next"
          className="pagination__btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          id="btn-page-last"
          className="pagination__btn"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
