import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Add error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(-1);
  }
  console.log('Successfully connected to PostgreSQL');
  done();
});

export default pool; 