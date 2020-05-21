const express = require('express');
const route = express.Router();
const fs = require('fs');
const Template = require('../lib/Template');
const sanitizehtml = require('sanitize-html');
const auth = require('../auth_UI/auth_check');
const db = require('../lib/db');
const shortid = require('shortid');



route.get('/page_create', (req, res, next) => {
  if (!req.user) {
    res.redirect('../');
    return false;
  }
  body = `<form action="/topic/page_create" method="POST" >
    <p><input type="text" name="title" 
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

route.post('/page_create', (req, res, next) => {
  let post = req.body;
  let title = sanitizehtml(post.title);
  let description = sanitizehtml(post.description);
  let id = shortid.generate();
  db.get('topic').push({
    id: id,
    title: title,
    description: description,
    author: req.user.Displayname
  }).write()

  res.redirect(`/topic/${id}`);

});



route.get('/page_update/:pageId', (req, res, next) => {
  if (!req.user) {
    res.redirect('../');
    return false;
  }
  let topic = db.get('topic').find({ id: req.params.pageId }).value()
  let author = topic.author;
  let id = topic.id;
  let title = topic.title
  let description = topic.description;
  if (req.user.Displayname != author) { //작성자가 아니라면
    req.flash("error", "Not yours. can't update");
    req.session.save(() => {
      res.redirect(`/topic/${req.params.pageId}`);
    });
    return false;
  }
  body = `<form action="/topic/page_update" method="POST" >
            <p><input type="text" name="title" value=${title}></p>
            <p>
              <textarea name="description">${description}</textarea>
            </p>
            <p>
              <input type="hidden" name="origin_id" value=${id}>
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

route.post('/page_update', (req, res) => {
  let post = req.body;
  let id = post.origin_id
  let title = sanitizehtml(post.title);
  let description = sanitizehtml(post.description);
  db.get('topic').
    find({ id: id }).
    assign({ title: title, description: description })
    .write();
  res.redirect(302, `/topic/${id}`);
});


route.get('/:pageId', function (req, res, next) {
  if (!req.user) {
    res.redirect('../');
    return false;
  }
  var list = req.list;
  var body = ""
  let feed_back = req.flash();
  if (feed_back.error) {
    body += `<div style="color:red;">${feed_back.error}</div>`;
  }
  let topic = db.get('topic').find({ id: req.params.pageId }).value()
  let id = topic.id
  let description = topic.description;
  var author = topic.author;
  var sanitize_id = sanitizehtml(id);
  var sanitize_description = sanitizehtml(description, { allowedTags: ['a', 'h1'] });
  console.log(`글쓴사람:${author}/읽고있는사람:${req.user.Displayname}`);

  body += `<p>${sanitize_description}</p>`;
  var a="abcde";
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
          <a href='/topic/page_update/${sanitize_id}'>update</a>
          <form action='/topic/page_delete' method='POST'>
          <input type='hidden' name='id' value='${sanitize_id}'>
          <input type='submit' value='delete' />
          </form>
          `
  html = Template.HTML(sanitize_id, list, body, control, auth.auth_ui(req, res));

  res.send(html);

})


route.post('/page_delete', (req, res) => {
  let post = req.body;
  if(req.user.Displayname!=post.id){
    req.flash("error","Not yours.Can not delete");
    req.session.save(()=>{
      res.redirect(302,`/topic/${post.id}`)
    })
    return false;
  }
  db.get('topic').remove({ id: post.id }).write();
  return res.redirect(302, '/');
});





module.exports = route;