import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1712650128668 implements MigrationInterface {
    name = 'Migration1712650128668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friendsheep" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "friendId" uuid, CONSTRAINT "PK_b601d54de6d06466b36ec4f99b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friendsheep" ADD CONSTRAINT "FK_e57b7ab8308ac760a463317baea" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendsheep" ADD CONSTRAINT "FK_0309c74e077bccd788d0a3f5be2" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendsheep" DROP CONSTRAINT "FK_0309c74e077bccd788d0a3f5be2"`);
        await queryRunner.query(`ALTER TABLE "friendsheep" DROP CONSTRAINT "FK_e57b7ab8308ac760a463317baea"`);
        await queryRunner.query(`DROP TABLE "friendsheep"`);
    }

}
