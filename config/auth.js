// CARREGANDO OS MODÚLOS
    const local_strategy = require('passport-local').Strategy
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
// MODEL DO USUÁRIO
    require("../models/User");
    const User = mongoose.model('users');
// CONFIGURAR O SISTEMA DE AUTENTICAÇÃO
    module.exports = function(passport){
        passport.use(new local_strategy({usernameField: 'name_user'}, (name_user, password, done) =>{
            // COMPARANDO O NOME DE USUÁRIO INFORMADO
            User.findOne({name_user: name_user}).then((user)=>{
                // SE NÃO ENCONTRAR
                if(!user){
                    return done(null, false, {message: "Esta conta não existe"});
                }
                // COMPARAR AS SENHAS
                bcrypt.compare(password, user.password, (erro, batem) => {
                    // SE SÃO IGUAIS
                    if(batem){
                        return done(null,user);
                    }else{
                        return done(null,false,{message: "Senha incorreta"});
                    }
                })
            }).catch((err)=>{
                console.log("Houve um erro "+err);
            });
        }));
        // SERVE PRA SALVAR OS DADOS DO USUÁRIO NUMA SESSÃO
        passport.serializeUser((user, done)=>{
            done(null, user.id);
        });
        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user)=>{
                done(err, user);
            });
        });
    }