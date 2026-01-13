import { pool } from "@api/db/pool";
import { MessageCreateProps } from "./model";
import { BadRequest, ResourceNotFoundError,  } from "@api/utils/error";

abstract class MessageService {
    static addMessage = async (payload: MessageCreateProps) => {
        const { rows } = await pool.query(
            `INSERT INTO messages (sender_name, sender_email, organization_name, sender_phone, subject, message_body) 
                VALUES($1, $2, $3, $4, $5, $6) RETURNING messages_id`,
            [payload.senderName, payload.senderEmail, payload.organizationName, payload.senderPhone, payload.subject, payload.messageBody]
        )
        return rows[0]
    }

    static getMessages = async () => { 
        const { rows } = await pool.query(
            `SELECT messages_id, sender_name, sender_email, sender_phone, organization_name, status, subject, message_body, created_date 
                FROM messages WHERE is_deleted = false ORDER BY created_date DESC`

        )
        return rows
    }

    static getMessageById = async (id: string) => {
        let result
        try {
            result = await pool.query(
                `SELECT messages_id FROM messages WHERE messages_id = $1 AND is_deleted = false`,
                [id]
            )
        } catch  {
            throw new BadRequest('Invalid message ID format')
        }          

        if (result.rows.length < 1) {
            throw new ResourceNotFoundError('Message not found')
        }
        return result.rows[0]
    }

    static updateMessage = async (id: string, payload: { status: string }, updatedBy: string) => {
        const { rows } = await pool.query(
            `UPDATE messages SET status = $1, updated_by = $2, updated_date = NOW() WHERE messages_id = $3 
                RETURNING messages_id, sender_name, sender_email, sender_phone, organization_name, status, subject, message_body, created_date`,
            [payload.status, updatedBy, id]
        )
        return rows[0]
    }

    static deleteMessage = async (id: string) => {
        await pool.query(
            `UPDATE messages SET is_deleted = true WHERE messages_id = $1`,
            [id]
        )
    }
}

export { MessageService }