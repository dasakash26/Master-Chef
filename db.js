import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = 'postgres://avnadmin:AVNS_3V9J9tjyrSYN4kEcqV7@pg-1e47dd16-masterchef.c.aivencloud.com:20585/defaultdb?sslmode=require';

const db = new pg.Client({
  connectionString: connectionString,
});

export default db;
