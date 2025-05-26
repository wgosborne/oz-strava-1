import sql from 'mssql';

const config = {
  user: process.env.DB_USER,  
  password: process.env.DB_PASSWORD, 
  server: process.env.DB_SERVER,    
  database: process.env.DB_NAME, 
  options: {
    trustServerCertificate: true, // for local dev
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool: sql.ConnectionPool;

export async function getDb() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}