// 괄호 짝찾을땐 ctrl+shift+\
// 자바스크립트 매개변수에 원시형-> 다른 주소 객체,배열형 -> 같은주소 값을 넘긴다.
var http = require('http');
var fs = require('fs');
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
            db.query(`SELECT * FROM TOPIC WHERE ID=?`,[queryData.id], function (err2, topic) {
              if (err2) {
                throw err2;
              }
              title = topic[0].title;
              description = topic[0].description;
              body += `<p>${description}</p>`;
              var control = `
              <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="POST">
            <input type="hidden" name="object" value="${queryData.id}">
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
    // fs.readdir('./contents', function (err, filelist) {
    //   if (resultlist.indexOf(queryData.id) == -1) {    //querystring이 없는값으로 들어오면
    //     response.writeHead(404);
    //     response.end('Not found');
    //   } //id값이 이상한 곳으로 들어오면

    //   else {  //id값이 있는 애들쪽으로 들어온다면
    //     fs.readFile(`contents/${title}`, 'utf8', function (err, description) {
    //       var sanitize_title = sanitizehtml(title);
    //       var sanitize_description = sanitizehtml(description, { allowedTags: ['a', 'h1'] });

    //       if (err) throw err;
    //       body += `<p>${sanitize_description}</p>`;
    //       var control = `
    //       <a href="/update?id=${sanitize_title}">update</a>
    //       <form action="delete_process" method="POST">
    //       <input type="hidden" name="object" value="${sanitize_title}">
    //       <input type="submit" value="delete" onsubmit="alert('delete?')"/>
    //       </form>
    //       `
    //       html = Template.HTML(sanitize_title, list, body, control);
    //       response.writeHead(200);
    //       response.end(html);
    //     }
    //     );
    //   }
  }
  else if (pathname === "/create") {
    body = `<form action="http://localhost:8088/create_process" method="POST" >
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>`;
    fs.readdir('./contents', function (err, filelist) {
      var list = Template.List(filelist, resultlist);
      title = 'WEB-create';
      html = Template.HTML(title, list, body, '');
      response.writeHead(200);
      response.end(html);
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
        var title = post.title;
        var description = post.description;
        // var sanitize_title=sanitizehtml(title);
        // var sanitize_description=sanitizehtml(description);
        fs.writeFile(`./contents/${title}`, description, 'utf8', function (err) {
          if (err) throw err;
          console.log("file write success");
          response.writeHead(302, {         //3.xx로 시작된 코드는 Redirection을 의미한다. 
            'Location': `/?id=${title}`
            //add other headers here...
          });
          response.end('success');
        })
      });

    }
  }
  else if (pathname === "/update") {
    fs.readdir('./contents', function (err, filelist) {
      fs.readFile(`contents/${title}`, 'utf8', function (err, description) {
        var body = `<form action="/update_process" method="POST" >
      <input type="hidden" name="object" value="${title}">
      <p><input type="text" name="title" placeholder="title" value="${title}"></p>
      <p>
        <textarea name="description" placeholder="description">${description}</textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>`;

        var list = Template.List(filelist, resultlist);
        var control = `
        <a href="/create">create</a>
        <a href=/update?id=${queryData.id}>update</a>`
        title = 'WEB-update';
        html = Template.HTML(title, list, body, control);
        response.writeHead(200);
        response.end(html);
      });

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
        title = post.title; //변경된 title
        description = post.description; //변경된 내용
        var object = post.object; //원본 파일
        fs.rename(`./contents/${object}`, `./contents/${title}`, function (err) {
          if (err) {
            console.log(`error:${err}`);
          }
          console.log('rename success');
          fs.writeFile(`./contents/${title}`, description, 'utf8', function (err) {
            if (err) throw err;
            response.writeHead(302, {         //3.xx로 시작된 코드는 Redirection을 의미한다. 
              'Location': `/?id=${title}`
              //add other headers here...
            });
            response.end('success');
          })
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
        var object = post.object; //이녀석을 삭제하면 된다.
        fs.unlink(`./contents/${object}`, function (err) {
          if (err) {
            console.log(`delete error:${err}`);
          }
          console.log('delete success!');
          response.writeHead(302, { 'Location': '/' });
          response.end();
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