import { describe, it, expect } from 'vitest'
import { formatElysiaValidation } from '../helper'

describe('formatElysiaValidation', () => {
  it('should return empty object if no error.all', () => {
    const result = formatElysiaValidation({})
    expect(result).toEqual({})
  })

  it('should format validation errors correctly', () => {
    const error = {
      all: [
        {
          path: '/username',
          message: 'Username is required'
        },
        {
          path: '/password',
          message: 'Password too short'
        }
      ]
    }

    const result = formatElysiaValidation(error)

    expect(result).toEqual({
      username: 'Username is required',
      password: 'Password too short'
    })
  })

  it('should fallback to body if path is missing', () => {
    const error = {
      all: [
        {
          message: 'Invalid body'
        }
      ]
    }

    const result = formatElysiaValidation(error)

    expect(result).toEqual({
      body: 'Invalid body'
    })
  })
})
