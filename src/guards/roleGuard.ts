import { Elysia } from 'elysia'
import { ForbiddenError } from '@api/utils/error'
import { pool } from '@api/db/pool'

export type Role = 'ADMIN' | 'SUPER_ADMIN'

export interface RoleGuardOptions {
    allowedRoles: Role | Role[]
}

/**
 * Get user roles from database
 */
export const getUserRoles = async (userId: string): Promise<Role[]> => {
    try {
        const result = await pool.query(
            `SELECT r.roles_name
                FROM users u
                JOIN roles r ON u.users_role_id = r.roles_id
                WHERE u.users_id = $1`,
            [userId]
        )

        return result.rows.map(row => row.roles_name as Role)
    } catch (error) {
        console.error('Error fetching user roles:', error)
        return []
    }
}

/**
 * Role Guard - Validates user roles
 * @param allowedRoles - Single role or array of allowed roles
 */
export const roleGuard = (allowedRoles: Role | Role[]) => {
    const roleList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    return (app: Elysia) =>
        app.onBeforeHandle(async (ctx) => {
            // User should already be authenticated by authGuard
            const user = (ctx as any).user
            if (!user) {
                throw new ForbiddenError('User context not found. Ensure authGuard is applied first.')
            }

            // Fetch user roles from database
            const userRoles = await getUserRoles(user.user_id)
            
            // Check if user has any of the allowed roles
            const hasAccess = roleList.some(role => userRoles.includes(role))

            if (!hasAccess) {
                throw new ForbiddenError('Insufficient permissions to access this resource')
            }
        })
}


/**
 * Middleware for requiring SUPERADMIN role
 */
export const requireSuperAdmin = (app: Elysia) => roleGuard('SUPER_ADMIN')(app)


/**
 * Middleware for requiring SUPER_ADMIN or ADMIN role
 */
export const requireAdmin = (app: Elysia) => roleGuard(['ADMIN', 'SUPER_ADMIN'])(app)
