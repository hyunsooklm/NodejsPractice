var db = require('./DB_Template');
var Template = require('./Template');
var url = require('url');
var qs = require('querystring');
var body = '';
var resultlist = [];
var sanitize_html = require('sanitize-html');
exports.home = function (request, response) {
  db.query('SELECT * FROM TOPIC', function (err, result) {//db client에서 db server에 쿼리날리기 
    if (err) {//error발생시
      console.log(err.stack);
    }
    else {
      var list = Template.List(result, resultlist);
      var title = 'Node js';
      var description = "Hello Node js!";
      var html = Template.HTML(title, list, `<h2>${title}</h2>${description}`, `<h1><a href="/create">create</a></h1>`);
      response.writeHead(200);
      response.end(html);
    }
  })
}
exports.page = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;    //querystring 따는법
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
        var body = '';
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

exports.create = function (request, response) {
  db.query('SELECT * FROM AUTHOR', function (err1, result1) {  //author테이블을 가져오자
    if (err1) {
      throw err1;
    }
    else {

      var option = Template.NameOption(result1, '');
      body = `
      <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
      <script>
      $(document).ready(function(){
        $('input[type="submit"]').click(function(event){
          let name=$('#author_name option:checked').val();
          let title=$('#title').val();
          let description=$('#description').val();
          if(name===undefined){
            alert('작가먼저 생성하십시오.');
            event.preventDefault();
          }
          else if(title==""){
            alert('제목은 필수입니다.');
            event.preventDefault();
          }
        });
        })
      </script>
      <form action="http://localhost:8088/create_process" method="POST" id="frm" >
    <p><input type="text" id="title" name="title" placeholder="title"></p>
    <p>
      <textarea name="description" placeholder="description" id='description'></textarea>
    </p>
    <p>
    ${option}
    <p>
      <input type="submit" id="submit">
    </p>
  </form>
  `;
      db.query('SELECT * FROM TOPIC', function (err2, result2) {//db client에서 db server에 쿼리날리기 
        if (err2) {//error발생시
          throw err2;
        }
        else {
          var list = Template.List(result2, resultlist);
          var title = 'WEB-create';
          var html = Template.HTML(title, list, body, '');
          response.writeHead(200);
          response.end(html);
        }
      });
    }
  });
}
exports.create_process = function (request, response) {
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
      var author_id = post.author_id;
      db.query(`INSERT INTO TOPIC
      (title,description,created,author_id) VALUE(?,?,now(),?)`, [sanitize_html(title), sanitize_html(description), sanitize_html(author_id)], function (err, result) {
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
};
exports.update = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;    //querystring 따는법
  var query = db.query('SELECT * FROM TOPIC', function (err1, result1) {//db client에서 db server에 쿼리날리기 
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
            var body = `
            <form action="/update_process" method="POST" id="frm">
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
        </form>
        `;
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
      db.query('UPDATE TOPIC SET title=?,description=?,author_id=? WHERE ID=?', [sanitize_html(post.title), sanitize_html(post.description), sanitize_html(post.author_id), sanitize_html(post.object)], function (err, result) {
        if (err) {
          throw err;
        }
        else {
          response.writeHead(302, {         //3.xx로 시작된 코드는 Redirection을 의미한다. 
            'Location': `/?id=${sanitize_html(post.object)}`
            //add other headers here...
          });
          response.end('success');
        }
      });
    });
  }
}
exports.delete_process = function (request, response) {
  var post = {};
  if (request.method == "POST") {
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      post = qs.parse(body);
      console.log(post);
      db.query('DELETE FROM TOPIC WHERE id=?', [sanitize_html(post.id)], function (err, result) {
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