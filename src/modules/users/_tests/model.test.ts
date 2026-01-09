import { describe, expect, it } from "vitest";
import { Value } from '@sinclair/typebox/value'
import { UserCreateModels } from "../model";

describe('UserCreateModels', () => {
    it('should accept valid payload', () => {
        const payload = {
            username: 'john_doe',
            password: 'password123',
            userRole: 'ADMIN',
            urlProfile: 'http://example.com/profile/john_doe'
        }

        const isValid = Value.Check(UserCreateModels, payload);

        expect(isValid).toBe(true);
    })

    it('should reject if missing value', () => {
        const payload = {
            username: 'john_doe',
            userRole: 'ADMIN'
        }

        const isValid = Value.Check(UserCreateModels, payload);

        expect(isValid).toBe(false);
    })

    it('should reject if non-string fields', () => {
        const payload = {
            username: 12345,
            password: true,
            userRole: 'ADMIN'
        }

        const isValid = Value.Check(UserCreateModels, payload);

        expect(isValid).toBe(false);
    })
 
})