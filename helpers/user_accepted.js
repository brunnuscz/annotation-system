// APENAS USUÁRIOS PODE ENTRAR NO SISTEMA
module.exports = {
    user_accepted: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Registre-se ou faça o login");
        res.redirect("/");
    }
}