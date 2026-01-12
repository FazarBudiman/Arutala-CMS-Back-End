import { JwtPayload } from "@api/types/elysia";
import { MessageCreateProps, MessageUpdateProps } from "./model";
import { MessageService } from "./service";


export class MessageController {
    static addMessageController = async (input: MessageCreateProps) => {
        const message = await MessageService.addMessage(input)
        return {
            status: 'success',
            data: message
        }
    }

    static getMessagesController = async () => {
        const messages = await MessageService.getMessages()
        return {
            status: 'success',
            data: messages
        }
    }

    static updateMessageController = async (id: string, input: MessageUpdateProps, user: JwtPayload) => {
        await MessageService.getMessageById(id) 
        const updatedMessage = await MessageService.updateMessage(id, input, user.user_id)
        return {
            status: 'success',
            data: updatedMessage
        }
    }

    static deleteMessageController = async (id: string) => {    
        await MessageService.getMessageById(id)
        await MessageService.deleteMessage(id);
        return {
            status: 'success',
            message: 'Message deleted successfully'
        }
    }
}