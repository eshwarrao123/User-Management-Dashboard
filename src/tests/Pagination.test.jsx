import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../components/Pagination'
import React from 'react'

const defaultProps = {
  currentPage: 1,
  totalPages: 5,
  pageSize: 10,
  totalItems: 50,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
}

describe('Pagination', () => {
  it('shows the correct result count elements', () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByText('1–10')).toBeInTheDocument()
    expect(screen.getAllByText('50')[0]).toBeInTheDocument()
  })

  it('disables Prev button on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables Next button on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('enables Next button when not on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    expect(screen.getByLabelText('Next page')).not.toBeDisabled()
  })

  it('calls onPageChange with next page number when Next is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with previous page number when Prev is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByLabelText('Previous page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageSizeChange with the selected value when page size changes', async () => {
    const onPageSizeChange = vi.fn()
    render(<Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />)
    const select = screen.getByRole('combobox', { name: /rows per page/i });
    await userEvent.selectOptions(select, '25');

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  })
})
