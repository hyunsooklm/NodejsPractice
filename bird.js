let express=require('express');
let route=express.Router();

route.use((req,res,next)=>{
    console.log(`Time: ${Date.now()}`);
    next();
});
route.get('/about',(req,res,next)=>{
    res.send('about birds');
});
route.get('/',(req,res,next)=>{
    res.send('Bird home page');
});


module.exports=route;