import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserController } from '../controller'
import { UserService } from '../service'

vi.mock('../service', () => ({
    UserService: {
        verifyUsernameIsExisting: vi.fn(),
        addUser: vi.fn(),
        getUsers: vi.fn(),
        getUserById: vi.fn(),
        deleteUserById: vi.fn()
    }
}))
describe('UserController.addUserController', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create user successfully', async () => {
        (UserService.verifyUsernameIsExisting as any).mockResolvedValue(true)
        ;(UserService.addUser as any).mockResolvedValue({
            users_id: 'user-uuid'
        })

        const input = {
            username: 'newuser',
            password: 'password123',
            urlProfile: 'http://example.com/profile.jpg',
            userRole: 'ADMIN'
        } as const

        const userPayload = {
            user_id: 'admin-uuid',
            user_role: 'ADMIN'
        } as const

        const result = await UserController.addUserController(input, userPayload)

        expect(UserService.verifyUsernameIsExisting)
            .toHaveBeenCalledWith('newuser')

        expect(UserService.addUser)
            .toHaveBeenCalledWith(input, 'admin-uuid')

        expect(result).toEqual({
            status: 'success',
            message: 'User created successfully',
            data: { users_id: 'user-uuid' }
        })
    })

    it('should propagate error if username already exists', async () => {
        (UserService.verifyUsernameIsExisting as any)
            .mockRejectedValue(new Error('Username already exists'))

        await expect(
            UserController.addUserController(
                { username: 'existing', password: 'x', urlProfile: '', userRole: 'ADMIN' },
                { user_id: 'admin', user_role: 'ADMIN' }
            )
        ).rejects.toThrow('Username already exists')
    })
})

describe('UserController.getUsersController', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return list of users', async () => {
        const mockUsers = [
            { users_id: '1', username: 'a' },
            { users_id: '2', username: 'b' }
        ]

        ;(UserService.getUsers as any).mockResolvedValue({
            rows: mockUsers
        })

        const result = await UserController.getUsersController()

        expect(UserService.getUsers).toHaveBeenCalled()
        expect(result).toEqual({
            status: 'success',
            data: mockUsers
        })
    })
})
describe('UserController.deleteUsersController', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should delete user successfully', async () => {
        ;(UserService.getUserById as any).mockResolvedValue({
            users_id: 'user-uuid'
        })
        ;(UserService.deleteUserById as any).mockResolvedValue({
            users_id: 'user-uuid'
        })

        const result = await UserController.deleteUsersController('user-uuid')

        expect(UserService.getUserById)
            .toHaveBeenCalledWith('user-uuid')

        expect(UserService.deleteUserById)
            .toHaveBeenCalledWith('user-uuid')

        expect(result).toEqual({
            status: 'success',
            message: 'User deleted successfully',
            data: { users_id: 'user-uuid' }
        })
    })

    it('should propagate error if user not found', async () => {
        ;(UserService.getUserById as any)
            .mockRejectedValue(new Error('User not found'))

        await expect(
            UserController.deleteUsersController('invalid-uuid')
        ).rejects.toThrow('User not found')

        expect(UserService.deleteUserById).not.toHaveBeenCalled()
    })
})
