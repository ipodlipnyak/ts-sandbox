import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658752730446 implements MigrationInterface {
  name = 'migration1658752730446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
  }
}
