import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name", 60).notNullable();
    table.string("email").notNullable().unique();
    table.text("password_hash").notNullable();
    table.string("address", 400);
    table
      .enu("role", ["admin", "user", "store_owner"])
      .notNullable()
      .defaultTo("user");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("stores", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name", 200).notNullable();
    table.string("email");
    table.string("address", 400);
    table
      .uuid("owner_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("ratings", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("store_id")
      .notNullable()
      .references("id")
      .inTable("stores")
      .onDelete("CASCADE");
    table.smallint("rating").notNullable();
    table.text("comment");
    table.timestamps(true, true);
    table.unique(["user_id", "store_id"]);
  });

  await knex.raw(`
    ALTER TABLE ratings
    ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5);
  `);

  await knex.schema.table("stores", (t) => t.index(["name"]));
  await knex.schema.table("ratings", (t) => t.index(["store_id"]));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("ratings");
  await knex.schema.dropTableIfExists("stores");
  await knex.schema.dropTableIfExists("users");
}
