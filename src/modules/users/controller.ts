import { JwtPayload } from "@api/types/elysia";
import { UserCreateProps } from "./model";
import { UserService } from "./service";

export class UserController {
    static addUserController = async (input: UserCreateProps, userPayload: JwtPayload) => {
        await UserService.verifyUsernameIsExisting(input.username)
        const user = await UserService.addUser(input, userPayload.user_id)
        
        return {
            status: 'success',
            message: 'User created successfully',
            data: user
        }
    }

    static getUsersController = async () => {
        const  { rows } = await UserService.getUsers()
        return {
            status: 'success',
            data: rows
        }
    }

    static deleteUsersController = async (userId: string) => {
        await UserService.getUserById(userId)
        const id = await UserService.deleteUserById(userId)
        return {
            status: 'success',
            message: 'User deleted successfully',
            data: id
        }
    }
}