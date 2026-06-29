import { describe, it, expect } from 'vitest'
import {
  isRequired,
  isMinLength,
  isOnlyLettersAndSpaces,
  isValidEmail,
  validateUserForm
} from '../utils/validators'

describe('isRequired', () => {
  it('returns true if value is present', () => {
    expect(isRequired('John')).toBe(true)
  })

  it('returns false if value is empty or spaces', () => {
    expect(isRequired('')).toBe(false)
    expect(isRequired('   ')).toBe(false)
  })
})

describe('isMinLength', () => {
  it('returns true if length is greater than or equal to min', () => {
    expect(isMinLength('John', 2)).toBe(true)
    expect(isMinLength('Jo', 2)).toBe(true)
  })

  it('returns false if length is less than min', () => {
    expect(isMinLength('J', 2)).toBe(false)
    expect(isMinLength('', 2)).toBe(false)
  })
})

describe('isOnlyLettersAndSpaces', () => {
  it('returns true for valid names', () => {
    expect(isOnlyLettersAndSpaces('John Doe')).toBe(true)
    expect(isOnlyLettersAndSpaces('Jane')).toBe(true)
  })

  it('returns false if contains numbers or special characters', () => {
    expect(isOnlyLettersAndSpaces('John123')).toBe(false)
    expect(isOnlyLettersAndSpaces('Jane@')).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('returns true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })

  it('returns false for invalid emails', () => {
    expect(isValidEmail('test.com')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
  })
})

describe('validateUserForm', () => {
  const validData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    department: 'Engineering'
  }

  it('returns no errors for valid data', () => {
    const errors = validateUserForm(validData)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('returns errors for invalid fields', () => {
    const errors = validateUserForm({
      firstName: 'J',
      lastName: 'D1',
      email: 'john',
      department: ''
    })
    expect(errors.firstName).toBeDefined()
    expect(errors.lastName).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.department).toBeDefined()
  })
})
