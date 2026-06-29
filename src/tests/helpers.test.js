import { describe, it, expect } from 'vitest'
import {
  sortUsers,
  filterUsers,
  paginateItems,
  getTotalPages,
  formatDate,
  getInitials
} from '../utils/helpers'

const MOCK_USERS = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', department: 'Engineering', status: 'active' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', department: 'Design', status: 'inactive' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', department: 'Engineering', status: 'pending' },
]

describe('sortUsers', () => {
  it('sorts alphabetically ascending by name', () => {
    const sorted = sortUsers(MOCK_USERS, 'name', 'asc')
    expect(sorted[0].name).toBe('Alice Smith')
    expect(sorted[1].name).toBe('Bob Jones')
    expect(sorted[2].name).toBe('Charlie Brown')
  })

  it('sorts alphabetically descending by name', () => {
    const sorted = sortUsers(MOCK_USERS, 'name', 'desc')
    expect(sorted[0].name).toBe('Charlie Brown')
    expect(sorted[2].name).toBe('Alice Smith')
  })
})

describe('filterUsers', () => {
  it('filters by search query', () => {
    const filtered = filterUsers(MOCK_USERS, 'alice')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('Alice Smith')
  })

  it('filters by department', () => {
    const filtered = filterUsers(MOCK_USERS, '', { department: 'Engineering' })
    expect(filtered).toHaveLength(2)
  })

  it('filters by status', () => {
    const filtered = filterUsers(MOCK_USERS, '', { status: 'inactive' })
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('Bob Jones')
  })
})

describe('paginateItems', () => {
  it('returns the correct slice of items', () => {
    const page1 = paginateItems(MOCK_USERS, 1, 2)
    expect(page1).toHaveLength(2)
    expect(page1[0].id).toBe(1)
    
    const page2 = paginateItems(MOCK_USERS, 2, 2)
    expect(page2).toHaveLength(1)
    expect(page2[0].id).toBe(3)
  })
})

describe('getTotalPages', () => {
  it('calculates total pages correctly', () => {
    expect(getTotalPages(10, 5)).toBe(2)
    expect(getTotalPages(11, 5)).toBe(3)
    expect(getTotalPages(0, 5)).toBe(1) // minimum is 1
  })
})

describe('formatDate', () => {
  it('formats dates nicely', () => {
    const formatted = formatDate('2023-01-01T12:00:00Z', 'en-US')
    // Result varies based on timezone, but will be a string
    expect(typeof formatted).toBe('string')
    expect(formatted.length).toBeGreaterThan(0)
  })
  
  it('handles falsy values', () => {
    expect(formatDate(null)).toBe('—')
  })
})

describe('getInitials', () => {
  it('returns initials for two names', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })
  
  it('returns first letter for one name', () => {
    expect(getInitials('John')).toBe('J')
  })
  
  it('handles empty input', () => {
    expect(getInitials('')).toBe('?')
  })
})
