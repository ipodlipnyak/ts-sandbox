import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1712311853653 implements MigrationInterface {
    name = 'Migration1712311853653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "pictureUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pictureUrl"`);
    }

}
