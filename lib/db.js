const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  database: 'quickmetdb'
});

connection.connect((err) => {
    // in case of error
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
    console.log("connected");
});

module.exports = connection;