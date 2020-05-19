const express = require('express');
const route = express.Router();
const Template = require('../lib/Template');
const auth = require('../auth_UI/auth_check');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const shortid = require('shortid');
const _ = require('lodash');
module.exports = function (passport) {
  route.get('/login', (req, res, next) => {
    req.session.save(() => {
      var body = "";
      let feed_back = req.flash();
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
      var html = Template.HTML(title, list, body, '', auth.auth_ui(req, res));
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

  route.get('/register', (req, res, next) => {
    let user_arr = db.get('user').value();
    var body = "";
    let feed_back = req.flash();
    if (feed_back.error) {
      body += `<div style="color:red;">${feed_back.error}</div>`;
    }
    var list = req.list;
    var title = 'register';
    var description = `
    <form action=/auth/register method="post" autocomplete="off">
    <p><input type="text" name="id" placeholder="id를 입력하세요"><br></p>
    <p><input type="password" name="password" placeholder="password"><br></p>
    <p><input type="password" name="password_check" placeholder="password확인"><br></p>
    <p><input type="text" name="Displayname" placeholder="Displayname"><br></p>
    
    <p><input type="submit" value="회원가입"></p>
    </form>
    `;
    body += `<p>${description}</p>`;
    body += `<img src="/image/hello.jpg" style="width:200px" display:block; margin-top:10px; ;>`
    var html = Template.HTML(title, list, body, '', auth.auth_ui(req, res));
    res.send(html);

  })

  route.post('/register', (req, res, next) => {
    post = req.body;
    let id = post.id;
    let pwd = post.password;
    let password_check = post.password_check;
    let Displayname = post.Displayname;
    let user_arr = db.get('user').value();
    db.defaults({ user: [] }).write();
    console.log((!(_.find(user_arr,(e)=>e.id===id,0))));
    if (pwd != password_check ||(_.find(user_arr,(e)=>e.id===id,0))||(_.find(user_arr,(e)=>e.Displayname===Displayname,0)) ) {
      if (pwd != password_check) {
        req.flash("error", "password!=password_check");
      }
      else if ((_.find(user_arr,(e)=>e.Displayname===Displayname,0))) {   
        req.flash("error", "Displayname is existed.");
      }
      else if ((_.find(user_arr,(e)=>e.id===id,0))) {   
        req.flash("error", "id is existed.");
      }
      req.session.save(() => {
        res.redirect(302, '/auth/register');
      })
      return false;
    }
    else {
      db.get("user").push({
        unique_id: shortid.generate(),
        id: id,
        password: pwd,
        Displayname: Displayname
      }).write();
      res.redirect(302, '/');
    }
  })

  route.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save(() => {
      res.redirect(302, '/');
    })
  }
  )
  return route;
}
