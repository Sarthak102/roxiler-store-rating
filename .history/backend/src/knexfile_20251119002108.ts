import dotenv from "dotenv";
dotenv.config();

const common = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./src/db/migrations",
  },
};

module.exports = {
  development: common,
  production: common,
};