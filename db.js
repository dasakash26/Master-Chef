import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DB_STR;

const db = new pg.Client({
  connectionString: connectionString,
});

export default db;
