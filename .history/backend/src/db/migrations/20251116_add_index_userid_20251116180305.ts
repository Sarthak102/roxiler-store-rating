import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("ratings", (t) => {
    t.index(["user_id"], "ratings_user_id_idx");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("ratings", (t) => {
    t.dropIndex(["user_id"], "ratings_user_id_idx");
  });
}
