const express = require('express');
const route = express.Router();
const fs = require('fs');
const Template = require('../lib/Template');
const sanitizehtml = require('sanitize-html');

let info = {
  id: "hyunsooklm",
  password: "kimhs1019@",
  nickname: "kimhyunsoo"
}
route.get('/login', (req, res, next) => {
  var body = "";
  var list = req.list;
  var title = 'login';
  var description = `
  <form action=/auth/login method="post" autocomplete="off">
  <p><input type="text" name="id" placeholder="id를 입력하세요"><br></p>
  <p><input type="password" name="password" placeholder="password"><br></p>
  <p><input type="submit" value="로그인"></p>
  </form>
  `;
  body += `<p>${description}</p>`;
  body += `<img src="/image/hello.jpg" style="width:200px" display:block; margin-top:10px; ;>`
  var html = Template.HTML(title, list, body, '');
  res.send(html);
})

function log(req,res){
  req.session.is_login= true;
  req.session.nickname= info.nickname;
  return true;
}
route.post('/login', (req, res, next) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다.
  let post = req.body;
  if (post.id === info.id && post.password === info.password) {
    req.session.is_login=true;
    req.session.nickname=info.nickname;
    req.session.save((err)=>{ //session store에 저장 한 후 뒤에작업을 처리!!!!
      res.redirect(302, '/');
      return false;  
    });
  }
  else {
    res.send("who?");
  }
});
route.get('/logout', (req, res, next) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다
  req.session.destroy((err) => {
    if (err)
      next(err);
  });
  res.redirect(302, '/');
}
)
module.exports = route;