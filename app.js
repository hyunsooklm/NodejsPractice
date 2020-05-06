// 괄호 짝찾을땐 ctrl+shift+\
// 자바스크립트 매개변수에 원시형-> 다른 주소 객체,배열형 -> 같은주소 값을 넘긴다.
var http = require('http');
var url = require('url');
var qs = require('querystring');
var Template = require('./lib/Template.js');
var isEmpty = require('./lib/Empty.js');
var sanitizehtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'kimhs1019@',
  database: 'hyunsoo_db'
});
db.connect(function (err) {
  if (err) {
    console.error('error connectiong' + err.stack);
    return;
  }
})

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;    //querystring 따는법
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;
  var html = "";
  var description = "";
  var resultlist = [];
  var body = '';
  if (pathname === '/') {
    if (queryData.id == undefined) {
      var path = url.parse(_url, true).path;
      if (path != '/') {
        response.writeHead(404);
        response.end('Not found!');
      }
      db.query('SELECT * FROM TOPIC', function (err, result) {//db client에서 db server에 쿼리날리기 
        if (err) {//error발생시
          console.log(err.stack);
        }
        else {
          var list = Template.List(result, resultlist);
          title = 'Node js';
          description = "Hello Node js!";
          body += `<p>${description}</p>`;
          html = Template.HTML(title, list, body, '');
          response.writeHead(200);
          response.end(html);
        }
      })

    }//홈으로 드렁왔다면
    else {//id값으로 들어왔다면
      db.query('SELECT * FROM TOPIC', function (err1, result) {//db client에서 db server에 쿼리날리기 
        if (err1) {//error발생시
          throw err1;
        }
        else {
          var list = Template.List(result, resultlist);
          if (resultlist.indexOf(queryData.id) == -1) {    //querystring이 없는값으로 들어오면
            response.writeHead(404);
            response.end('Not found');
          }//id값이 이상한 곳으로 들어오면
          else {
            db.query('SELECT * FROM TOPIC LEFT JOIN AUTHOR ON TOPIC.AUTHOR_ID=AUTHOR.ID WHERE TOPIC.ID=?', [queryData.id], function (err2, topic) {
              if (err2) {
                throw err2;
              }
              title = topic[0].title;
              description = topic[0].description;
              body += `<p>${description}</p>`;
              body += `<p>by ${topic[0].name}...</p>`;

              var control = `
              <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="POST">
            <input type="hidden" name="id" value="${queryData.id}">
            <h2><input type="submit" value="delete" onsubmit="alert('delete?')"/></h2>
            </form>
            `
              html = Template.HTML(title, list, body, control);
              response.writeHead(200);
              response.end(html);
            })         //id값이 db에 존재하는 title값으로 들어온다면,
          }
        }
      });
    }
  }
  else if (pathname === "/create") {
    db.query('SELECT * FROM AUTHOR', function (err1, result1) {  //author테이블을 가져오자
      if (err1) {
        throw err1;
      }
      else {
        var option = Template.NameOption(result1, '');
        body = `<form action="http://localhost:8088/create_process" method="POST" >
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
      ${option}
      <p>
        <input type="submit">
      </p>
    </form>`;
        db.query('SELECT * FROM TOPIC', function (err2, result2) {//db client에서 db server에 쿼리날리기 
          if (err2) {//error발생시
            throw err2;
          }
          else {
            var list = Template.List(result2, resultlist);
            title = 'WEB-create';
            html = Template.HTML(title, list, body, '');
            response.writeHead(200);
            response.end(html);
          }
        });
      }
    });
  }
  else if (pathname === "/create_process") { //post방식으로 전송된 데이터 받기.
    var post = {};
    if (request.method == "POST") {
      var body = "";
      request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        post = qs.parse(body);
        console.log(post);
        var title = post.title;
        var description = post.description;
        var author_id=post.author_id;
        db.query(`INSERT INTO TOPIC
        (title,description,created,author_id) 
        VALUE(?,?,now(),?)`, [title, description,author_id], function (err, result) {
          if (err) {
            throw err;
          }
          else {
            response.writeHead(302, {         //3.xx로 시작된 코드는 Redirection을 의미한다. 
              'Location': `/?id=${result.insertId}`
              //add other headers here...
            });
            response.end();
          }
        });

      });

    }
  }
  else if (pathname === "/update") {
    db.query('SELECT * FROM TOPIC', function (err1, result1) {//db client에서 db server에 쿼리날리기 
      if (err1) {//error발생시
        throw err1;
      }
      else {
        db.query('SELECT * FROM AUTHOR', function (err2, result2) {  //author테이블을 가져오자
          if (err2) {
            throw err2;
          }
          else {
            db.query(`SELECT * FROM TOPIC WHERE ID=?`, [queryData.id], function (err3, data) {
              if (err3) {
                throw err3;
              }
              var option = Template.NameOption(result2, data[0].author_id);
              var body = `<form action="/update_process" method="POST" >
            <input type="hidden" name="object" value="${data[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${data[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${data[0].description}</textarea>
            </p>
            <p>
            ${option}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`;
              var list = Template.List(result1, resultlist);
              var control = `
              <a href="/create">create</a>
              <a href=/update?id=${queryData.id}>update</a>`;
              title = 'WEB-update';
              html = Template.HTML(title, list, body, control);
              response.writeHead(200);
              response.end(html);
            });
          }
        });
      }
    });
  }
  else if (pathname === "/update_process") {   //파일 수정
    var post = {};
    if (request.method == "POST") {
      var body = "";
      request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        post = qs.parse(body);
        console.log(post);
        db.query('UPDATE TOPIC SET title=?,description=?,author_id=? WHERE ID=?', [post.title, post.description, post.author_id, post.object], function (err, result) {
          if (err) {
            throw err;
          }
          else {
            response.writeHead(302, {         //3.xx로 시작된 코드는 Redirection을 의미한다. 
              'Location': `/?id=${post.object}`
              //add other headers here...
            });
            response.end('success');
          }
        })
      })
    }
  }
  else if (pathname === "/delete_process") {
    var post = {};
    if (request.method == "POST") {
      var body = "";
      request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        post = qs.parse(body);
        console.log(post);
        db.query('DELETE FROM TOPIC WHERE id=?', [post.id], function (err, result) {
          if (err) {
            throw err;
          }
          else {
            console.log('delete success!');
            response.writeHead(302, { 'Location': '/' });
            response.end();
          }
        })
      })
    }
  }
  else {//pathname이 /이 아닌경우
    response.writeHead(404);
    response.end('Not found');
  }
});


app.listen(8088);