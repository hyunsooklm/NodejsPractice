const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const compression = require('compression')
const Template=require('./lib/Template');
const fs=require('fs');
const route_topic=require("./route/topic");
const route_index=require("./route/index");
app.use(bodyParser.urlencoded({ extended: false })) //app에 middleware를 장착한다. bodyParser.urlencoded({ extended: false })는 middleware를 반환한다.
app.use(compression());//Requests that pass through the middleware will be compressed.
app.use(express.static('./public'));

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

app.use(function (req, res, next) {
  res.status(404).send('Not found');
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.send('Page_id is not Existed');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
//예외 및 에러처리는 route해서 하지 못하면 나중으로 넘어온다.