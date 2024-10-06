import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKanbanAndTaskRelation1728211982231 implements MigrationInterface {
    name = 'AddKanbanAndTaskRelation1728211982231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Kanbans" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_c2bae7aae081a52c0f84ee4a413" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Tasks" ADD "kanbanId" integer`);
        await queryRunner.query(`ALTER TABLE "Tasks" ADD CONSTRAINT "FK_e3a3659d3f738709fc84fce762f" FOREIGN KEY ("kanbanId") REFERENCES "Kanbans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" DROP CONSTRAINT "FK_e3a3659d3f738709fc84fce762f"`);
        await queryRunner.query(`ALTER TABLE "Tasks" DROP COLUMN "kanbanId"`);
        await queryRunner.query(`DROP TABLE "Kanbans"`);
    }

}
