import { pool } from '@api/db/pool';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../service';
import bcrypt from 'bcrypt';


vi.mock("@api/db/pool", () => ({
    pool: {
        query: vi.fn()
    }
}))


vi.mock('bcrypt', () => ({
    default: {
        compare: vi.fn()
    }
}))


describe('AuthService.verifyUserCredential', () => { 
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('shoud throw Error if username not found', async () => {
        (pool.query as any).mockResolvedValue({ rows: [] });

        await expect(
            AuthService.verifyUserCredential({ username: 'invalid', password: 'any' })
        ).rejects.toThrow('Username Salah');
    }) 

    it('should throw Error if password is incorrect', async () => {
        (pool.query as any).mockResolvedValue({ 
            rows: [{ 
                users_id: 1, 
                password_hash: 'hashed', 
                roles_name: 'user' 
            }] 
        });
        (bcrypt.compare as any).mockResolvedValue(false);

        await expect(
            AuthService.verifyUserCredential({ 
                username: 'valid', 
                password: 'wrong' })
        ).rejects.toThrow('Password Salah');
    })

    it("should return user data if valid", async () => {
        (pool.query as any).mockResolvedValue({
            rows: [{
                users_id: 1,
                password_hash: "hash",
                roles_name: "admin"
            }]
        });

        (bcrypt.compare as any).mockResolvedValue(true);

        const result = await AuthService.verifyUserCredential({
            username: "admin",
            password: "correct"
        });

        expect(result).toEqual({
            users_id: 1,
            roles_name: "admin"
        });
    });
})