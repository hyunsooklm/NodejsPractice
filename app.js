//git branch -vv ->local-remote branch간 관계
//git branch -rv ->remote branch의 최근커밋
//git checkout -b local (remote repository/remote branch) 해당 레포지토리 브랜치를 트랙하는 local브랜치 생성
//git fetch remote repository-> remote repository의 최신정보를 가져온다.
//어디로? 현재 브랜치의 원격브랜치로.,
//->해당 로컬브랜치에서 원격브랜치를 머지한다.
//->그 후 로컬브랜치를 푸쉬한다.
//객체 비었는지 확인-> Object.keys(객체).length===0?
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const compression = require('compression')
const Template = require('./lib/Template');
const fs = require('fs');
const route_topic = require("./route/topic");
const route_index = require("./route/index");
const session = require('express-session');
const helmet = require('helmet');
const flash=require('connect-flash')
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
app.use(flash()); //flash미들웨어 장착 -> session에 저장했다가, 쓰면 지움
//1회용 메세지, flash(parameter)를 session store에 저장했다가, flash로 읽으면 삭제

let passport=require('./lib/Passport')(app);

app.post('/auth/login',
  passport.authenticate(
    'local',      //strategy, username & password로 로그인하는법
    {failureRedirect: '/auth/login',
    failureFlash: true    
  }
    ),
    function(req, res) {
      req.session.save(function () {
        res.redirect('/');
      })
    }
  );//성공하면 홈페이지, 실패하면 재로그인,
  
  const route_auth = require("./route/auth")(passport);
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
  res.send('Page_id is not Existed');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
//예외 및 에러처리는 route해서 하지 못하면 나중으로 넘어온다.