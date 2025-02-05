import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738768087655 implements MigrationInterface {
    name = 'Migration1738768087655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telegram_users" ("id" integer NOT NULL, "username" character varying, "firstName" character varying, "lastName" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_dcba80e97f84ad7f9bc8f19f472" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "telegram_users" ADD CONSTRAINT "FK_ff1903739082dfa75f7c7e16b50" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_users" DROP CONSTRAINT "FK_ff1903739082dfa75f7c7e16b50"`);
        await queryRunner.query(`DROP TABLE "telegram_users"`);
    }

}
