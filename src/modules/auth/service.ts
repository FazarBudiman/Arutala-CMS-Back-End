import { AuthCreateprops, AuthRefreshTokenProps } from "./model";
import bcrypt from 'bcrypt'
import { pool } from "@api/db/pool";
import { BadRequest } from "@api/utils/error";

abstract class AuthService {
    static verifyUserCredential = async (payload: AuthCreateprops) => {
        const { rows } = await pool.query(
            `SELECT u.users_id, u.password_hash, r.roles_name FROM users u
                JOIN roles r ON u.users_role_id = r.roles_id
                WHERE username = $1`,
            [payload.username]
        )

        if (!rows.length) {
            throw new BadRequest('Username Salah')
        } 

        const { users_id, password_hash, roles_name } = rows[0]
        const isMatch = await bcrypt.compare(payload.password, password_hash)
        if (isMatch === false) {
            throw new BadRequest('Password Salah')
        }

        return {users_id, roles_name};
    }   

    static saveRefreshToken = async (token: string) => {
        await pool.query(`INSERT INTO authentications VALUES ($1)`, [token])
    }

    static isRefreshTokenExist = async (token: string) => {
        const { rows } = await pool.query(`SELECT refresh_token FROM authentications WHERE refresh_token = $1`, [token])

        if (rows.length === 0) {
            throw new BadRequest('Invalid Refresh Token ')
        }
    }

    static deleteRefreshToken = async (token: AuthRefreshTokenProps) => {
        await pool.query(`DELETE from authentications WHERE refresh_token = $1`, [token.refreshToken])
    }
}

export { AuthService }