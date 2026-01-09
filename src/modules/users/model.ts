import {Static, t} from 'elysia'

export const UserCreateModels = t.Object({
    username: t.String(),
    password: t.String(),
    userRole : t.Union([t.Literal('ADMIN'), t.Literal('SUPER_ADMIN')]),
    urlProfile: t.Optional(t.String()),
}) 

export type UserCreateProps = Static<typeof UserCreateModels>

