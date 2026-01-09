import { jwtPlugin } from '@api/plugins/jwt'
import { UnauthorizedError } from '@api/utils/error'
import bearer from '@elysiajs/bearer'
import { Elysia } from 'elysia'

export const authGuard = (app: Elysia) => 
    app
    .use(bearer())
    .use(jwtPlugin)
    .onBeforeHandle( async (ctx) => {
        if (!ctx.bearer) {
            throw new UnauthorizedError('Missing access token')
        }

        const payload = await ctx.accessJwt.verify(ctx.bearer)
        if (!payload) {
            throw new UnauthorizedError('Invalid or expired token')
        }

        // Set user context from JWT payload
        (ctx as any).user = {
            user_id: payload.user_id,
            user_role: payload.user_role
        }
    })
