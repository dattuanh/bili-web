import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddSubjectThumbnail1697789754119 implements MigrationInterface {
    name = 'AddSubjectThumbnail1697789754119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject" ADD "thumbnail_id" integer`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "UQ_e3541df79082f165617b72cc280" UNIQUE ("thumbnail_id")`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "FK_e3541df79082f165617b72cc280" FOREIGN KEY ("thumbnail_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_e3541df79082f165617b72cc280"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "UQ_e3541df79082f165617b72cc280"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "thumbnail_id"`);
    }

}
