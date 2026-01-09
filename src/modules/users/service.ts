import { pool } from "@api/db/pool";
import { UserCreateProps } from "./model";
import { BadRequest, NotFoundError } from "@api/utils/error";
import bcrypt from 'bcrypt'

abstract class UserService {
    static addUser = async (payload: UserCreateProps, userWhoCreated: string) => {
        const passwordHash = bcrypt.hashSync(payload.password, 12);

        const resRoleId = await pool.query(
            `SELECT roles_id FROM roles WHERE roles_name = $1`,
            [payload.userRole]
        )
        const roleId = resRoleId.rows[0].roles_id;

        const { rows } = await pool.query(
            `INSERT INTO users (users_id, username, password_hash, url_profile, users_role_id, created_by)
                VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING users_id`,
            [payload.username, passwordHash, payload.urlProfile, roleId, userWhoCreated]
        )
        return rows[0]
    }

    static verifyUsernameIsExisting = async (username: string): Promise<boolean> => {
        const  {rows}  = await pool.query(
            `SELECT username FROM users WHERE username = $1`,
            [username]
        )

        if (rows.length > 0) {

            throw new BadRequest('Username already exists')
        } else {
            return true
           
        }
    }

    static getUsers = async () => {
        const { rows } = await pool.query(
            `SELECT 
                u.users_id,
                u.username,
                u.url_profile,
                r.roles_name,
                u.is_active
            FROM users u
            JOIN roles r ON u.users_role_id = r.roles_id`
        )
        return { rows }
    }

    static getUserById = async (userId: string) => {
        let result
        try {
            result =  await pool.query(
                `SELECT users_id FROM users WHERE users_id = $1`,
                [userId]
            )
        } catch {
            throw new BadRequest('Invalid user ID format')
        }

        if (result.rows.length < 1) {
                throw new NotFoundError('User not found')
            } 
        
        return result.rows[0]
    
    }

    static deleteUserById = async (userId: string) => {
        const { rows } = await pool.query(
            `DELETE FROM users WHERE users_id = $1 RETURNING users_id`,
            [userId] 
        )
        return rows[0]
    }
}

export { UserService }