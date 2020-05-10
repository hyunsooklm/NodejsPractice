const express = require('express')
const Template = require('./lib/Template');
const fs = require('fs');
const app = express()
const port = 3000
const sanitizehtml = require('sanitize-html');
const qs = require("querystring");

let filelists = [];
app.get('/', (req, res) => fs.readdir('./contents', function (err, filelist) {
  var body = "";
  var html = "";
  var list = Template.List(filelist, filelists);
  var title = 'Node js';
  var description = "Hello Node js!";
  body += `<p>${description}</p>`;
  html = Template.HTML(title, list, body, '');
  res.send(html);
})
)

app.get('/page/:pageId', function (req, res) {
  fs.readdir('./contents', function (err, filelist) {
    var list = Template.List(filelist, filelists);
    var body = ""
    let title = req.params.pageId;
    //id값이 있는 애들쪽으로 들어온다면
    if (filelists.indexOf(title) == -1) {    //querystring이 없는값으로 들어오면
      res.status(404).send('Sorry cant find that!');
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

  });
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
  fs.readdir('./contents', function (err, filelist) {
    var list = Template.List(filelist, filelists);
    title = 'WEB-create';
    html = Template.HTML(title, list, body, '');
    res.send(html);
  });
}
)

app.post('/page_create', (req, res) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다.
  var body = "";
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    let post = qs.parse(body);
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
})

app.get('/page_update/:pageId', (req, res) => {
  fs.readdir('./contents', function (err1, filelist) {
    if (err1) {
      throw err1;
    }
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

      var list = Template.List(filelist, filelists);
      title = 'WEB-update';
      html = Template.HTML(title, list, body, '');

      res.send(html);
    });
  });
}
)

app.post('/page_update',(req,res)=>{
  var body = "";
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    let post = qs.parse(body);
    console.log(post);
    let title = sanitizehtml(post.title);
    let description = sanitizehtml(post.description);
    fs.rename(`./contents/${post.old_path}`,`./contents/title`,(err,data)=>{
      if(err){
        throw err;
      }
    });
    fs.writeFile(`./contents/${title}`, description, 'utf8', (err) => {
      if (err)
        throw err;
      else {
        res.redirect(`/page/${title}`);
      }
    })
  })
  }
)
app.post('/page_delete',(req,res)=>{
var body="";
req.on('data',(data)=>{
  body+=data;
})
req.on('end',()=>{
  let post=qs.parse(body);
  fs.unlink(`./contents/${post.object}`,(err)=>{
    if(err){
      throw err;
    }
    res.redirect('/');
  })
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
