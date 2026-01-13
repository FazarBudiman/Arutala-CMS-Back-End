import { uploadToStorage } from "@api/utils/uploadStorage";
import { MentorCreateProps, MentorUploadProps } from "./model";
import { pool } from "@api/db/pool";
import { BadRequest, ResourceNotFoundError } from "@api/utils/error";

export class MentorService {
    static uploadProfile = async (payload: MentorUploadProps) => {
        const urlProfile = await uploadToStorage(payload.profile, 'mentor')
        return urlProfile
    }

    static addMentor = async (payload: MentorCreateProps, userWhoCreated: string) => {
        const {mentorName, jobTitle, companyName, expertise, profileUrl} = payload
        const { rows } = await pool.query(
            `INSERT INTO mentors (mentors_name, job_title, company_name, expertise, profile_url, created_by)
                VALUES($1, $2, $3, $4, $5, $6) RETURNING mentors_id`,
                [mentorName, jobTitle, companyName, expertise, profileUrl, userWhoCreated ]
        )

        return rows[0]
    }

    static getAllMentor = async () => {
        const { rows } = await pool.query(
            `SELECT mentors_id, mentors_name, job_title, company_name, expertise, profile_url FROM mentors WHERE is_deleted = FALSE`
        )

        return rows
    }

    static getMentorById = async (mentorId: string) => {
        let result
        try {
            result = await pool.query(
                `SELECT mentors_id FROM mentors WHERE mentors_id = $1 AND is_deleted = FALSE`,
                [mentorId]
            )
        } catch  {
            throw new BadRequest('Invalid mentors_id format')
        }

        if (result.rows.length < 1) {
            throw new ResourceNotFoundError('Resource mentor not found')
        }
        return result.rows[0]
        
    }

    static editMentor = async (payload: MentorCreateProps, userWhoCreated: string, mentorId: string) => {
        const {mentorName, jobTitle, companyName, expertise, profileUrl} = payload
        const { rows } = await pool.query(
            `UPDATE mentors SET mentors_name = $1, job_title = $2, company_name = $3, expertise = $4, profile_url = $5, updated_by = $6, updated_date = NOW() 
                WHERE mentors_id = $7 
                RETURNING mentors_id`,
            [mentorName, jobTitle, companyName, expertise, profileUrl, userWhoCreated, mentorId]
        )
        return rows[0]
    }

    static deleteMentor = async (mentorId: string) => {
        const { rows } = await pool.query(
            `UPDATE mentors SET is_deleted = TRUE WHERE mentors_id = $1 RETURNING mentors_id`,
            [mentorId]
        )
        return rows[0]
    }
}
