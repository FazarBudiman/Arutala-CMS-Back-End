import Elysia from "elysia";
import { MessageController } from "./controller";
import { MessageCreateModels, MessageUpdateModels } from "./model";
import { authGuard } from "@api/guards/authGuard";
import { requireAdmin } from "@api/guards/roleGuard";

export const messages  = new Elysia()
    .group('/messages', (app) => 
      app
        .post('/',  async (ctx) => { 
            const { body } = ctx as any;
            const res = await MessageController.addMessageController(body) 
            ctx.set.status = 201
            return res
        }, {
            body : MessageCreateModels
        })

        .use(authGuard)
        .use(requireAdmin)
        .get('/', async () => {
            const res = await MessageController.getMessagesController()
            return res
        })

        .put('/:id', async (ctx) => {
            const { params, body, user } = ctx as any;
            const res = await MessageController.updateMessageController(params.id, body, user)

            return res
        }, {
            body : MessageUpdateModels
        }) 

        .delete('/:id', async ({params}) => {
            const { id } = params;
            const res = await MessageController.deleteMessageController(id);
            return res;
        })
            
    );