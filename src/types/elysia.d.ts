export interface JwtPayload {
    user_id: string
    user_role: 'SUPER_ADMIN' | 'ADMIN'
}

declare module 'elysia' {
    interface Context {
        user: JwtPayload
    }
}