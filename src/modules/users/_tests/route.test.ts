import { describe, it, expect, vi, beforeEach } from 'vitest'
import Elysia from 'elysia'
import { users } from '../route'
import { UserController } from '../controller'

/* ================= MOCKS ================= */

// mock controller
vi.mock('../controller', () => ({
    UserController: {
        addUserController: vi.fn(),
        getUsersController: vi.fn(),
        deleteUsersController: vi.fn()
    }
}))

// mock auth guard
vi.mock('@api/guards/authGuard', () => ({
    authGuard: new Elysia().derive(() => ({
        user: { user_id: 'super-admin-id', role: 'SUPER_ADMIN' }
    }))
}))

// mock role guard
vi.mock('@api/guards/roleGuard', () => ({
    requireSuperAdmin: new Elysia()
}))

/* ================= APP ================= */

const app = new Elysia().use(users)

/* ================= TESTS ================= */

describe('Users Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    /* ---------- POST /users ---------- */
    it('POST /users - should create user successfully', async () => {
        (UserController.addUserController as any).mockResolvedValue({
            status: 'success',
            message: 'User created successfully',
            data: { users_id: 'new-user-id' }
        })

        const response = await app.handle(
            new Request('http://localhost/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'Password123',
                    userRole: 'ADMIN'
                })
            })
        )

        const json = await response.json()

        expect(response.status).toBe(201)
        expect(json.status).toBe('success')
        expect(UserController.addUserController).toHaveBeenCalledOnce()
    })

    /* ---------- GET /users ---------- */
    it('GET /users - should return list of users', async () => {
        (UserController.getUsersController as any).mockResolvedValue({
            status: 'success',
            data: []
        })

        const response = await app.handle(
            new Request('http://localhost/users', {
                method: 'GET'
            })
        )

        const json = await response.json()

        expect(response.status).toBe(200)
        expect(json.status).toBe('success')
        expect(UserController.getUsersController).toHaveBeenCalledOnce()
    })

    /* ---------- DELETE /users/:id ---------- */
    it('DELETE /users/:userId - should delete user', async () => {
        (UserController.deleteUsersController as any).mockResolvedValue({
            status: 'success',
            message: 'User deleted successfully',
            data: { users_id: 'user-id' }
        })

        const response = await app.handle(
            new Request('http://localhost/users/user-id', {
                method: 'DELETE'
            })
        )

        const json = await response.json()

        expect(response.status).toBe(200)
        expect(json.status).toBe('success')
        expect(UserController.deleteUsersController).toHaveBeenCalledWith('user-id')
    })
})
