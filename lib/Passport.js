const db = require('../lib/db');
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
            else if(user.password!=password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            else{
                return done(null, user);
            }
        }
    ));
    return passport;
}