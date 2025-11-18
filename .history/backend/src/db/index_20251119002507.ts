import knex from "knex";
import config from "../knexfile";
// backend/src/db/index.ts
import knex from "knex";
// Use require because knexfile uses module.exports
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require("../knexfile");

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];

const db = knex(config);

export default db;
const db = knex(config.development);
export default db;
