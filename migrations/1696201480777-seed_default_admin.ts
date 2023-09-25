import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedDefaultAdmin1696201480777 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public."user" (id,"type") VALUES(10,'ADMIN')`);
        await queryRunner.query(`INSERT INTO "admin" ("name", username, "password", user_id, status)
        VALUES ('admin', 'admin', '$2a$12$EPbQqNvqgUgsR1.b8Jx87eibuoYQmomUnDvJBXxACY28c/nzy76.6', 10, 'ACTIVE')`)
        // await queryRunner.query(`INSERT INTO "group_policy" (id, "key", "name", "description", status, "type", owner_id) VALUES (1, 'super_admin', 'Super Admin', 'This is super admin', 'ACTIVE', 'ADMIN', 10)`);
        // await queryRunner.query(`INSERT INTO "group_to_policy" ("policy_id", "group_policy_id")
        // SELECT id, 1 FROM "policy" p WHERE p."action" = 'manage' AND p.resource = 'all' AND action_ability = 'can';`)
        // await queryRunner.query(`INSERT INTO "user_to_group_policy" (user_id, group_policy_id) VALUES(10, 1);`)

        await queryRunner.query(`SELECT setval('user_id_seq', (SELECT max(id) FROM "user" u), true)`)
        // await queryRunner.query(`SELECT setval('group_policy_id_seq', (SELECT max(id) FROM "group_policy"), true)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}