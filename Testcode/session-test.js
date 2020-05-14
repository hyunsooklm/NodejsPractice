let port = process.env.port || 3000;

let express = require('express');
let app = express();
let sessionParser = require('express-session');
let router = express.Router();

/** express-session 미들웨어를 사용하기위해 app에 등록*/


app.use('/', router);

/** session 확인 */
router.route('/confirmSession').get(function (req, res) {
    console.log('세션을 확인해보자!!');
    let msg = `세션이 존재하지 않습니다.`
    if (req.session.user) {
        msg = `${req.session.user.name}님의 나이는 ${req.session.user.age}살 입니다. 세션의 생성된 시간 : ${req.session.user.createCurTime}`;
    }

    res.send(msg);

});

/** session 생성 */
router.route('/').get(function (req, res) {
    console.log('루트접속');

    if(req.session.user){
        console.log(`세션이 이미 존재합니다.`);
    }else{
        req.session.user = {
            "name" : "Master Yunjin",
            "age" : 25,
            "createCurTime" : new Date()
        }
        console.log(`세션 저장 완료! `);
    }
    res.redirect(`/confirmSession`);

});

/** session 삭제 */
router.route('/destroySession').get(function(req,res){
    req.session.destroy();
    console.log(`session을 삭제하였습니다.`);
    res.redirect(`/confirmSession`);
});


app.listen(port, function () {
    console.log(`${port}번 포트로 서버가 작동합니다.`);
})


