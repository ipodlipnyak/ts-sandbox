import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659107826256 implements MigrationInterface {
  name = 'migration1659107826256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "link" TO "secret"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "secret"`);
    await queryRunner.query(`ALTER TABLE "product" ADD "secret" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "secret"`);
    await queryRunner.query(`ALTER TABLE "product" ADD "secret" character varying`);
    await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "secret" TO "link"`);
  }
}
