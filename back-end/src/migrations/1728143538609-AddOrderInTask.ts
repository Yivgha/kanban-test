import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderInTask1728143538609 implements MigrationInterface {
    name = 'AddOrderInTask1728143538609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Tasks"
            ADD "order" integer
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Tasks" DROP COLUMN "order"
        `);
    }

}
