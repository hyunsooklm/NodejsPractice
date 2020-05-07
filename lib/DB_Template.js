var mysql = require('mysql');

var DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kimhs1019@',
    database: 'hyunsoo_db'
  });
  DB.connect(function (err) {
    if (err) {
      console.error('error connectiong' + err.stack);
      return;
    }
  })
  module.exports=DB;