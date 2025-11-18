import knex from "knex";
import config from "../knexfile"; // two levels up from src/db -> backend/knexfile

const db = knex(config.development);
export default db;
