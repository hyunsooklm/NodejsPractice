module.exports={
    is_login: function (req, res) {
        return req?true:false;
    },
    auth_ui : function auth_UI(req, res) {
        var auth_ui = `<a href="/auth/login">login</a>|<a href="/auth/register">register</a>`
        if (req.user) {
            auth_ui = `${req.user.nickname}|<a href="/auth/logout">logout</a>`
        }
        return auth_ui;
    }

}
