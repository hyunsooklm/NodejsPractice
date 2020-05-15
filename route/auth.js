const express = require('express');
const route = express.Router();
const Template = require('../lib/Template');

module.exports = function (passport) {
  route.get('/login', (req, res, next) => {
    var body = "";
    var feed_back = req.flash();
    if (feed_back.error) {
      body += `<div style="color:red;">${feed_back.error}</div>`;
    }
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
  route.post('/auth/login',
    passport.authenticate(
      'local',      //strategy, username & password로 로그인하는법
      {
        failureRedirect: '/auth/login',
        failureFlash: true
      }
    ),
    function (req, res) {
      req.session.save(function () {
        res.redirect('/');
      })
    }
  );//성공하면 홈페이지, 실패하면 재로그인,
  route.get('/logout', (req, res, next) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다
    req.logout();//req객체 user프로퍼티 없애주고, login session 지운다.
    req.session.save(() => {  //session store에 session상태 저장.
      res.redirect(302, '/');
    })
  }
  )
  return route;
}
