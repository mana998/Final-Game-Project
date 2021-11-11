require('dotenv').config();
const mysql = require('mysql');

var connection;

function handleDisconnection() {
    connection = mysql.createConnection({
        host     : process.env.HOST,
        database : process.env.DATABASE,
        user     : process.env.USER,
        password : process.env.PASSWORD
    })

    connection.connect(function(err) {              
        if(err) {                                     
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnection, 2000); 
        }                                     
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnection();                         
        } else {                                      
          throw err;                                  
        }
    });
}

handleDisconnection();

module.exports = {
    connection
}