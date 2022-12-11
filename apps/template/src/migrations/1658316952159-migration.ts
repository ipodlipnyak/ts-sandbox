import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658316952159 implements MigrationInterface {
  name = 'migration1658316952159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."balance_code_enum" AS ENUM('100', '200')`);
    await queryRunner.query(
      `CREATE TABLE "balance" ("id" SERIAL NOT NULL, "value" integer NOT NULL DEFAULT '0', "code" "public"."balance_code_enum" NOT NULL DEFAULT '100', "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance" ADD CONSTRAINT "FK_9297a70b26dc787156fa49de26b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "balance" DROP CONSTRAINT "FK_9297a70b26dc787156fa49de26b"`,
    );
    await queryRunner.query(`DROP TABLE "balance"`);
    await queryRunner.query(`DROP TYPE "public"."balance_code_enum"`);
  }
}
