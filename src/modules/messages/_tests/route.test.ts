import { describe, it, expect, vi, beforeEach } from 'vitest'
import Elysia from 'elysia'
import { messages } from '../route'
import { MessageController } from '../controller'

/* ================= MOCKS ================= */

// mock controller
vi.mock('../controller', () => ({
  MessageController: {
    addMessageController: vi.fn(),
    getMessagesController: vi.fn(),
    updateMessageController: vi.fn(),
    deleteMessageController: vi.fn()
  }
}))

// mock auth guard
vi.mock('@api/guards/authGuard', () => ({
  authGuard: new Elysia().derive(() => ({
    user: { user_id: 'admin-id', role: 'ADMIN' }
  }))
}))

// mock role guard
vi.mock('@api/guards/roleGuard', () => ({
  requireAdmin: new Elysia()
}))

/* ================= APP ================= */

const app = new Elysia().use(messages)

/* ================= TESTS ================= */

describe('Messages Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /* ---------- POST /messages ---------- */
  it('POST /messages - should create message successfully', async () => {
    (MessageController.addMessageController as any).mockResolvedValue({
      status: 'success',
      message: 'Message created successfully',
      data: { message_id: 'message-id' }
    })

    const response = await app.handle(
      new Request('http://localhost/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            senderName: 'Alice',
            senderEmail: 'alice@gmail.com',
            organizationName: 'Tech Corp',
            senderPhone: '1234567890',
            subject: ['Head Hunting'],
            messageBody: 'I would like to know more about your services.'
        })
      })
    )

    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.status).toBe('success')
    expect(MessageController.addMessageController).toHaveBeenCalledOnce()
  })

  /* ---------- GET /messages ---------- */
  it('GET /messages - should return list of messages', async () => {
    (MessageController.getMessagesController as any).mockResolvedValue({
      status: 'success',
      data: []
    })

    const response = await app.handle(
      new Request('http://localhost/messages', {
        method: 'GET'
      })
    )

    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.status).toBe('success')
    expect(MessageController.getMessagesController).toHaveBeenCalledOnce()
  })

  /* ---------- PUT /messages/:id ---------- */
  it('PUT /messages/:id - should update message status', async () => {
    (MessageController.updateMessageController as any).mockResolvedValue({
      status: 'success',
      message: 'Message updated successfully'
    })

    const response = await app.handle(
      new Request('http://localhost/messages/message-id', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'CONTACTED'
        })
      })
    )

    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.status).toBe('success')
    expect(MessageController.updateMessageController).toHaveBeenCalledOnce()
  })

  /* ---------- DELETE /messages/:id ---------- */
  it('DELETE /messages/:id - should delete message', async () => {
    (MessageController.deleteMessageController as any).mockResolvedValue({
      status: 'success',
      message: 'Message deleted successfully'
    })

    const response = await app.handle(
      new Request('http://localhost/messages/message-id', {
        method: 'DELETE'
      })
    )

    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.status).toBe('success')
    expect(MessageController.deleteMessageController)
      .toHaveBeenCalledWith('message-id')
  })
})
