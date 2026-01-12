import { beforeEach, expect, it, vi, describe } from "vitest";
import { MessageService } from "../service";
import { pool } from "@api/db/pool";

vi.mock("@api/db/pool", () => ({
    pool: {
        query: vi.fn()
    }
}))


describe('MessageService.addMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
     it('should add a new message successfully', async () => {
        (pool.query as any).mockResolvedValueOnce({
            rows: [{ messages_id: 'new-message-uuid' }]
        })
        const result = await MessageService.addMessage(
            {
                senderName: 'John Doe',
                senderEmail: 'johndoe@gmail.com',
                organizationName: 'Acme Corp',
                senderPhone: '123-456-7890',
                subject: ['Inquiry about services'],
                messageBody: 'Hello, I would like to know more about your services.'
            }
        )
        expect(pool.query).toHaveBeenCalledTimes(1)
        expect(result).toEqual({ messages_id: 'new-message-uuid' })
    })
})

describe('MessageService.getMessages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
        it('should retrieve all messages successfully', async () => {
            const date = new Date();
        (pool.query as any).mockResolvedValueOnce({
            rows: [
                {
                    messages_id: 'message-uuid-1',
                    sender_name: 'John Doe',
                    sender_email: 'johndoe@gmail.com',
                    organization_name: 'Acme Corp',
                    sender_phone: '123-456-7890',
                    subject: ['Inquiry about services'],
                    message_body: 'Hello, I would like to know more about your services.',
                    created_at: date
                }
            ]
        })
        const result = await MessageService.getMessages()
        expect(pool.query).toHaveBeenCalledTimes(1)
        expect(result).toEqual([
            {
                messages_id: 'message-uuid-1',
                sender_name: 'John Doe',
                sender_email: 'johndoe@gmail.com',
                organization_name: 'Acme Corp',
                sender_phone: '123-456-7890',
                subject: ['Inquiry about services'],
                message_body: 'Hello, I would like to know more about your services.',
                created_at: date
            }
        ])
    })
})

describe('MessageService.getMessageById', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('should throw BadRequest for invalid ID format', async () => {
        (pool.query as any).mockRejectedValueOnce(new Error('Invalid input syntax for type uuid'))
        await expect(MessageService.getMessageById('invalid-uuid')).rejects.toThrow('Invalid message ID format')
        expect(pool.query).toHaveBeenCalledTimes(1)
    })

    it('should throw ResourceNotFoundError if message does not exist', async () => {
        (pool.query as any).mockResolvedValueOnce({
            rows: []    
        })
        await expect(MessageService.getMessageById('nonexistent-uuid')).rejects.toThrow('Message not found')
        expect(pool.query).toHaveBeenCalledTimes(1)
    })
     
    it('should retrieve a message by ID successfully', async () => {
        (pool.query as any).mockResolvedValueOnce({
            rows: [{ messages_id: 'message-uuid-1' }]
        })
        const result = await MessageService.getMessageById('message-uuid-1')
        expect(pool.query).toHaveBeenCalledTimes(1)
        expect(result).toEqual({ messages_id: 'message-uuid-1' })
    })
})  

describe('MessageService.updateMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
     it('should update a message successfully', async () => {
        const date = new Date();
        (pool.query as any).mockResolvedValueOnce({
            rows: [
                {
                    messages_id: 'message-uuid-1',
                    sender_name: 'John Doe',
                    sender_email: 'johndoe@gmail.com',
                    organization_name: 'Acme Corp',
                    sender_phone: '123-456-7890',
                    status: 'READ',
                    subject: ['Inquiry about services'],
                    message_body: 'Hello, I would like to know more about your services.',
                    created_date: date
                }
            ]
        })  
        const result = await MessageService.updateMessage(
            'message-uuid-1',
            { status: 'READ' },
            'admin-user'
        )
        expect(pool.query).toHaveBeenCalledTimes(1)
        expect(result).toEqual(
            {
                messages_id: 'message-uuid-1',
                sender_name: 'John Doe',
                sender_email: 'johndoe@gmail.com',
                organization_name: 'Acme Corp',
                sender_phone: '123-456-7890',
                status: 'READ',
                subject: ['Inquiry about services'],
                message_body: 'Hello, I would like to know more about your services.',
                created_date: date
            }
        )
    }) 
})

describe('MessageService.deleteMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
     it('should delete a message successfully', async () => {
        (pool.query as any).mockResolvedValueOnce({})
        await MessageService.deleteMessage('message-uuid-1')
        expect(pool.query).toHaveBeenCalledTimes(1)
    }  )
})  
