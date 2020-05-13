var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore=require('session-file-store')(session);
var app = express()
var fileStoreOption={};
app.use(session({
  secret: 'keyboard cat',//보안필수, 버전관리할 경우 빼고 넣어야함
  resave: false,
  saveUninitialized: true, //세션이 필요하기 전까지는 세션을 구동시키지 않는다. 서버의 부담을 줄 수있다. (false)의 경우
  store:new FileStore(fileStoreOption)
}))     //이 미들웨어가 req의 session 프로퍼티를 생성해준다.


app.get('/', function (req, res, next) {
console.log(req.session);
  if(req.session.num===undefined){
    req.session.num=1;
  }else{
    req.session.num++;
  }
  res.send(`Views:${req.session.num}`); //기본적으로 session저장소는 메모리에 저장되어서, server를 껐다 키면 데이터가 날아간다.
})

app.listen(3000,()=>{console.log("start!")});

//세션 데이터의 저장소를 세션store라 합니다. 세션 저장소를 변경하는 방법을 살펴보겠습니다. 
//브라우저가 서버에 접속하면, 서버는 브라우저에 session-id를 쿠키형태로 제공한다. 
//브라우저가 재접속하면, session-id를 확인하고 서버에서 그에 맞게 처리한다.
//sessionid를 확인 후 그에 맞는 정보를 세션스토어에서 찾아서, 해당 정보를 읽은 후 , request된 url에서 처리를 한다.
//최종적으로 처리 후 session store에 정보를 저장 후 종료한다.
