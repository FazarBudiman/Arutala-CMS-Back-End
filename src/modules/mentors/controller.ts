import { JwtPayload } from "@api/types/elysia";
import { MentorCreateProps, MentorUploadProps } from "./model";
import { MentorService } from "./service";

export class MentorController {
    static uploadProfileController = async (input: MentorUploadProps) => {
        const urlProfile = await MentorService.uploadProfile(input)
        return {
            status: 'success',
            data: {
                urlProfile
            }
        }
    }

    static addMentorController = async (input: MentorCreateProps, user: JwtPayload) => {
        const mentors_id  = await MentorService.addMentor(input, user.user_id)
        return {
            status: 'success',
            data: mentors_id
        }
    }

    static getAllMentorController = async () => {
        const mentors = await MentorService.getAllMentor()
        return {
            status: 'success',
            data: mentors
        }
    }

    static editMentorController = async (input: MentorCreateProps, user: JwtPayload, mentorId: string) => {
        await MentorService.getMentorById(mentorId)
        const mentors_id = await MentorService.editMentor(input, user.user_id, mentorId)
        return {
            status: 'success',
            data: mentors_id
        }
    }

    static deleteMentorController = async (mentorId: string) => {
        await MentorService.getMentorById(mentorId)
        const mentors_id = await MentorService.deleteMentor(mentorId)
        return {
            status: 'success',
            data: mentors_id
        }
    }
}