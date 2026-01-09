import { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  // ENUM untuk status message
  pgm.createType('message_status', [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'PROPOSAL_SENT',
    'NEGOTIATION',
    'VERBAL_COMMITMENT',
    'CLOSED_WON',
    'CLOSED_LOSS',
    'ON_HOLD'
  ])

  pgm.createTable('messages', {
    messages_id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },

    sender_name: {
      type: 'varchar(255)',
      notNull: true
    },

    sender_email: {
      type: 'varchar(50)',
      notNull: true
    },

    organization_name: {
      type: 'varchar(255)',
      notNull: false
    },

    sender_phone: {
      type: 'varchar(20)',
      notNull: false
    },

    subject: {
      type: 'text[]',
      notNull: false
    },

    message_body: {
      type: 'text',
      notNull: true
    },

    status: {
      type: 'message_status',
      notNull: true,
      default: 'NEW'
    },

    created_by: {
      type: 'uuid',
      notNull: false,
      references: 'users(users_id)',
      onDelete: 'SET NULL'
    },

    created_date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },

    updated_by: {
      type: 'uuid',
      notNull: false,
      references: 'users(users_id)',
      onDelete: 'SET NULL'
    },

    updated_date: {
      type: 'timestamp',
      notNull: false
    }
  })

  // Index penting
  pgm.createIndex('messages', 'status')
  pgm.createIndex('messages', 'sender_email')
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('messages')
  pgm.dropType('message_status')
}
