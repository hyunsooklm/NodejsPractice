const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const compression = require('compression')
const Template = require('./lib/Template');
const fs = require('fs');
const route_topic = require("./route/topic");
const route_index = require("./route/index");
const route_auth = require("./route/auth");
const session = require('express-session');
const helmet = require('helmet');
let FileStore = require('session-file-store')(session);
let fileStoreOption = {};
let info = {
  id: "hyunsooklm",
  password: "kimhs1019@",
  nickname: "kimhyunsoo"
}
app.use(bodyParser.urlencoded({ extended: false })) //app에 middleware를 장착한다. bodyParser.urlencoded({ extended: false })는 middleware를 반환한다.
app.use(compression());//Requests that pass through the middleware will be compressed.
app.use(express.static('./public'));
app.use(helmet());
app.use(session({
  secret: 'keyboard cat',//보안필수, 버전관리할 경우 빼고 넣어야함
  resave: false,
  saveUninitialized: true, //세션이 필요하기 전까지는 세션을 구동시키지 않는다. 서버의 부담을 줄 수있다. (false)의 경우
  store: new FileStore(fileStoreOption) //세션을 파일에 저장하겠다. 세션스토어==파일
}))     //이 미들웨어가 req의 session 프로퍼티를 생성해준다.

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
/*passport는 내부적으로 session을 활용하기때문에, session미들웨어가 장착되고 난 뒤, 즉 session활성화 코드 뒤에나와야한다.*/

passport.use(new LocalStrategy({
usernameField:'id',
passwordField:'password'
},  //원래 parameter은 id=username, password=password로 약속되어있음, 바꾼것.
function (username, password, done) {
  if(username===info.id&&password===info.password){
    console.log(1);
    return done(null, user);
  }
  else if(password!=info.password){
    console.log(2);
    return done(null, false, { message: 'Incorrect password.' });
  }else{
    console.log(3);
    return done(null, false, { message: 'Incorrect username.' });  
  }
}



  //   User.findOne({ username: username }, function (err, user) {
  //     if (err) { return done(err); }
  //     if (!user) {
  //       return done(null, false, { message: 'Incorrect username.' });
  //     }
  //     if (!user.validPassword(password)) {
  //       return done(null, false, { message: 'Incorrect password.' });
  //     }
  //     return done(null, user);
  //   });
  // }
));

app.post('/auth/login',
  passport.authenticate('local', { //strategy, username & password로 로그인하는법
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));//성공하면 홈페이지, 실패하면 재로그인,

// route.post('/login', (req, res, next) => {  //post로 받는거라면, app.post로 이미 받기때문에 경로를 create_process로 할 필요 없다.
//   let post = req.body;
//   if (post.id === info.id && post.password === info.password) {
//     req.session.is_login=true;
//     req.session.nickname=info.nickname;
//     req.session.save((err)=>{ //session store에 저장 한 후 뒤에작업을 처리!!!!
//       res.redirect(302, '/');
//       return false;  
//     });
//   }
//   else {
//     res.send("who?");
//   }
// });

app.get('*', (req, res, next) => {//get방식을 들어온 모든 경로의 미들웨어장착
  fs.readdir('./contents', function (err, filelist) {
    req.list = Template.List(filelist);  //req의 list프로퍼티 장착
    next();
  });
})


app.use('/', route_index);
//index로 들어온다면 route_index에서 관리
app.use('/topic', route_topic);
//topic으로 들어오고 route객체 내 /topic/route내주소로 들어오면 해당 미들웨어 처리
app.use('/auth', route_auth);
//auth으로 들어오고 route객체 내 /auth/route내주소로 들어오면 해당 미들웨어 처리

app.use(function (req, res, next) {
  res.status(404).send('Not found');
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send('Page_id is not Existed');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
//예외 및 에러처리는 route해서 하지 못하면 나중으로 넘어온다.