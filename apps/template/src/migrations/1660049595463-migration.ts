import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1660049595463 implements MigrationInterface {
    name = 'migration1660049595463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "active" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
    }

}
