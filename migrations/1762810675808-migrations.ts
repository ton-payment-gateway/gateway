import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1762810675808 implements MigrationInterface {
  name = 'Migrations1762810675808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "addresses"`);
    await queryRunner.query(`DELETE FROM "transactions"`);
    await queryRunner.query(`DELETE FROM "api_keys"`);
    await queryRunner.query(`DELETE FROM "merchants"`);
    await queryRunner.query(
      `ALTER TABLE "merchants" ADD "secret_key" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "secret_key"`);
  }
}
