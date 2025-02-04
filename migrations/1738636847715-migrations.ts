import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1738636847715 implements MigrationInterface {
  name = 'Migrations1738636847715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_address_address" ON "addresses" ("address") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_api_key_key" ON "api_keys" ("key") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_merchant_address" ON "merchants" ("address") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."uq_merchant_address"`);
    await queryRunner.query(`DROP INDEX "public"."uq_api_key_key"`);
    await queryRunner.query(`DROP INDEX "public"."uq_address_address"`);
  }
}
