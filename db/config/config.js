import { config } from "dotenv";
config(); // Load environment variables from .env file
import process from "process";

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;

const dbConfig = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres", // Explicitly set dialect here
  },
  test: {
    // ...
  },
  production: {
    // ...
  },
};

export default dbConfig; // <-- Use "export default"
