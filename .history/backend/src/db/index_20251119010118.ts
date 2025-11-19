import knex, { Knex } from "knex";

const allConfigs = require("../../knexfile") as {
  [env: string]: Knex.Config;
};

const env = process.env.NODE_ENV || "development";
const knexConfig = allConfigs[env];

if (!knexConfig) {
  throw new Error(`Knex config for env "${env}" not found in knexfile.js`);
}

const db = knex(knexConfig);

export default db;
