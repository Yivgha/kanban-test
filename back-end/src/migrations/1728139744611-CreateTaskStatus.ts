import { MigrationInterface, QueryRunner } from "typeorm";
import { TaskStatus } from '../enums/TaskStatus.enum';

export class CreateTaskStatus1728139744611 implements MigrationInterface {
    name = 'CreateTaskStatus1728139744611';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."TaskStatuses_name_enum" AS ENUM('To Do', 'In Progress', 'Done')
        `);
        
        await queryRunner.query(`
            CREATE TABLE "TaskStatuses" (
                "id" SERIAL NOT NULL,
                "name" "public"."TaskStatuses_name_enum" NOT NULL,
                CONSTRAINT "UQ_07e4e924c438286a21c83a7b46a" UNIQUE ("name"),
                CONSTRAINT "PK_e626e5355eba12320d43005390d" PRIMARY KEY ("id")
            )
        `);

        // Populate table with values from the TaskStatus enum
        const enumValues = Object.values(TaskStatus).map(status => `('${status}')`).join(',');
        await queryRunner.query(`
            INSERT INTO "TaskStatuses" ("name")
            VALUES ${enumValues}
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "TaskStatuses"`);
        await queryRunner.query(`DROP TYPE "public"."TaskStatuses_name_enum"`);
    }
}
