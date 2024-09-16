import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_STR;
console.log(connectionString);

const db = new pg.Client({
  connectionString: connectionString,
});

export default db;
