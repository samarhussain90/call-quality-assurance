import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1710864000000 implements MigrationInterface {
    name = "InitialSchema1710864000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create organizations table
        await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "logo_url" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "settings" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_organizations_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_organizations" PRIMARY KEY ("id")
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM ('admin', 'manager', 'agent', 'viewer')
        `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password_hash" character varying NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "avatar_url" character varying,
                "role" "user_role_enum" NOT NULL DEFAULT 'agent',
                "is_active" boolean NOT NULL DEFAULT true,
                "email_verified" boolean NOT NULL DEFAULT false,
                "preferences" jsonb,
                "organization_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "FK_users_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
            )
        `);

        // Create teams table
        await queryRunner.query(`
            CREATE TABLE "teams" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "organization_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_teams" PRIMARY KEY ("id"),
                CONSTRAINT "FK_teams_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE
            )
        `);

        // Create team_members junction table
        await queryRunner.query(`
            CREATE TABLE "team_members" (
                "team_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_team_members" PRIMARY KEY ("team_id", "user_id"),
                CONSTRAINT "FK_team_members_team" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_team_members_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "team_members"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
    }
} 