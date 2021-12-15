// Dagmara
require('dotenv').config();
const mysql = require('mysql2');

const pool  = mysql.createPool({
  connectionLimit : 5,
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

module.exports = {
  pool,
};
