const express = require('express');
const route = express.Router();
const Template = require('../lib/Template');
const auth = require('../auth_UI/auth_check');
const db=require('../lib/db');
const shortid = require('shortid');
const _ = require('lodash');
module.exports = function (passport) {
  route.get('/login', (req, res, next) => {
    req.session.save(() => {
      var body = "";
      // let feed_back = req.flash();
      // if (feed_back.error) {
      //   body += `<div style="color:red;">${feed_back.error}</div>`;
      // }
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
    if (post.password != post.password_check ||db.get('user').find({id:post.id}).value()||(db.get('user').find({Displayname:post.Displayname}).value())) {
      if (post.password != post.password_check) {
        req.flash("error", "password!=password_check");
      }
      else if (db.get('user').find({id:post.id}).value()) {   
        req.flash("error", "id is existed.");
      }
      else if (db.get('user').find({Displayname:post.Displayname}).value()) {   
        req.flash("error", "Displayname is existed.");
      }
      req.session.save(() => {
        res.redirect(302, '/auth/register');
      })
      return false;
    }
    else {
      let user={
        unique_id: shortid.generate(),
        id: post.id,
        password: post.password,
        Displayname: post.Displayname
      }
      db.get("user").push(user).write();
      req.login(user, function(err) {
        if (err) { return next(err); }
        else{
          req.session.save(()=>{
            return res.redirect('/');
          })
        }
      });
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
