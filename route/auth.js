const express = require('express');
const route = express.Router();
const Template = require('../lib/Template');

module.exports = function (passport) {
  route.get('/login', (req, res, next) => {
    req.session.save(()=>{
      var body = "";
      let feed_back=req.flash();
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
  })

  route.post('/login',
    passport.authenticate(
      'local',     
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
  );
  route.get('/logout', (req, res, next) => {  
    req.logout();
    req.session.save(() => { 
      res.redirect(302, '/');
    })
  }
  )
  return route;
}
