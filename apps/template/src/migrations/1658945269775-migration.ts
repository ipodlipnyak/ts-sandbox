import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658945269775 implements MigrationInterface {
  name = 'migration1658945269775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."balance_code_enum" RENAME TO "balance_code_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."balance_code_enum" AS ENUM('100', '200', '201')`,
    );
    await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "code" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "balance" ALTER COLUMN "code" TYPE "public"."balance_code_enum" USING "code"::"text"::"public"."balance_code_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "code" SET DEFAULT '100'`);
    await queryRunner.query(`DROP TYPE "public"."balance_code_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."balance_code_enum_old" AS ENUM('100', '200')`);
    await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "code" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "balance" ALTER COLUMN "code" TYPE "public"."balance_code_enum_old" USING "code"::"text"::"public"."balance_code_enum_old"`,
    );
    await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "code" SET DEFAULT '100'`);
    await queryRunner.query(`DROP TYPE "public"."balance_code_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."balance_code_enum_old" RENAME TO "balance_code_enum"`,
    );
  }
}
