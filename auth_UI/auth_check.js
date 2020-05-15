module.exports={
    is_login: function (req, res) {
        return req.session.is_login;
    },
    auth_ui : function auth_UI(req, res) {
        var auth_ui = `<h1><a href="../auth/login">login</a></h1>`
        if (req.user) {
            auth_ui = `<p>${req.user.nickname}|<a href="../auth/logout">logout</a></p>`
        }
        return auth_ui;
    }

}
