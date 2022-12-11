import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1659327638746 implements MigrationInterface {
    name = 'migration1659327638746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "track" ("id" SERIAL NOT NULL, "name" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "trackId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_383d06e469d36b812546f50bec2" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_383d06e469d36b812546f50bec2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "trackId"`);
        await queryRunner.query(`DROP TABLE "track"`);
    }

}
