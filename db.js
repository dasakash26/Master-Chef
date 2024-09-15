import pg from 'pg';

// Hardcoded connection string
const connectionString = 'postgres://postgres:mysceretpassword@localhost:5432/postgres';

const db = new pg.Client({
  connectionString: connectionString,
});

export default db;
