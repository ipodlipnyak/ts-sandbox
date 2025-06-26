import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739786650981 implements MigrationInterface {
    name = 'Migration1739786650981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telegram_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tgUserId" character varying, "tgChatId" character varying, "username" character varying, "firstName" character varying, "lastName" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_dcba80e97f84ad7f9bc8f19f472" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_96b7af435f063df981696c5654" ON "telegram_users" ("tgUserId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_37bced8b3b4e1eb28c3767a6ed" ON "telegram_users" ("tgChatId") `);
        await queryRunner.query(`ALTER TABLE "telegram_users" ADD CONSTRAINT "FK_ff1903739082dfa75f7c7e16b50" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_users" DROP CONSTRAINT "FK_ff1903739082dfa75f7c7e16b50"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37bced8b3b4e1eb28c3767a6ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96b7af435f063df981696c5654"`);
        await queryRunner.query(`DROP TABLE "telegram_users"`);
    }

}
