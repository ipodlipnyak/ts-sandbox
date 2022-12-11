import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658824074998 implements MigrationInterface {
  name = 'migration1658824074998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD "image" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "image"`);
  }
}
