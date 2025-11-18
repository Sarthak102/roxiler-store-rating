import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/db/migrations",
    },
  },
};

export default config;
