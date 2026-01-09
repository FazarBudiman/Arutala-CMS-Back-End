import Elysia from "elysia";
import { AuthController } from "./controller";
import { AuthCreateModels, AuthRefreshTokenModels } from "./model";
import { jwtPlugin } from "@api/plugins/jwt";

export const auth = new Elysia()
    .use(jwtPlugin)
    .post( '/auth',
        async (ctx) => {
            const { body, accessJwt, refreshJwt } = ctx
            const res = await AuthController.login(
                body,
                {
                    accessJwt, refreshJwt
                }
            )

            ctx.set.status = 201
            return res
        },
        {
            body: AuthCreateModels
        }
    )

    
    .put(
        "/auth",
        async ({ body, accessJwt, refreshJwt }) => 
            AuthController.refresh(body, {accessJwt, refreshJwt}),
        {
            body: AuthRefreshTokenModels
        }
    )

    .delete(
        "/auth",
        async ({body, accessJwt, refreshJwt}) => 
            AuthController.logout(body, {accessJwt, refreshJwt}),
        {
            body: AuthRefreshTokenModels
        }
    )
