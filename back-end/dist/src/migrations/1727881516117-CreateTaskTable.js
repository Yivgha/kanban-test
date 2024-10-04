"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskTable1727881516117 = void 0;
class CreateTaskTable1727881516117 {
    constructor() {
        this.name = 'CreateTaskTable1727881516117';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "Tasks" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "Tasks"`);
    }
}
exports.CreateTaskTable1727881516117 = CreateTaskTable1727881516117;
