import { MessageCreateProps } from "./model";
import { MessageService } from "./service";


export class MessageController {
    static addMessageController = async (input: MessageCreateProps) => {
        const message = await MessageService.addMessage(input)
        return {
            status: 'success',
            id: message
        }
    }
}