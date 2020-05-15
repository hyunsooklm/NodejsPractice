module.exports = function (app) {
    let info = {
        id: "hyunsooklm",
        password: "kimhs1019@",
        nickname: "kimhyunsoo"
    }

    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        done(null, info);
    });

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },
        function (username, password, done) {
            if (username === info.id && password === info.password) {
                return done(null, info);
            }
            else if (username != info.id) {
                return done(null, false, { message: 'Incorrect ID.' });
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        }
    ));
    return passport;
}