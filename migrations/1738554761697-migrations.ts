import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1738554761697 implements MigrationInterface {
  name = 'Migrations1738554761697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "keys" jsonb NOT NULL, "metadata" character varying NOT NULL DEFAULT '', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "merchant_id" uuid, CONSTRAINT "pk_address_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, "merchant_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "pk_api_key_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(78,9) NOT NULL DEFAULT '0', "hash" character varying NOT NULL, "metadata" character varying NOT NULL DEFAULT '', "merchant_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "pk_transaction_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_transaction_hash" ON "transactions" ("hash") `,
    );
    await queryRunner.query(
      `CREATE TABLE "merchants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "webhook_url" character varying, "address" character varying NOT NULL, "keys" jsonb NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "pk_merchant_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "pk_user_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_user_username" ON "users" ("username") `,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_965deed28e14b779c27b67a8750" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_keys" ADD CONSTRAINT "FK_8261f83ab065c7bb551dd3f375a" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e80829a78860eadca0d60c8e21f" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "merchants" ADD CONSTRAINT "FK_698f612a3134c503f711479a4e5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchants" DROP CONSTRAINT "FK_698f612a3134c503f711479a4e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e80829a78860eadca0d60c8e21f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_keys" DROP CONSTRAINT "FK_8261f83ab065c7bb551dd3f375a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_965deed28e14b779c27b67a8750"`,
    );
    await queryRunner.query(`DROP INDEX "public"."uq_user_username"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "merchants"`);
    await queryRunner.query(`DROP INDEX "public"."uq_transaction_hash"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "api_keys"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
  }
}
