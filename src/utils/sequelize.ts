import { Sequelize } from "sequelize";
import { Logger } from "@/utils";

const sequelize = new Sequelize(
  process.env.DB_NAME || "database",
  process.env.DB_USER || "user",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: (process.env.DB_PORT as unknown as number) || 5432,
    database: process.env.DB_NAME || "myapp",
  },
);
const connect = async () => {
  Logger.info(
    `Database connection: ${process.env.DB_HOST || "localhost"}://${process.env.DB_USER || "user"}:${process.env.DB_PASSWORD || "password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "database"}`,
  );

  try {
    await sequelize.authenticate();
    Logger.success("Connected to database successfully");
  } catch (error) {
    Logger.error("Error connecting to the database", error);
  }
};

export default sequelize;
export { connect };
