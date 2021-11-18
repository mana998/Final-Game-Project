// Dagmara
require('dotenv').config();
const mysql = require('mysql');

let connection;

function handleDbConnection() {
  connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
  });

  connection.connect(
    (error) => {
      if (error) {
        console.log('There is an error when connecting to database:', error);
        setTimeout(handleDbConnection, 3000);
      }
    },
  );

  connection.on(
    'error',
    (error) => {
      console.log('databse error occured', error);
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDbConnection();
      } else {
        throw error;
      }
    },
  );
}

handleDbConnection();

module.exports = {
  connection,
};
