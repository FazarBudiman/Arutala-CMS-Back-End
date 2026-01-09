import { describe, expect, it, vi } from "vitest";
import { AuthService } from "../service";
import { AuthController } from "../controller";

describe('AuthContoller.login', () => {
    it('should return tokens when login success', async () => {
        vi.spyOn(AuthService, 'verifyUserCredential').mockResolvedValue({
            users_id: 1,
            roles_name: 'admin'
        } as any);  

        vi.spyOn(AuthService, 'saveRefreshToken').mockResolvedValue(undefined);

        const deps = {
            accessJwt: {sign: vi.fn().mockResolvedValue('accessToken')},
            refreshJwt: {sign: vi.fn().mockResolvedValue('refreshToken')}
        }

        const result = await AuthController.login(
            {username: 'admin', password: 'admin123'},
            deps
        )

        expect(deps.accessJwt.sign).toHaveBeenCalled()
        expect(deps.refreshJwt.sign).toHaveBeenCalled()
        expect(result.data.accessToken).toBe('accessToken')
        expect(result.data.refreshToken).toBe('refreshToken')
    })
})

describe('AuthController.refresh', () => {
    it('should return new access token when refresh token is valid', async () => {
        const deps = {
            refreshJwt: {verify: vi.fn().mockResolvedValue({sub: 1, role: 'admin'})},
            accessJwt: {sign: vi.fn().mockResolvedValue('newAccessToken')}
        }
        const result = await AuthController.refresh(
            {refreshToken: 'validRefreshToken'},
            deps
        )
        expect(deps.refreshJwt.verify).toHaveBeenCalledWith('validRefreshToken')
        expect(deps.accessJwt.sign).toHaveBeenCalledWith({sub: 1, role: 'admin'})
        expect(result.data.accessToken).toBe('newAccessToken')
    })

    it('should throw BadRequest when refresh token is invalid', async () => {
        const deps = {
            refreshJwt: {verify: vi.fn().mockResolvedValue(false)},
            accessJwt: {sign: vi.fn()}
        }
        await expect(
            AuthController.refresh(
                {refreshToken: 'invalidRefreshToken'},
                deps
            )
        ).rejects.toThrow('Invalid or expired token')
    })
})

describe('AuthController.logout', () => {
    it('should call deleteRefreshToken with the provided token', async () => {
        vi.spyOn(AuthService, 'deleteRefreshToken').mockResolvedValue(undefined);
        const deps = {
            refreshJwt: {verify: vi.fn().mockResolvedValue({sub: 1, role: 'admin'})},
            accessJwt: {}
        }
        await AuthController.logout({refreshToken: 'validRefreshToken'}, deps);
        expect(AuthService.deleteRefreshToken).toHaveBeenCalledWith({refreshToken: 'validRefreshToken'});
        expect(deps.refreshJwt.verify).toHaveBeenCalledWith('validRefreshToken')
    })

    it('should throw BadRequest when refresh token is invalid during logout', async () => {
        const deps = {
            refreshJwt: {verify: vi.fn().mockResolvedValue(false)},
            accessJwt: {}
        }
        await expect(
            AuthController.logout(
                {refreshToken: 'invalidRefreshToken'},
                deps
            )
        ).rejects.toThrow('Invalid or expired token')
    })
})