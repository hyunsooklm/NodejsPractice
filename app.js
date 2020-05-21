const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const compression = require('compression')
const Template=require('./lib/Template');
const fs=require('fs');
const route_topic=require("./route/topic");
const route_index=require("./route/index");
const helmet=require("helmet");

app.use(helmet());
const route_auth=require("./route/auth");
const session = require('express-session');
let FileStore=require('session-file-store')(session);
let fileStoreOption={};

app.use(bodyParser.urlencoded({ extended: false })) //app에 middleware를 장착한다. bodyParser.urlencoded({ extended: false })는 middleware를 반환한다.
app.use(compression());//Requests that pass through the middleware will be compressed.
app.use(express.static('./public'));

app.use(session({
  secret: 'keyboard cat',//보안필수, 버전관리할 경우 빼고 넣어야함
  resave: false,
  saveUninitialized: true, //세션이 필요하기 전까지는 세션을 구동시키지 않는다. 서버의 부담을 줄 수있다. (false)의 경우
  store:new FileStore(fileStoreOption) //세션을 파일에 저장하겠다. 세션스토어==파일
}),(req,res,next)=>next())     //이 미들웨어가 req의 session 프로퍼티를 생성해준다.

app.get('*', (req, res, next) => {//get방식을 들어온 모든 경로의 미들웨어장착
  fs.readdir('./contents', function (err, filelist) {
      req.list = Template.List(filelist);  //req의 list프로퍼티 장착
      next();
  });
})
app.use('/',route_index);
//index로 들어온다면 route_index에서 관리
app.use('/topic',route_topic);
//topic으로 들어오고 route객체 내 /topic/route내주소로 들어오면 해당 미들웨어 처리
app.use('/auth',route_auth);
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