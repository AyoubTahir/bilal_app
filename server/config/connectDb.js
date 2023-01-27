import pg from 'pg';

export const pool = new pg.Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
});
