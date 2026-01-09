import { pool } from "@api/db/pool";
import { MessageCreateProps } from "./model";

abstract class MessageService {
    static addMessage = async (payload: MessageCreateProps) => {
        const { rows } = await pool.query(
            `INSERT INTO messages (sender_name, sender_email, organization_name, sender_phone, subject, message_body) 
                VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
            [payload.senderName, payload.senderEmail, payload.organizationName, payload.senderPhone, payload.subject, payload.messageBody]
        )
        return rows[0]
    }
}

export { MessageService }