import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1738557155054 implements MigrationInterface {
  name = 'Migrations1738557155054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchants" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "deleted_at"`);
  }
}
