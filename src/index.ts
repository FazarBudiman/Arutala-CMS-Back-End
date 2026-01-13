import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { messages } from './modules/messages/route'
import { HttpError } from './utils/error'
import { formatElysiaValidation } from './utils/helper'
import { auth } from './modules/auth/route'
import { users } from './modules/users/route'
import { mentors } from './modules/mentors/route'


const app = new Elysia()
    .use(
        cors({
            origin: '*'
        })
    )
    
    .onError(({error, code,  set}) => {
        console.log(error)

        if (code === 'NOT_FOUND') {
            set.status = 404
            return {
                status: 'fail',
                code : 'NOT_FOUND',
                message: 'Route Not Found'
            }
        }

        if (code === 'VALIDATION') {
            set.status = 422
            return {
                status: 'fail',
                code: 'VALIDATION_ERROR',
                message: 'Invalid request data',
                fields: formatElysiaValidation(error)
            }
        }
        
        if (error instanceof HttpError) {
            set.status = error.status
            return {
                status: 'fail',
                code: error.code,
                message: error.message,
                fields: error.fields
            }
        }
        
        set.status = 500
        return {
            status: 'fail',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Unexpected error'
        }
    })
    // .use(otel)
    .use(auth)
    .use(users)
    .use(messages)
    .use(mentors)
    .get('/', () => 'Hello Elysia')
    // .listen(Bun.env.PORT ?? 3001)

process.on('beforeExit', app.stop)

export default app

// console.log(
//     `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
// )
