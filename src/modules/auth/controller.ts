import { JwtPayload } from "@api/types/elysia";
import { AuthCreateprops, AuthRefreshTokenProps } from "./model";
import { AuthService } from "./service";
import { BadRequest } from "@api/utils/error";

export class AuthController {
    static async login(
        input: AuthCreateprops,
        deps: {
            accessJwt: any
            refreshJwt: any
        },
    ) {
        const { users_id, roles_name } =
            await AuthService.verifyUserCredential(input)

        const jwtPayload: JwtPayload = {
            user_id: users_id,
            user_role: roles_name
        }

        const accessToken = await deps.accessJwt.sign(jwtPayload)
        const refreshToken = await deps.refreshJwt.sign(jwtPayload)

        await AuthService.saveRefreshToken(refreshToken)
        
        return {
            status: 'success',
            message: 'Login Berhasil',
            data: {
                accessToken,
                refreshToken
            }
        }
    }

    static async refresh(
        token: AuthRefreshTokenProps,
        deps: {
            refreshJwt: any
            accessJwt: any
        }
    ) {
        await AuthService.isRefreshTokenExist(token.refreshToken)
        const payload = await deps.refreshJwt.verify(token.refreshToken)

        if (payload === false) {
            throw new BadRequest('Invalid or expired token')
        }


        const newAccessToken = await deps.accessJwt.sign({
            sub: payload.sub,
            role: payload.role
        })

        return { 
            status: 'success',
            message: 'Memperbarui Access Token Berhasil',
            data: {
                accessToken: newAccessToken 
            }    
        }
    }


    static logout = async (token: AuthRefreshTokenProps, deps: {refreshJwt: any, accessJwt: any}) => {
         const payload = await deps.refreshJwt.verify(token.refreshToken)

        if (payload === false) {
            throw new BadRequest('Invalid or expired token')
        }
        await AuthService.deleteRefreshToken(token)
        return {
            status: 'success',
            message: 'Logout Berhasil'
        }
    }
}
