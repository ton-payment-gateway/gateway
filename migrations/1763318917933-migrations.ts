import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1763318917933 implements MigrationInterface {
  name = 'Migrations1763318917933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "status" character varying NOT NULL DEFAULT 'COMPLETED'`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "confirmation_time" integer NOT NULL DEFAULT '100'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "confirmation_time"`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`);
  }
}
