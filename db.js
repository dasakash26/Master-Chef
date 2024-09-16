import pg from 'pg';

// Hardcoded connection string
const connectionString = 'postgres://avnadmin:AVNS_Y7LTOMp5Bbd2E_33lee@pg-bfa34db-somnathchattaraj5-679d.a.aivencloud.com:26339/defaultdb?sslmode=require';

const db = new pg.Client({
  connectionString: connectionString,
});

export default db;
