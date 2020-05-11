const express = require('express');
const route = express.Router();
const Template = require('../lib/Template');

route.get('', (req, res, next) => {
    var body = "";
    var html = "";
    var list = req.list;
    var title = 'Node js';
    var description = "Hello Node js!";
    body += `<p>${description}</p>`;
    body += `<img src="/image/hello.jpg" style="width:200px" display:block; margin-top:10px; ;>`
    html = Template.HTML(title, list, body, '');
    res.send(html);
  }
  )
  route.get('/index', (req, res, next) => {
    res.redirect('/');
  }
  )

  module.exports=route;