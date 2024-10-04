import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatus1728063668043 implements MigrationInterface {
    name = 'AddStatus1728063668043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."Tasks_status_enum" AS ENUM('To Do', 'In Progress', 'Done')
        `);
        await queryRunner.query(`
            ALTER TABLE "Tasks"
            ADD "status" "public"."Tasks_status_enum" NOT NULL DEFAULT 'To Do'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Tasks" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."Tasks_status_enum"
        `);
    }

}
