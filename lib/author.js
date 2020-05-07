var db = require('./DB_Template');
var Template = require('./Template');
var qs = require('querystring');
var url = require('url');
var sanitize_html=require('sanitize-html');
exports.home = function (request, response) {
  var resultlist = [];
  db.query('SELECT * FROM TOPIC', function (err1, result) {//db client에서 db server에 쿼리날리기 
    if (err1) {//error발생시
      console.log(err.stack);
    }
    else {
      db.query('SELECT * FROM AUTHOR', function (err2, author) {
        if (err2) {
          throw err2;
        }
        var list = Template.List(result, resultlist);
        var title = 'Author';
        var body = Template.Author_Template(author);
        body += `
          <form action="/author_create" name="author_info" method="POST">
            <p><input type="text" name="name" placeholder="name" required/></p>
            <p><textarea name="profile" placeholder="profile"></textarea></p>
            <p><input type="submit" value="생성"></p>
          </form>
        `
        var html = Template.HTML(title, list, `<h2>${title}</h2>${body}`, ``);
        response.writeHead(200);
        response.end(html);
      });
    }
  });
}
exports.create = function (request, response) {
  var post = {};
  if (request.method == "POST") {
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      post = qs.parse(body);
      db.query(`INSERT INTO AUTHOR(name,profile)VALUE(?,?);`, [sanitize_html(post.name), sanitize_html(post.profile)], function (err, result) {
        if (err) {
          throw err;
        }
        else {
          response.writeHead(302, {         //3.xx로 시작된 코드는 Redirection을 의미한다. 
            'Location': `/author`
            //add other headers here...
          });
          response.end();
        }
      });
    });

  }
}
exports.update = function (request, response) {
  var resultlist = [];
  var _url = request.url;
  var queryData = url.parse(_url, true).query;    //querystring 따는법
  db.query('SELECT * FROM TOPIC', function (err1, result) {//db client에서 db server에 쿼리날리기 
    if (err1) {//error발생시
      console.log(err.stack);
    }
    else {
      db.query('SELECT * FROM AUTHOR', function (err2, author_list) {
        if (err2) {
          throw err2;
        }
        db.query('SELECT * FROM AUTHOR WHERE ID=?', [queryData.id], function (err3, author) {
          if (err3) {
            throw err3;
          }
          var list = Template.List(result, resultlist);
          var title = 'Author';
          var body = Template.Author_Template(author_list);
          var origin_name = author[0].name;
          var origin_profile = author[0].profile
          body += `
          <form action="/author_update_process" name="author_info" method="POST">
            <p><input type="text" name="name" value=${origin_name}></p>
            <p><textarea name="profile">${origin_profile}</textarea></p>
            <p><input type="hidden" name="author_id" value=${queryData.id}></p>
            <p><input type="submit" value="수정"></p>
          </form>
        `
          var html = Template.HTML(title, list, `<h2>${title}</h2>${body}`, ``);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  });
}
exports.update_process = function (request, response) {
  var post = {};
  if (request.method == "POST") {
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      post = qs.parse(body);
      console.log(post);
      db.query('UPDATE AUTHOR SET NAME=?,PROFILE=? WHERE ID=?;', [sanitize_html(post.name), sanitize_html(post.profile), sanitize_html(post.author_id)], function (err, data) {
        if (err) {
          throw err;
        }
        response.writeHead(302, {
          'Location': '/author'
        });
        response.end();
      });
    })
  }
}
exports.delete_process = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true);
  var post = {};
  if (request.method == "POST") {
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      post = qs.parse(body);
      console.log(post);
      db.query('DELETE FROM AUTHOR WHERE ID=?', [sanitize_html(post.author_id)], function (err1, result) {
        if (err1) {
          throw err1;
        }
        else {
          db.query('DELETE FROM TOPIC WHERE TOPIC.AUTHOR_ID=?', [sanitize_html(post.author_id)], function (err2, result2) {
            if (err2) {
              throw err2;
            }
            else {
              response.writeHead(302, {
                'Location': '/'
              });
              response.end("succcess");

            }
          })

        }


      })
    });
  }
}
