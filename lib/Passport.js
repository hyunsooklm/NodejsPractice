const db = require('../lib/db');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const google_credential=require('../configure/google-login-api.json');
module.exports = function (app) {

    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;
    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        let user = db.get('user').find({ id: id }).value();
        done(null, user);//id식별자값과 session에서의 비교 후 확인
    });

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },      
        function (username, password, done) {
            let user = db.get('user').find({ id: username }).value()
            if (user === undefined) { //id로 디비에서 조회가 안될경우
                return done(null, false, { message: '존재하지 않는 ID' });
            }
            bcrypt.compare(password,user.password,(err,result)=>{                
                if(!result) {
                    return done(null, false, { message: 'Incorrect password.' });
                }//password check
                    return done(null, user);
            })
        }));
        passport.use(new GoogleStrategy({
            clientID: google_credential.web.client_id,
            clientSecret: google_credential.web.client_secret,
            callbackURL: google_credential.web.redirect_uris
          },
          function(accessToken, refreshToken, profile, done) {
               User.findOrCreate({ googleId: profile.id }, function (err, user) {
                 return done(err, user);
               });
          }
        ));
    return passport;
}