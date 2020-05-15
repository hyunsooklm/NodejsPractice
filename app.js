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

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(compression());
app.use(express.static('./public'));
app.use(helmet());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true, 
  store: new FileStore(fileStoreOption) 
}))    
app.use(flash());

let passport=require('./lib/Passport')(app);

app.post('/auth/login',
  passport.authenticate(
    'local',      
    {failureRedirect: '/auth/login',
    failureFlash: true    
  }
    ),
    function(req, res) {
      req.session.save(function () {
        res.redirect('/');
      })
    }
  );

  const route_auth = require("./route/auth")(passport);
  app.get('*', (req, res, next) => {
  fs.readdir('./contents', function (err, filelist) {
    req.list = Template.List(filelist);  
    next();
  });
})


app.use('/', route_index);
app.use('/topic', route_topic);
app.use('/auth', route_auth);

app.use(function (req, res, next) {
  res.status(404).send('Not found');
});

app.use(function (err, req, res, next) {
  res.send('Page_id is not Existed');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
