import { beforeEach, describe, expect, it, vi } from "vitest";
import { MessageService } from "../service";
import { MessageController } from "../controller";

vi.mock("../service", () => ({
    MessageService: {
        addMessage: vi.fn(),
        getMessages: vi.fn(),   
        getMessageById: vi.fn(),
        updateMessage: vi.fn(),
        deleteMessage: vi.fn()
    }
}))

describe('MessageController.addMessage', () => {
   beforeEach(() => {
        vi.clearAllMocks();
    })
    it('should add a new message successfully', async () => {
      (MessageService.addMessage as any).mockResolvedValueOnce({
          messages_id: 'new-message-uuid'
      })
      const input = {
            senderName: 'John Doe',
            senderEmail: 'johndoe@gmail.com',
            organizationName: 'Acme Corp',
            senderPhone: '123-456-7890',
            subject: ['Inquiry about services'],
            messageBody: 'Hello, I would like to know more about your services.'
        } 
        const result = await MessageController.addMessageController(input)
        expect(MessageService.addMessage).toHaveBeenCalledWith(input)
        expect(result).toEqual({
            status: 'success',
            data: { messages_id: 'new-message-uuid' }
        })
    })
})

describe('MessageController.getMessages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it('should retrieve all messages successfully', async () => {
        const date = new Date();
        (MessageService.getMessages as any).mockResolvedValueOnce([
            {
                messages_id: 'message-uuid-1',
                sender_name: 'John Doe',
                sender_email: 'johnDoe@gmail.com',
                organization_name: 'Acme Corp',
                sender_phone: '123-456-7890',
                subject: ['Inquiry about services'],
                message_body: 'Hello, I would like to know more about your services.',
                created_at: date 
            }
        ])
        const result = await MessageController.getMessagesController()
        expect(MessageService.getMessages).toHaveBeenCalledTimes(1)
        expect(result).toEqual({
            status: 'success',
            data: [
                {
                    messages_id: 'message-uuid-1',
                    sender_name: 'John Doe',
                    sender_email: 'johnDoe@gmail.com',
                    organization_name: 'Acme Corp',
                    sender_phone: '123-456-7890',
                    subject: ['Inquiry about services'],
                    message_body: 'Hello, I would like to know more about your services.',
                    created_at: date
                }
            ]
        })
    })
})


describe('MessageController.updateMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it('should update a message successfully', async () => {
        (MessageService.getMessageById as any).mockResolvedValueOnce({
            messages_id: 'message-uuid-1'
        });
        (MessageService.updateMessage as any).mockResolvedValueOnce({
            messages_id: 'message-uuid-1',
            status: 'CONTACTED',
        })
        const input = { status: 'CONTACTED' } as const
        const user = { user_id: 'admin-user', user_role: 'ADMIN' } as const
        const result = await MessageController.updateMessageController(
            'message-uuid-1',
            input,
            user
        )       
        expect(MessageService.getMessageById).toHaveBeenCalledWith('message-uuid-1')
        expect(MessageService.updateMessage).toHaveBeenCalledWith(
            'message-uuid-1',
            input,
            'admin-user'
        )
        expect(result).toEqual({
            status: 'success',
            data: {
                messages_id: 'message-uuid-1',
                status: 'CONTACTED',
            }
        })
    })
})

describe('MessageController.deleteMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it('should delete a message successfully', async () => {
        (MessageService.getMessageById as any).mockResolvedValueOnce({
            messages_id: 'message-uuid-1'
        });
        (MessageService.deleteMessage as any).mockResolvedValueOnce({})
        const result = await MessageController.deleteMessageController('message-uuid-1')

        expect(MessageService.getMessageById).toHaveBeenCalledWith('message-uuid-1')
        expect(MessageService.deleteMessage).toHaveBeenCalledWith('message-uuid-1')
        expect(result).toEqual({
            status: 'success',
            message: 'Message deleted successfully'
        })
    })
}) 