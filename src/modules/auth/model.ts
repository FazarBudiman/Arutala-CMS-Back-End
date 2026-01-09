import { Static, t } from "elysia";

export const AuthCreateModels = t.Object({
    username: t.String(),
    password: t.String()
})

export type AuthCreateprops = Static <typeof AuthCreateModels>

export const AuthRefreshTokenModels = t.Object({
    refreshToken: t.String()
})

export type AuthRefreshTokenProps = Static <typeof AuthRefreshTokenModels>