/* eslint-disable @typescript-eslint/no-explicit-any */
import Elysia from "elysia";
import { UserController } from "./controller";
import { UserCreateModels } from "./model";
import {  authGuard } from "@api/guards/authGuard";
import { requireSuperAdmin } from "@api/guards/roleGuard";

export const users = new Elysia()
    .group('/users', (app) => 
        app.use(authGuard).use(requireSuperAdmin)
        .post('/', 
            async (ctx) => {
                const { body, user } = ctx as any;
                const res = await UserController.addUserController(body, user);
                ctx.set.status = 201
                return res
            }, 
            {
                body: UserCreateModels
            }
        )

        .get('/', async () => {
            const res = await UserController.getUsersController()
            return res
        })

        .delete('/:userId', async (ctx) => {
            const { params } = ctx as any;
            const res  = await UserController.deleteUsersController(params.userId)
            return res
        })
    )
    
