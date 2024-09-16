import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const str = process.env.DB_STR;

const db = new pg.Client({
  connectionString: str,
});

export default db;
