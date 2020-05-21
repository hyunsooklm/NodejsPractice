module.exports={
    is_login: function (req, res) {
        return req.session.is_login;
    },
    auth_ui : function auth_UI(req, res) {
        var auth_ui = `<h1><a href="../auth/login">login</a></h1>`
        if (this.is_login(req,res)) {
            auth_ui = `<p>${req.session.nickname}|<a href="../auth/logout">logout</a></p>`
        }
        return auth_ui;
    }

}
