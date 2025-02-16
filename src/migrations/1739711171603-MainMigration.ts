import { MigrationInterface, QueryRunner } from "typeorm";

export class MainMigration1739711171603 implements MigrationInterface {
    name = 'MainMigration1739711171603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."books_availability_enum" AS ENUM('AVAILABLE', 'BORROWED')`);
        await queryRunner.query(`CREATE TABLE "books" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "availability" "public"."books_availability_enum" NOT NULL DEFAULT 'AVAILABLE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_borrows" ("id" SERIAL NOT NULL, "borrowDate" TIMESTAMP NOT NULL DEFAULT now(), "returnDate" TIMESTAMP, "score" integer, "userId" integer, "bookId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_5179bcb0a1c1171a4b8ea20e74d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "book_borrows" ADD CONSTRAINT "FK_9575210a830051b5b63cddc82cd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_borrows" ADD CONSTRAINT "FK_0a1d02c6ce459008cf382ce660f" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_borrows" DROP CONSTRAINT "FK_0a1d02c6ce459008cf382ce660f"`);
        await queryRunner.query(`ALTER TABLE "book_borrows" DROP CONSTRAINT "FK_9575210a830051b5b63cddc82cd"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "book_borrows"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TYPE "public"."books_availability_enum"`);
    }

}
