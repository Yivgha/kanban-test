import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1727881516117 implements MigrationInterface {
  name = 'CreateTaskTable1727881516117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Tasks" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Tasks"`);
  }
}
