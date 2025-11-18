// backend/knexfile.js
require("ts-node/register"); // <-- enable TS support for migrations
require("dotenv").config();

const common = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./src/db/migrations",
    extension: "ts", 
  },
};

module.exports = {
  development: common,
  production: common,
};
