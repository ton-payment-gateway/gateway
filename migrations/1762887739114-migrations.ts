import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1762887739114 implements MigrationInterface {
    name = 'Migrations1762887739114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "is_direct_deposit" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "is_direct_deposit"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country"`);
    }

}
