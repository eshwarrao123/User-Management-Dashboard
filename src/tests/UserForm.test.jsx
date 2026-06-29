import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserForm from '../components/UserForm'
import React from 'react'

const defaultProps = {
  isOpen: true,
  mode: 'add',
  initialData: null,
  onSubmit: vi.fn(),
  onClose: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('UserForm', () => {
  it('returns null if not isOpen', () => {
    const { container } = render(<UserForm {...defaultProps} isOpen={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows "Add New User" title when creating', () => {
    render(<UserForm {...defaultProps} mode="add" />)
    expect(screen.getByText('➕ Add New User')).toBeInTheDocument()
    expect(screen.getByText('Save User')).toBeInTheDocument()
  })

  it('shows "Edit User" title when editing', () => {
    render(
      <UserForm
        {...defaultProps}
        mode="edit"
        initialData={{
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          department: 'Engineering'
        }}
      />
    )
    expect(screen.getByText('✏️ Edit User')).toBeInTheDocument()
    expect(screen.getByText('Update User')).toBeInTheDocument()
  })

  it('pre-populates fields from initialData in edit mode', () => {
    render(
      <UserForm
        {...defaultProps}
        mode="edit"
        initialData={{
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          department: 'Design',
        }}
      />
    )
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Design')).toBeInTheDocument()
  })

  it('shows validation errors when submitted with empty fields', async () => {
    render(<UserForm {...defaultProps} mode="add" />)
    await userEvent.click(screen.getByText('Save User'))
    expect(screen.getByText('First name is required.')).toBeInTheDocument()
    expect(screen.getByText('Last name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Department is required.')).toBeInTheDocument()
  })

  it('does not call onSubmit when form has validation errors', async () => {
    const onSubmit = vi.fn()
    render(<UserForm {...defaultProps} mode="add" onSubmit={onSubmit} />)
    await userEvent.click(screen.getByText('Save User'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with form data when all fields are valid', async () => {
    const onSubmit = vi.fn()
    render(<UserForm {...defaultProps} mode="add" onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/First Name/i), 'John')
    await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe')
    await userEvent.type(screen.getByLabelText(/Email/i), 'john@example.com')
    await userEvent.selectOptions(screen.getByLabelText(/Department/i), 'Engineering')
    
    await userEvent.click(screen.getByText('Save User'))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      department: 'Engineering'
    }))
  })

  it('calls onClose when Cancel button is clicked', async () => {
    const onClose = vi.fn()
    render(<UserForm {...defaultProps} onClose={onClose} />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})
