import Elysia from "elysia";
import { MessageController } from "./controller";
import { MessageCreateModels } from "./model";

export const messages  = new Elysia()
    .post('/messages', ({ body }) => MessageController.addMessageController(body), {
        body : MessageCreateModels
    })