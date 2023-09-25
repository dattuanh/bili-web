import { MigrationInterface, QueryRunner } from "typeorm";

export class  FirstMigration1695201489035 implements MigrationInterface {
    name = ' FirstMigration1695201489035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "news_detail" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "content" character varying NOT NULL, "lang" "public"."language_enum_type" NOT NULL, "description" character varying NOT NULL, "news_id" integer NOT NULL, CONSTRAINT "PK_004a28c65b266612f464025dc49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_to_file" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "news_id" integer NOT NULL, "thumbnail_id" integer NOT NULL, CONSTRAINT "REL_73288bfd75252609e644ce4daa" UNIQUE ("news_id"), CONSTRAINT "REL_4b69df844ab109e7b7153861e2" UNIQUE ("thumbnail_id"), CONSTRAINT "PK_52e277c19add31dad517967bd32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_12e5fdc6efb71c0bcab80e34b1" ON "news_to_file" ("news_id", "thumbnail_id") WHERE deleted_at is null`);
        await queryRunner.query(`CREATE TABLE "subject_detail" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "name" character varying NOT NULL, "lang" "public"."language_enum_type" NOT NULL, "subject_id" integer NOT NULL, CONSTRAINT "PK_f442b5755f903388ff450af217a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_aeb51797f3022d605ded1b2255" ON "subject_detail" ("lang", "subject_id") WHERE deleted_at is null`);
        await queryRunner.query(`CREATE TABLE "subject" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "owner_id" integer NOT NULL, "priority" integer, CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news_to_subject" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "news_id" integer NOT NULL, "subject_id" integer NOT NULL, CONSTRAINT "PK_f3ff441b5430e50f3130a697972" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74bafbd823d883e4e320d5dbf6" ON "news_to_subject" ("news_id", "subject_id") WHERE deleted_at is null`);
        await queryRunner.query(`CREATE TABLE "news" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "title" character varying NOT NULL, "status" "public"."news_status_enum" NOT NULL, "owner_id" integer NOT NULL, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_group" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "status" "public"."user_group_status_enum" NOT NULL, "owner_id" integer NOT NULL, CONSTRAINT "PK_3c29fba6fe013ec8724378ce7c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_group_to_user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "user_group_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_6bc4df4c713b40ef597a440a998" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "type" "public"."user_type_enum" NOT NULL DEFAULT 'MERCHANT', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "key" character varying, "url" character varying, "type" character varying NOT NULL, "size" integer NOT NULL DEFAULT '0', "uploader_id" integer NOT NULL, CONSTRAINT "CHECK_ONE_OF_KEY_OR_URL" CHECK (
  (
    COALESCE((key IS NOT NULL)::INTEGER, 0)
    +
    COALESCE((url IS NOT NULL)::INTEGER, 0)
  ) = 1
  ), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d2df77c0cbda74ee650020d9e1" ON "file" ("key") WHERE deleted_at is null`);
        await queryRunner.query(`CREATE TABLE "admin" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "status" "public"."admin_status_enum" NOT NULL, "name" character varying(255), "avatar_id" integer, "user_id" integer NOT NULL, CONSTRAINT "REL_a28028ba709cd7e5053a86857b" UNIQUE ("user_id"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f4479daa1fb7d34d73c233283f" ON "admin" ("username") WHERE deleted_at is null`);
        await queryRunner.query(`ALTER TABLE "news_detail" ADD CONSTRAINT "FK_25c6cc40f2a21b71d2c4fd82c84" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_to_file" ADD CONSTRAINT "FK_73288bfd75252609e644ce4daa0" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_to_file" ADD CONSTRAINT "FK_4b69df844ab109e7b7153861e20" FOREIGN KEY ("thumbnail_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject_detail" ADD CONSTRAINT "FK_7e1a822069ce3ea41323a5e7d69" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subject" ADD CONSTRAINT "FK_83661e1501966257f3531df778e" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_to_subject" ADD CONSTRAINT "FK_69963a60443a8b2d58e1dd66a09" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news_to_subject" ADD CONSTRAINT "FK_5bdb8135595c16b645ed6ac7141" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_f2f642257084b8c00e0c270f5e6" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_6bb70cc21e35d14030333bab01d" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group_to_user" ADD CONSTRAINT "FK_69eabfdfcaddeb57e771ea143f0" FOREIGN KEY ("user_group_id") REFERENCES "user_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group_to_user" ADD CONSTRAINT "FK_70b533d58b6b3e76d2854129c4f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_96519432f789c1624978f27ffca" FOREIGN KEY ("uploader_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "FK_213dd05fe778dd87d6797bad13a" FOREIGN KEY ("avatar_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "FK_a28028ba709cd7e5053a86857b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "FK_a28028ba709cd7e5053a86857b4"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "FK_213dd05fe778dd87d6797bad13a"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_96519432f789c1624978f27ffca"`);
        await queryRunner.query(`ALTER TABLE "user_group_to_user" DROP CONSTRAINT "FK_70b533d58b6b3e76d2854129c4f"`);
        await queryRunner.query(`ALTER TABLE "user_group_to_user" DROP CONSTRAINT "FK_69eabfdfcaddeb57e771ea143f0"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_6bb70cc21e35d14030333bab01d"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_f2f642257084b8c00e0c270f5e6"`);
        await queryRunner.query(`ALTER TABLE "news_to_subject" DROP CONSTRAINT "FK_5bdb8135595c16b645ed6ac7141"`);
        await queryRunner.query(`ALTER TABLE "news_to_subject" DROP CONSTRAINT "FK_69963a60443a8b2d58e1dd66a09"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_83661e1501966257f3531df778e"`);
        await queryRunner.query(`ALTER TABLE "subject_detail" DROP CONSTRAINT "FK_7e1a822069ce3ea41323a5e7d69"`);
        await queryRunner.query(`ALTER TABLE "news_to_file" DROP CONSTRAINT "FK_4b69df844ab109e7b7153861e20"`);
        await queryRunner.query(`ALTER TABLE "news_to_file" DROP CONSTRAINT "FK_73288bfd75252609e644ce4daa0"`);
        await queryRunner.query(`ALTER TABLE "news_detail" DROP CONSTRAINT "FK_25c6cc40f2a21b71d2c4fd82c84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4479daa1fb7d34d73c233283f"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2df77c0cbda74ee650020d9e1"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_group_to_user"`);
        await queryRunner.query(`DROP TABLE "user_group"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74bafbd823d883e4e320d5dbf6"`);
        await queryRunner.query(`DROP TABLE "news_to_subject"`);
        await queryRunner.query(`DROP TABLE "subject"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aeb51797f3022d605ded1b2255"`);
        await queryRunner.query(`DROP TABLE "subject_detail"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12e5fdc6efb71c0bcab80e34b1"`);
        await queryRunner.query(`DROP TABLE "news_to_file"`);
        await queryRunner.query(`DROP TABLE "news_detail"`);
    }

}
