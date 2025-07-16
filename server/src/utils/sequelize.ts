import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'database',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: (process.env.DB_PORT as unknown as number) || 5432,
    database: process.env.DB_NAME || 'myapp',
  }
);
const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      'Connection to the database has been established successfully.'
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
export { connect };
