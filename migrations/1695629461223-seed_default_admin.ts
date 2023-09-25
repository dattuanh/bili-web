import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedDefaultAdmin1695629461223 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public."user" (id,"type") VALUES(10,'ADMIN')`);
        await queryRunner.query(`INSERT INTO "admin" ("name", username, "password", user_id, status)
        VALUES ('admin', 'admin', '$2a$12$EPbQqNvqgUgsR1.b8Jx87eibuoYQmomUnDvJBXxACY28c/nzy76.6', 10, 'ACTIVE')`)

        await queryRunner.query(`SELECT setval('user_id_seq', (SELECT max(id) FROM "user" u), true)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}