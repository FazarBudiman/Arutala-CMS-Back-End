import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const jwtPlugin = new Elysia()
    .use(jwt({
        name: 'accessJwt',
        secret: process.env.ACCESS_TOKEN_KEY!,
        exp: '60m'
    }))
    .use(jwt({
        name: 'refreshJwt',
        secret: process.env.REFRESH_TOKEN_KEY!,
        exp: '7d'
    }))
