import Elysia from "elysia";
import { MessageController } from "./controller";
import { MessageCreateModels } from "./model";
import { authGuard } from "@api/guards/authGuard";
import { requireAdmin } from "@api/guards/roleGuard";

export const messages  = new Elysia()
    .group('/messages', (app) => 
      app
        .post('/', ({ body }) => MessageController.addMessageController(body), {
            body : MessageCreateModels
        })

        .use(authGuard)
        .use(requireAdmin)
        .get('/', async () => {
            const res = await MessageController.getMessagesController()
            return res
        })
            
    );