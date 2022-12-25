import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1671956578392 implements MigrationInterface {
    name = 'migration1671956578392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_type_enum" AS ENUM('REAL', 'AD')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "active" boolean NOT NULL DEFAULT true, "code" character varying NOT NULL, "name" character varying, "description" text, "secret" text, "image" character varying, "price" integer NOT NULL DEFAULT '0', "type" "public"."product_type_enum" NOT NULL DEFAULT 'REAL', "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99c39b067cfa73c783f0fc49a61" UNIQUE ("code"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "productId" integer, "balanceId" integer, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."balance_code_enum" AS ENUM('100', '200', '201')`);
        await queryRunner.query(`CREATE TABLE "balance" ("id" SERIAL NOT NULL, "value" integer NOT NULL DEFAULT '0', "code" "public"."balance_code_enum" NOT NULL DEFAULT '100', "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track" ("id" SERIAL NOT NULL, "name" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" integer NOT NULL DEFAULT '200', "active" boolean NOT NULL DEFAULT false, "firstName" character varying, "middleName" character varying, "lastName" character varying, "email" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying, "trackId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_9af3a556aa0f166dd771a1e6c46" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_006cffa5dd266047263ca4a0eef" FOREIGN KEY ("balanceId") REFERENCES "balance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balance" ADD CONSTRAINT "FK_9297a70b26dc787156fa49de26b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_383d06e469d36b812546f50bec2" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_383d06e469d36b812546f50bec2"`);
        await queryRunner.query(`ALTER TABLE "balance" DROP CONSTRAINT "FK_9297a70b26dc787156fa49de26b"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_006cffa5dd266047263ca4a0eef"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_9af3a556aa0f166dd771a1e6c46"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "track"`);
        await queryRunner.query(`DROP TABLE "balance"`);
        await queryRunner.query(`DROP TYPE "public"."balance_code_enum"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_type_enum"`);
    }

}
