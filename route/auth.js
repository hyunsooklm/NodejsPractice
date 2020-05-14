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
// route.get('/page_create', (req, res, next) => {
//     body = `<form action="/topic/page_create" method="POST" >
//     <p><input type="text" name="title" placeholder="title"></p>
//     <p>
//       <textarea name="description" placeholder="description"></textarea>
//     </p>
//     <p>
//       <input type="submit">
//     </p>
//   </form>`;
//     var list = req.list;
//     title = 'WEB-create';
//     html = Template.HTML(title, list, body, '');
//     res.send(html);
// }
// )

// route.post('/page_create', (req, res, next) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다.
//     let post = req.body;
//     let title = sanitizehtml(post.title);
//     let description = sanitizehtml(post.description);
//     fs.writeFile(`./contents/${title}`, description, 'utf8', (err) => {
//         if (err)
//             throw err;
//         else {
//             res.redirect(`/topic/${title}`);
//         }
//     });
// });
// route.get('/page_update/:pageId', (req, res, next) => {
//     let filename = req.params.pageId;
//     fs.readFile(`./contents/${filename}`, 'utf8', (err2, data) => {
//         if (err2) {
//             next(err2);
//         }
//         body = `<form action="/topic/page_update" method="POST" >
//             <p><input type="text" name="title" value=${filename}></p>
//             <p>
//               <textarea name="description">${data}</textarea>
//             </p>
//             <p>
//               <input type="hidden" name="old_path" value=${filename}>
//             </p>
//             <p>
//               <input type="submit">
//             </p>
//           </form>`;
//         var list = req.list;
//         title = 'WEB-update';
//         html = Template.HTML(title, list, body, '');
//         res.send(html);
//     });
// });

// route.post('/page_update', (req, res) => {
//     let post = req.body;
//     let title = sanitizehtml(post.title);
//     let description = sanitizehtml(post.description);
//     fs.rename(`./contents/${post.old_path}`, `./contents/${title}`, (err1, data) => {
//         if (err1) {
//             throw err;
//         }
//         fs.writeFile(`./contents/${title}`, description, 'utf8', (err2) => {
//             if (err2)
//                 throw err;
//             else {
//                 console.log("update_process");
//                 res.redirect(`/topic/${title}`);
//             }
//         })
//     });
// });
// route.get('/:pageId', function (req, res, next) {
//     var list = req.list;
//     var body = ""
//     let title = req.params.pageId;
//     fs.readFile(`contents/${title}`, 'utf8', function (err, description) {
//         if (err) {
//             next(err);
//         }
//         var sanitize_title = sanitizehtml(title);
//         var sanitize_description = sanitizehtml(description, { allowedTags: ['a', 'h1'] });
//         body += `<p>${sanitize_description}</p>`;
//         var control = `
//         <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
//         <script>  
//         $(document).ready(()=>{
//             $('input[type="submit"]').on('click',(event)=>{
//               if(!(confirm("정말로 삭제하시겠습니까?"))){
//                 event.preventDefault();  
//               }
//             })
//           })
//         </script>
//           <a href="/topic/page_update/${sanitize_title}">update</a>
//           <form action="/topic/page_delete" method="POST">
//           <input type="hidden" name="object" value="${sanitize_title}">
//           <input type="submit" value="delete" onsubmit="alert('delete?')"/>
//           </form>
//           `
//         html = Template.HTML(sanitize_title, list, body, control);
//         res.send(html);
//     }
//     );
// }) //페이지 라우팅, path에 따라 다른 콜백함수가 실행되도록 처리.


// route.post('/page_delete', (req, res) => {
//     let post = req.body;
//     fs.unlink(`./contents/${post.object}`, (err) => {
//         if (err) {
//             throw err;
//         }
//         res.redirect('/');
//     });
// });





module.exports = route;