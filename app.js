//post방식으로 넘어온 데이터를 body-Parser객체의 bodyparser.urlencoded({extended:false})로 하면 req객체에 body프로퍼티가 생긴다.
//body 프로퍼티엔 post방식으로 넘어온 데이터가 key-value객체형태로 존재한다.
//web-server가 web-browser에게 응답할때 데이터를 압축해서 보내준다.
const express = require('express')
const Template = require('./lib/Template');
const fs = require('fs');
const app = express()
const port = 3000
const sanitizehtml = require('sanitize-html');
const qs = require("querystring");
const bodyParser=require("body-parser");
var compression = require('compression')

let filelists = [];
app.use(bodyParser.urlencoded({ extended: false })) //app에 middleware를 장착한다. bodyParser.urlencoded({ extended: false })는 middleware를 반환한다.
app.use(compression());//Requests that pass through the middleware will be compressed.
//주어진 옵션을 사용하여 압축 미들웨어를 리턴합니다. 미들웨어는 주어진 옵션에 따라 미들웨어를 통과하는 모든 요청에 ​​대해 응답 본문을 압축하려고 시도합니다.
//req,res,next 순서지키기
app.get('*',(req,res,next)=>{//get방식을 들어온 모든 경로의 미들웨어장착
  let filelists=[];
  let list=[]
  fs.readdir('./contents', function (err, filelist) {
    console.log(req.params.id);
    req.list = Template.List(filelist, filelists);  //req의 list프로퍼티 장착
    req.filelists=filelists;
    next();
  });
})

app.get('/', (req, res,next) =>{
  var body = "";
  var html = "";
  var list = req.list;
  var title = 'Node js';
  var description = "Hello Node js!";
  body += `<p>${description}</p>`;
  html = Template.HTML(title, list, body, '');
  res.send(html);
}
)

app.get('/page/:pageId', function (req, res) {
    var list = req.list;
    var body = ""
    let title = req.params.pageId;
    //id값이 있는 애들쪽으로 들어온다면
    if (req.filelists.indexOf(title) == -1) {    //querystring이 없는값으로 들어오면
      res.sendStatus(404);
    } //id값이 이상한 곳으로 들어오면
    fs.readFile(`contents/${title}`, 'utf8', function (err, description) {
      var sanitize_title = sanitizehtml(title);
      var sanitize_description = sanitizehtml(description, { allowedTags: ['a', 'h1'] });

      if (err) throw err;
      body += `<p>${sanitize_description}</p>`;
      var control = `
      <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
      <script>  
      $(document).ready(()=>{
          $('input[type="submit"]').on('click',(event)=>{
            if(!(confirm("정말로 삭제하시겠습니까?"))){
              event.preventDefault();  
            }
          })
        })
      </script>
        <a href="/page_update/${sanitize_title}">update</a>
        <form action="/page_delete" method="POST">
        <input type="hidden" name="object" value="${sanitize_title}">
        <input type="submit" value="delete" onsubmit="alert('delete?')"/>
        </form>
        `
      html = Template.HTML(sanitize_title, list, body, control);
      res.send(html);
    }
    );
}) //페이지 라우팅, path에 따라 다른 콜백함수가 실행되도록 처리.

app.get('/page_create', (req, res) => {
  body = `<form action="/page_create" method="POST" >
  <p><input type="text" name="title" placeholder="title"></p>
  <p>
    <textarea name="description" placeholder="description"></textarea>
  </p>
  <p>
    <input type="submit">
  </p>
</form>`;
    var list =req.list;
    title = 'WEB-create';
    html = Template.HTML(title, list, body, '');
    res.send(html);
}
)

app.post('/page_create', (req, res) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다.
    let post = req.body;
    console.log(post);
    let title = sanitizehtml(post.title);
    let description = sanitizehtml(post.description);
    fs.writeFile(`./contents/${title}`, description, 'utf8', (err) => {
      if (err)
        throw err;
      else {
        res.redirect(`/page/${title}`);
      }
    })
})

app.get('/page_update/:pageId', (req, res) => {
    let filename = req.params.pageId;
    fs.readFile(`./contents/${filename}`, 'utf8', (err2, data) => {
      if(err2){
        throw err2;
      }
      body = `<form action="/page_update" method="POST" >
          <p><input type="text" name="title" value=${filename}></p>
          <p>
            <textarea name="description">${data}</textarea>
          </p>
          <p>
            <input type="hidden" name="old_path" value=${filename}>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`;
      var list = req.list;
      title = 'WEB-update';
      html = Template.HTML(title, list, body, '');
      res.send(html);
    });
}
)

app.post('/page_update',(req,res)=>{
    let post = req.body;
    let title = sanitizehtml(post.title);
    let description = sanitizehtml(post.description);
    fs.rename(`./contents/${post.old_path}`,`./contents/${title}`,(err1,data)=>{
      if(err1){
        console.log("update=error");
        throw err;
      }
      fs.writeFile(`./contents/${title}`, description, 'utf8', (err2) => {
        if (err2)
          throw err;
        else {
          console.log("update_process");
          res.redirect(`/page/${title}`);
        }
      })
    });
  }
)
app.post('/page_delete',(req,res)=>{
  let post=req.body;
  fs.unlink(`./contents/${post.object}`,(err)=>{
    if(err){
      throw err;
    }
    res.redirect('/');
  })
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



/*
// 괄호 짝찾을땐 ctrl+shift+\
// 자바스크립트 매개변수에 원시형-> 다른 주소 객체,배열형 -> 같은주소 값을 넘긴다.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var Template=require('./lib/Template.js');
var isEmpty=require('./lib/Empty.js');
var sanitizehtml=require('sanitize-html');

*/
