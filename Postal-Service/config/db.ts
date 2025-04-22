import * as pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config(); // get the environment variables (.env)

const { Pool } = pg;

// Type-safe config
const pool = new Pool({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432, // <-- convert to number with fallback
});

// test the connection
pool.connect((err, client, release) => { 
    if (err) { 
       return console.error('Error acquiring client', err.stack); 
    } 
    console.log('Connected to PostgreSQL database'); 
    release();
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
