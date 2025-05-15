import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
// Type-safe configuration with defaults
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postal',
    password: process.env.DB_PASSWORD || 'postal',
    database: process.env.DB_NAME || 'postal',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
// Connection test with async/await
const testConnection = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('✅ Connected to PostgreSQL database');
    }
    catch (err) {
        console.error('❌ Error connecting to database', err instanceof Error ? err.stack : err);
        process.exit(1);
    }
    finally {
        if (client)
            client.release();
    }
};
// Execute connection test immediately
testConnection();
// Event handlers
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
// Utility function for queries
export const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    }
    catch (err) {
        console.error('Query error', err instanceof Error ? err.message : err);
        throw err;
    }
};
export default pool;
