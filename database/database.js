const Pool = require("pg").Pool;
require("dotenv").config();
const connectionString = process.env.DB_URL;

// connect to database
//connect to local database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// connect to remote database
// const pool = new Pool({
//   connectionString,
// });

module.exports = pool;