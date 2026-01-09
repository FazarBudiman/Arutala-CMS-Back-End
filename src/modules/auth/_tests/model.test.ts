import { describe, it, expect } from 'vitest'
import { Value } from '@sinclair/typebox/value'
import { AuthCreateModels, AuthRefreshTokenModels } from '../model'

describe('AuthCreateModels', () => {
    it('should accept valid payload', () => {
        const payload = {
            username: 'fazar',
            password: 'secret123'
        }

        const isValid = Value.Check(AuthCreateModels, payload)

        expect(isValid).toBe(true)
    })

    it('should reject missing password', () => {
        const payload = {
            username: 'fazar'
        }

        const isValid = Value.Check(AuthCreateModels, payload)

        expect(isValid).toBe(false)
    })

    it('should reject non-string fields', () => {
        const payload = {
            username: 123,
            password: true
        }

        const isValid = Value.Check(AuthCreateModels, payload)

        expect(isValid).toBe(false)
    })
})

describe('AuthRefreshTokenModels', () => {
    it('should accept valid refresh token', () => {
        const payload = {
            refreshToken: 'token-123'
        }

        expect(
            Value.Check(AuthRefreshTokenModels, payload)
        ).toBe(true)
    })

    it('should reject missing refreshToken', () => {
        expect(
            Value.Check(AuthRefreshTokenModels, {})
        ).toBe(false)
    })
})
