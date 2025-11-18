// backend/src/knexfile.ts
import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    client: "pg",
    connection:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/app_db",
    migrations: {
      // since knexfile is now under src, migrations live in src/db/migrations
      directory: "./db/migrations",
    },
  },
};

export default config;
