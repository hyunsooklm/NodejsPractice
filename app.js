// 괄호 짝찾을땐 ctrl+shift+\
// 자바스크립트 매개변수에 원시형-> 다른 주소 객체,배열형 -> 같은주소 값을 넘긴다.
var http = require('http');
var url = require('url');
var topic=require('./lib/topic.js');
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;    //querystring 따는법
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id == undefined) {
      var path = url.parse(_url, true).path;
      if (path != '/') {
        response.writeHead(404);
        response.end('Not found!');
      }
      topic.home(request,response);
    }//홈으로 드렁왔다면
    else {//id값으로 들어왔다면
      topic.page(request,response);
    }
  }
  else if (pathname === "/create") {
    topic.create(request,response);
  }
  else if (pathname === "/create_process") { //post방식으로 전송된 데이터 받기.
    topic.create_process(request,response);
  }
  else if (pathname === "/update") {
    topic.update(request,response);
  }
  else if (pathname === "/update_process") {   //파일 수정
    topic.update_process(request,response);
  }
  else if (pathname === "/delete_process") {
    topic.delete_process(request,response);
  }
  else {//pathname이 /이 아닌경우
    response.writeHead(404);
    response.end('Not found');
  }
});


app.listen(8088);