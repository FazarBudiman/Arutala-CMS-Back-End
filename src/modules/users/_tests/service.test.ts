import { pool } from "@api/db/pool";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "../service";
import bcrypt from 'bcrypt';


vi.mock("@api/db/pool", () => ({
    pool: {
        query: vi.fn()
    }
}))

vi.mock('bcrypt', () => ({
    default: {
        hashSync: vi.fn()
    }
}))

describe('UserService.addUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

     it('should add a new user successfully', async () => {
        (bcrypt.hashSync as any).mockReturnValue('hashed-password')

        ;(pool.query as any)
            .mockResolvedValueOnce({
                rows: [{ roles_id: 'role-uuid' }]
            })
            .mockResolvedValueOnce({
                rows: [{ users_id: 'new-user-uuid' }]
            })

        const result = await UserService.addUser(
            {
                username: 'testuser',
                password: 'password123',
                urlProfile: 'http://example.com/profile.jpg',
                userRole: 'ADMIN'
            },
            'admin-user'
        )

        expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 12)
        expect(pool.query).toHaveBeenCalledTimes(2)
        expect(result).toEqual({ users_id: 'new-user-uuid' })
    })
})


describe('UserService.verifyUsernameIsExisting', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it('should throw BadRequest if username exists', async () => {
        (pool.query as any).mockResolvedValue({
            rows: [{ username: 'existinguser' }]
        });

        await expect(UserService.verifyUsernameIsExisting('existinguser')).rejects.toThrow('Username already exists');
    })

    it('should return true if username does not exist', async () => {
        (pool.query as any).mockResolvedValue({
            rows: []
        });

        const result = await UserService.verifyUsernameIsExisting('newuser');
        expect(result).toBe(true);
    })
})


describe('UserService.getUsers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    }) 
    it('should return list of users', async () => {
        const mockUsers = [
            {
                users_id: 'user1',
                username: 'user1',
                url_profile: 'http://example.com/user1.jpg',
                roles_name: 'ADMIN',
                is_active: true
            },
            {
                users_id: 'user2',
                username: 'user2',
                url_profile: 'http://example.com/user2.jpg',
                roles_name: 'USER',
                is_active: false
            }
        ];

        (pool.query as any).mockResolvedValue({
            rows: mockUsers
        });

        const result = await UserService.getUsers();
        expect(result.rows).toEqual(mockUsers);
    })
})


describe('UserService.getUserById', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it('should return user data if user exists', async () => {
        (pool.query as any).mockResolvedValue({
            rows: [{ users_id: 'user-uuid' }]
        });
        const result = await UserService.getUserById('user-uuid');
        expect(result).toEqual({ users_id: 'user-uuid' });
    })

    it('should throw NotFoundError if user does not exist', async () => {
        (pool.query as any).mockResolvedValue({
            rows: []
        });
        await expect(UserService.getUserById('nonexistent-uuid')).rejects.toThrow('User not found');
    })

    it('should throw BadRequest for invalid user ID format', async () => {
        (pool.query as any).mockImplementation(() => {
            throw new Error('Invalid input syntax for UUID');
        });
        await expect(UserService.getUserById('invalid-uuid')).rejects.toThrow('Invalid user ID format');
    })
})

describe('UserService.deleteUserById', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return deleted user id when user exists', async () => {
        (pool.query as any).mockResolvedValue({
            rows: [{ users_id: 'deleted-user-uuid' }]
        })

        const result = await UserService.deleteUserById('deleted-user-uuid')

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM users'),
            ['deleted-user-uuid']
        )
        expect(result).toEqual({ users_id: 'deleted-user-uuid' })
    })

        it('should return undefined if user does not exist', async () => {
        (pool.query as any).mockResolvedValue({
            rows: []
        })

        const result = await UserService.deleteUserById('nonexistent-uuid')

        expect(result).toBeUndefined()
    })
})



