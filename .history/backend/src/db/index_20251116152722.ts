import knex from "knex";
import config from "";

const db = knex(config.development);

export default db;
