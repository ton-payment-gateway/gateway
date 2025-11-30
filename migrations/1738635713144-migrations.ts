import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1738635713144 implements MigrationInterface {
  name = 'Migrations1738635713144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "serviceFee" numeric(78,9) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_965deed28e14b779c27b67a8750"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ALTER COLUMN "merchant_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_965deed28e14b779c27b67a8750" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_965deed28e14b779c27b67a8750"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ALTER COLUMN "merchant_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_965deed28e14b779c27b67a8750" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "serviceFee"`,
    );
  }
}
