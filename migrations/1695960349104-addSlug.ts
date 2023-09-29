import { MigrationInterface, QueryRunner } from "typeorm";

export class  AddSlug1695960349104 implements MigrationInterface {
    name = ' AddSlug1695960349104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_detail" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "news_detail" ADD CONSTRAINT "UQ_401ae3c6c35ed9f82e4d72d27d2" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "subject_detail" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "subject_detail" ADD CONSTRAINT "UQ_df16ba4ab282fcf723c52f63b06" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject_detail" DROP CONSTRAINT "UQ_df16ba4ab282fcf723c52f63b06"`);
        await queryRunner.query(`ALTER TABLE "subject_detail" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "news_detail" DROP CONSTRAINT "UQ_401ae3c6c35ed9f82e4d72d27d2"`);
        await queryRunner.query(`ALTER TABLE "news_detail" DROP COLUMN "slug"`);
    }

}
