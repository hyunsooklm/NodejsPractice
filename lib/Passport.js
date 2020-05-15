module.exports = function (app) {
    let info = {
        id: "hyunsooklm",
        password: "kimhs1019@",
        nickname: "kimhyunsoo"
    }

    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy; //passport선언 localstrategy를 사용하겠다. username/password
    app.use(passport.initialize()); //app에 passport사용하겠다.
    app.use(passport.session());   //passport는 내부적으로 session을 쓰겠다.


    passport.serializeUser(function (user, done) { //로그인에 성공하면 데이터를 serialize에 콜백함수의 첫번째인자로 전달
        done(null, user.id); //session에 사용자의 식별자값을 저장함.
        //사용자의 식별자값을 추출해서 done함수의 두번째 인자로 전달하면 session내의 passport내의 user의값으로 적힘.
    });
    //->세션스토어에 로그인에 성공했다라는 정보를 저장하는곳===serializeUser 로그인성공시 한번만 호출됨
    //※로그인성공시 한번만 호출 사용자의 식별자를 세션스토어에 저장한다.
    //session정보에 passport 객체가 저장되어 있지 않으면 deserializeUser는 호출되지 않음.

    passport.deserializeUser(function (id, done) { //로그인한 사용자인지 아닌지 확인
        done(null, info);  //=> deserialize의 done의 두번째로 전달되는 인자가 request의 user 프로퍼티로 정의된다.
    });
    //로그인성공하면 page에 방문할때마다 deserialize의 콜백함수가 호출되도록 약속됨.
    //저장된 데이터를 기준으로해서 우리가 필요한 값을 조회할떄 사용
    //페이지로딩기준으로 작동한다. authenticate->Localstrategy->serialize->authenticate->index 
    //고로 authenticate에서 save를 해주면 index페이지에서 deserialize를 확인할 수 있다.

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },  //원래 LocalStrategy parameter은 id=username, password=password로 약속되어있음, 바꾼것.
        function (username, password, done) {
            if (username === info.id && password === info.password) {
                return done(null, info); //done의 두번째 인자로 사용자의 실제 데이터정보를 넣어주면 된다.
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