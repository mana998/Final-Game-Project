// Dagmara
require('dotenv').config();
const mysql = require('mysql2');

const pool  = mysql.createPool({
  connectionLimit : 10,
  /*host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,*/
  host: process.env.CLEARDB_DATABASE_URL
});

module.exports = {
  pool,
};
