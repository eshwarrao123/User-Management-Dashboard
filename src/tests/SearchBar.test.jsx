import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../components/SearchBar'
import React from 'react'

describe('SearchBar', () => {
  it('renders the input with correct placeholder', () => {
    render(<SearchBar searchQuery="" onSearch={() => {}} />)
    expect(screen.getByPlaceholderText('Search by name or email...')).toBeInTheDocument()
  })

  it('displays the current value in the input', () => {
    render(<SearchBar searchQuery="john" onSearch={() => {}} />)
    expect(screen.getByDisplayValue('john')).toBeInTheDocument()
  })

  it('calls onSearch with the typed value when user types', async () => {
    const onSearch = vi.fn()
    render(<SearchBar searchQuery="" onSearch={onSearch} />)
    const input = screen.getByPlaceholderText('Search by name or email...')
    await userEvent.type(input, 'a')
    expect(onSearch).toHaveBeenCalled()
  })

  it('does not show the clear button when value is empty', () => {
    render(<SearchBar searchQuery="" onSearch={() => {}} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('shows the clear button when value is present', () => {
    render(<SearchBar searchQuery="john" onSearch={() => {}} />)
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('calls onSearch with empty string when clear button is clicked', async () => {
    const onSearch = vi.fn()
    render(<SearchBar searchQuery="john" onSearch={onSearch} />)
    await userEvent.click(screen.getByLabelText('Clear search'))
    expect(onSearch).toHaveBeenCalledWith('')
  })
})
