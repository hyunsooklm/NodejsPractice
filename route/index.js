const express = require('express');
const route = express.Router();
const Template = require('../lib/Template');
const auth=require('../auth_UI/auth_check');


route.get('', (req, res, next) => {

    var body = "";
    var list = req.list;
    var title = 'Node js';
    var description = "Hello Node js!";
    body += `<p>${description}</p>`;
    body += `<img src="/image/hello.jpg" style="width:200px" display:block; margin-top:10px; ;>`
    var html =Template.HTML(title, list, body, '',auth.auth_ui(req,res));
    res.send(html);
  }
  )
  route.get('/index', (req, res, next) => {
    res.redirect('/');
  }
  );

  module.exports=route;