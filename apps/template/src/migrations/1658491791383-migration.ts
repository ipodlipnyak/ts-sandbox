import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658491791383 implements MigrationInterface {
  name = 'migration1658491791383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD "active" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "active"`);
  }
}
