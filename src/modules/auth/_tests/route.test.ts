import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthController } from '../controller'
import { testApp } from './app'

/**
 * MOCK CONTROLLER
 */
vi.mock('../controller', () => ({
  AuthController: {
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn()
  }
}))

/**
 * MOCK JWT PLUGIN
 */
vi.mock('@api/plugins/jwt', async () => {
  const Elysia = (await import('elysia')).default

  return {
    jwtPlugin: new Elysia().decorate({
      accessJwt: {
        sign: vi.fn(),
        verify: vi.fn()
      },
      refreshJwt: {
        sign: vi.fn(),
        verify: vi.fn()
      }
    })
  }
})

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =======================
  // POST /auth
  // =======================
  it('POST /auth → 201 success', async () => {
    (AuthController.login as any).mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh'
    })

    const res = await testApp.handle(
      new Request('http://localhost/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          username: 'AdminUser',
          password: 'StrongPass1'
        })
      })
    )

    expect(res.status).toBe(201)

    const body = await res.json()
    expect(body.accessToken).toBeDefined()
    expect(body.refreshToken).toBeDefined()
  })

  it('POST /auth → 422 invalid password', async () => {
    const res = await testApp.handle(
      new Request('http://localhost/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: true
        })
      })
    )

    expect(res.status).toBe(422)
  })

  // =======================
  // PUT /auth
  // =======================
  it('PUT /auth → refresh token', async () => {
    (AuthController.refresh as any).mockResolvedValue({
      accessToken: 'new-access'
    })

    const res = await testApp.handle(
      new Request('http://localhost/auth', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          refreshToken: 'valid-refresh-token'
        })
      })
    )

    expect(res.status).toBe(200)
  })

  // =======================
  // DELETE /auth
  // =======================
  it('DELETE /auth → logout', async () => {
    (AuthController.logout as any).mockResolvedValue({
      message: 'Logout Berhasil'
    })

    const res = await testApp.handle(
      new Request('http://localhost/auth', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          refreshToken: 'valid-refresh-token'
        })
      })
    )

    expect(res.status).toBe(200)
  })
})
