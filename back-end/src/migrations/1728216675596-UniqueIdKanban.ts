import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueIdKanban1728216675596 implements MigrationInterface {
    name = 'UniqueIdKanban1728216675596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Kanbans" ADD "uniqueId" character varying(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Kanbans" ADD CONSTRAINT "UQ_cd84f87c63412c279c2ad67cc07" UNIQUE ("uniqueId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Kanbans" DROP CONSTRAINT "UQ_cd84f87c63412c279c2ad67cc07"`);
        await queryRunner.query(`ALTER TABLE "Kanbans" DROP COLUMN "uniqueId"`);
    }

}
