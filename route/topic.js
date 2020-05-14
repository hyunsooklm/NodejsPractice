const express = require('express');
const route = express.Router();
const fs = require('fs');
const Template = require('../lib/Template');
const sanitizehtml = require('sanitize-html');
const auth = require('../auth_UI/auth_check');



route.get('/page_create', (req, res, next) => {
  if(!req.session.is_login){
    res.redirect('../');
    return false;
  }
  body = `<form action="/topic/page_create" method="POST" >
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
      <textarea name="description" placeholder="description"></textarea>
    </p>
    <p>
      <input type="submit">
    </p>
  </form>`;

  var list = req.list;
  title = 'WEB-create';
  html = Template.HTML(title, list, body, '', auth.auth_ui(req, res), auth.auth_ui(req, res));
  res.send(html);
}
)

route.post('/page_create', (req, res, next) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다.
  let post = req.body;
  let title = sanitizehtml(post.title);
  let description = sanitizehtml(post.description);
  fs.writeFile(`./contents/${title}`, description, 'utf8', (err) => {
    if (err)
      throw err;
    else {
      res.redirect(`/topic/${title}`);
    }
  });
});
route.get('/page_update/:pageId', (req, res, next) => {
  if(!req.session.is_login){
    res.redirect('../');
  }
  let filename = req.params.pageId;
  fs.readFile(`./contents/${filename}`, 'utf8', (err2, data) => {
    if (err2) {
      next(err2);
    }
    body = `<form action="/topic/page_update" method="POST" >
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
    html = Template.HTML(title, list, body, '', auth.auth_ui(req, res));
    res.send(html);
  });
});

route.post('/page_update', (req, res) => {
  let post = req.body;
  let title = sanitizehtml(post.title);
  let description = sanitizehtml(post.description);
  fs.rename(`./contents/${post.old_path}`, `./contents/${title}`, (err1, data) => {
    if (err1) {
      throw err;
    }
    fs.writeFile(`./contents/${title}`, description, 'utf8', (err2) => {
      if (err2)
        throw err;
      else {
        console.log("update_process");
        res.redirect(`/topic/${title}`);
      }
    })
  });
});
route.get('/:pageId', function (req, res, next) {
  if(!req.session.is_login){
    res.redirect('../');
  }
  var list = req.list;
  var body = ""
  let title = req.params.pageId;
  fs.readFile(`contents/${title}`, 'utf8', function (err, description) {
    if (err) {
      next(err);
    }
    var sanitize_title = sanitizehtml(title);
    var sanitize_description = sanitizehtml(description, { allowedTags: ['a', 'h1'] });
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
          <a href="/topic/page_update/${sanitize_title}">update</a>
          <form action="/topic/page_delete" method="POST">
          <input type="hidden" name="object" value="${sanitize_title}">
          <input type="submit" value="delete" onsubmit="alert('delete?')"/>
          </form>
          `
    html = Template.HTML(sanitize_title, list, body, control, auth.auth_ui(req, res));
    res.send(html);
  }
  );
}) //페이지 라우팅, path에 따라 다른 콜백함수가 실행되도록 처리.


route.post('/page_delete', (req, res) => {
  let post = req.body;
  fs.unlink(`./contents/${post.object}`, (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});





module.exports = route;