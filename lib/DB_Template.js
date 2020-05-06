var mysql = require('mysql');

var DB = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  DB.connect(function (err) {
    if (err) {
      console.error('error connectiong' + err.stack);
      return;
    }
  })
  module.exports=DB;