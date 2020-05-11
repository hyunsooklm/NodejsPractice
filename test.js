const express=require('express');
const app=express();

let mylogger=(req,res,next)=>{
  req.requestTime=Date();   //req의 requestTime이라는 프로퍼티가 생성된다.
  //next()를 통해 다음에 실행되는 미들웨어의 req객체는 requestTime이라는 프로퍼티를 가지고있다.
  next();   //다음 실행되야할 middleware를 호출
}
app.use(mylogger);    //path로 들어가기 전 우선 실행되는 미들웨어

//미들웨어는 req,res사이클 내에서만 실행된다. 만약 res.send등으로 사이클이 종료되면 
//middleware는 실행되지 않는다.

app.get('/a',(req,res,next)=>{ // '/'경로에 get방식으로 들어온 경우 실행되는 middleware
console.log(req.requestTime);  
var responseText='Hello World<br>'
  responseText+=`<small>Requested at:${req.requestTime}</small>`;
  res.send(responseText);
})
app.use('/admin',(req,res,next)=>{
  res.sendStatus(401);
})

app.listen(3004);