import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1738643102926 implements MigrationInterface {
  name = 'Migrations1738643102926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "serviceFee" TO "service_fee"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "service_fee" TO "serviceFee"`,
    );
  }
}
