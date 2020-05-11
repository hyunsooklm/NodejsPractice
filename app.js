const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const route=require("./route/topic");
const compression = require('compression')

app.use(bodyParser.urlencoded({ extended: false })) //app에 middleware를 장착한다. bodyParser.urlencoded({ extended: false })는 middleware를 반환한다.
app.use(compression());//Requests that pass through the middleware will be compressed.
app.use(express.static('./public'));

app.use('/topic',route);
//topic으로 들어오고 route객체 내 /topic/route내주소로 들어오면 해당 미들웨어 처리

app.use(function (req, res, next) {
  res.status(404).send('Not found');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
