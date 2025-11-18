import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("audit_logs", (t) => {
    t.bigIncrements("id").primary();
    t.uuid("actor_id").nullable().references("id").inTable("users").onDelete("SET NULL");
    t.string("action").notNullable();
    t.jsonb("details").nullable();
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("audit_logs");
}