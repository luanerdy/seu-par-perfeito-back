import pg from 'pg';
import { config } from 'dotenv';

config();
const { Pool } = pg;

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const connection = new Pool(
  process.env?.NODE_ENV === "development"
    ? {
        user: DB_USERNAME,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_DATABASE,
        password: DB_PASSWORD,
      }
    : {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
);

export default connection;
