let bird=require('./bird');
let express=require('express');
let app=express();

console.log(bird);
app.use('/bird',bird);
app.listen(3004);