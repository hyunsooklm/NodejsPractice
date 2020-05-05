var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'kimhs1019@',//mysql -uroot -p 
  database : 'hyunsoo_db' //use some databases
});
 
connection.connect(function(err){
    if(err){
        console.error('error connecting: '+err.stack);
        return;
    }
    console.log('connected as id '+connection.threadId);
}); //연결
 
connection.query('SELECT * from topic', function (error, results, fields) { //query날리기 result에 결과값 나옴
  if (error) {
      console.log(error);
  }
  else{
    console.log('The solution is: ', results);

  }
});
 
connection.end();//exit