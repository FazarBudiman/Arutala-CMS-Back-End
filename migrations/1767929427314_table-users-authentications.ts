import { MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  // UUID support
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

  /* ========= ROLES ========= */
  pgm.createTable('roles', {
    roles_id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    roles_name: {
      type: 'varchar(50)',
      notNull: true,
      unique: true
    }
  })

  /* ========= PERMISSIONS ========= */
  pgm.createTable('permissions', {
    permissions_id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    permissions_action: {
      type: 'varchar(100)',
      notNull: true,
      unique: true
    }
  })

  /* ========= ROLES_PERMISSIONS ========= */
  pgm.createTable('roles_permissions', {
    rp_roles_id: {
      type: 'uuid',
      notNull: true,
      references: 'roles',
      onDelete: 'CASCADE'
    },
    rp_permissions_id: {
      type: 'uuid',
      notNull: true,
      references: 'permissions',
      onDelete: 'CASCADE'
    }
  })

  pgm.addConstraint('roles_permissions', 'roles_permissions_pk', {
    primaryKey: ['rp_roles_id', 'rp_permissions_id']
  })

  /* ========= USERS ========= */
  pgm.createTable('users', {
    users_id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    username: {
      type: 'varchar(100)',
      notNull: true,
      unique: true
    },
    password_hash: {
      type: 'varchar(255)',
      notNull: true
    },
    is_active: {
      type: 'boolean',
      notNull: true,
      default: true
    },
    is_deleted: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    url_profile: {
      type: 'varchar(255)'
    },
    users_role_id: {
      type: 'uuid',
      notNull: true,
      references: 'roles',
      onDelete: 'RESTRICT'
    },
    created_by: {
      type: 'varchar(100)'
    },
    created_date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()')
    },
    updated_by: {
      type: 'varchar(100)'
    },
    updated_date: {
      type: 'timestamp'
    }
  })

  /* ========= AUTHENTICATIONS ========= */
  pgm.createTable('authentications', {
    refresh_token: {
      type: 'text',
      notNull: true
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('authentications')
  pgm.dropTable('users')
  pgm.dropTable('roles_permissions')
  pgm.dropTable('permissions')
  pgm.dropTable('roles')
}
