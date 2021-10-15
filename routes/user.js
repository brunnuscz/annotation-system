// CHAMANDO O EXPRESS
    const express = require('express');
// COMPONENTE PRA CRIAR ROTAS EM ARQUIVOS SEPARADOS
    const router = express.Router();
// IMPORTA O MONGOOSE
    const mongoose = require('mongoose');
// CHAMA O ARQUIVO DO MODEL Annotation
    require('../models/Annotation');
// CHAMA O ARQUIVO DO MODEL User
    require('../models/User');
// CONSTANTE QUE RECEBE QUE RECEBE A REFERÊNCIA DO MODEL annotations
    const Annotation = mongoose.model('annotations');
// CONSTANTE QUE RECEBE QUE RECEBE A REFERÊNCIA DO MODEL users
    const User = mongoose.model('users');
// CONSTANTE QUE RECEBE A IMPORTAÇÃO DO MODÚLO
    const bcrypt = require('bcryptjs');
// CARREGANDO O PASSPORT
    const passport = require('passport');
// CARREGAR O HELPER, VOCÊ É UM USUÁRIO
    const {user_accepted}= require('../helpers/user_accepted');

// ROTAS GET
    // ROTA FORMULÁRIO DE REGISTRO
        router.get('/registration', (req,res)=>{
            res.render("user/registration");
        });
    // ROTA DE LOGOUT
        router.get('/logout', user_accepted, (req, res)=>{
            req.flash("success_msg", "Logout feito com sucesso");
            req.logout();
            res.redirect("/");
        });
    // ROTA DE LISTAR SUAS ANOTAÇÕES
        router.get('/list/annotation', user_accepted, (req,res)=>{
            Annotation.find({id_user: req.user}).sort({date:'desc'}).lean().then((annotations)=>{
                res.render("user/list_annotation", {annotations: annotations});
            }).catch((erro)=>{
                req.flash("error_msg", "Erro ao listar anotações!");
                res.redirect("/");
            });
        });
    // ROTA DE LISTAR OUTRAS ANOTAÇÕES
        router.get('/other/annotation', user_accepted, (req,res)=>{
            Annotation.find({publication_type: 'Pública'}).sort({date:'desc'}).lean().then((annotations)=>{
                res.render("user/other_annotation", {annotations: annotations});
            }).catch((erro)=>{
                req.flash("error_msg", "Erro ao listar anotações!");
                res.redirect("/");
            });
        });
    // ROTA DO FORMULÁRIO ANOTAÇÃO
        router.get('/create/annotation', user_accepted,(req,res)=>{
            res.render("user/create_annotation");
        });
    // ROTA DE VISUALIZAR ANOTAÇÃO
        router.get('/see_more/annotation/:id', user_accepted,(req,res)=>{
            Annotation.findOne({_id: req.params.id}).lean().then((annotation) =>{
                res.render("user/see_more_annotation", {annotation: annotation});
            }).catch((error)=>{
                req.flash("error_msg", "Essa anotação não existe!");
                res.redirect("/list/annotation");
            });
        });
    // ROTA DO FORMULÁRIO EDITAR ANOTAÇÃO
        router.get('/edit/annotation/:id', user_accepted,(req,res)=>{
            Annotation.findOne({_id: req.params.id}).lean().then((annotation) =>{
                res.render("user/edit_annotation", {annotation: annotation});
            }).catch((error)=>{
                req.flash("error_msg", "Essa anotação não existe!");
                res.redirect("/list/annotation");
            });
        });
    // ROTA DO FORMULÁRIO EDITAR PERFIL
        router.get('/profile', user_accepted,(req,res)=>{
            User.findOne({_id: req.user}).lean().then((user) =>{
                res.render("user/profile", {user: user});
            }).catch((error)=>{
                req.flash("error_msg", "Esse usuário não existe!");
                res.redirect("/list/annotation");
            });
        });
    
    // ROTA DE PESQUISAR SUAS ANOTAÇÕES
        router.get('/search/title', user_accepted, (req,res)=>{
            Annotation.find({title: req.query.search, id_user: req.user}).sort({date:'desc'}).lean().then((annotations)=>{
                res.render("user/list_annotation", {annotations: annotations});
            }).catch((erro)=>{
                req.flash("error_msg", "Erro na busca!");
                res.redirect("/");
            });
        });
    // ROTA DE PESQUISAR OUTRAS ANOTAÇÕES
        router.get('/search/other/title', user_accepted, (req,res)=>{
            Annotation.find({title: req.query.search, publication_type: 'Pública'}).sort({date:'desc'}).lean().then((annotations)=>{
                res.render("user/other_annotation", {annotations: annotations});
            }).catch((erro)=>{
                req.flash("error_msg", "Erro na busca!");
                res.redirect("/");
            });
        });
// ROTAS POST
    // ROTA DE EDITAR USUÁRIO
        router.post('/editing/profile', user_accepted, (req,res)=>{
            // TRATAMENTO DE ERROS
            var erros = [];
            if(!req.body.name_user || typeof req.body.name_user == undefined || req.body.name_user == null){
                erros.push({texto: "Dados Inválidos!"});
            }
            if(req.body.name_user.length < 4){
                erros.push({texto: "Nome de usuário muito curto"});
            }
            if(erros.length > 0){
                res.render("user/profile", {erros: erros});
            }else{
                User.findOne({_id: req.body.id}).then((user)=>{
                    user.name_user = req.body.name_user
                    user.save().then(()=>{
                        req.flash("success_msg", "Usuário editado com sucesso!");
                        res.redirect("/list/annotation");
                    }).catch((error)=>{
                        req.flash("error_msg", "Houve um erro ao salvar edição!");
                        res.redirect("/list/annotation");
                    });
                }).catch((error)=>{
                    req.flash("error_msg","Houve um erro ao editar usuário!");
                    res.redirect("/list/annotation");
                });
            }
        });
    // ROTA DE CRIAR ANOTAÇÃO
        router.post('/new/annotation', user_accepted, (req,res)=>{
            // TRATAMENTO DE ERROS
            var erros = [];
            if(!req.body.title || typeof req.body.title == undefined || req.body.title == null ||
               !req.body.annotation  || typeof req.body.annotation == undefined  || req.body.annotation == null ||
               !req.body.publication_type  || typeof req.body.publication_type == undefined  || req.body.publication_type == null ){
                    erros.push({
                        texto: "Dados Inválidos!"
                    });
            }
            if(erros.length > 0){
                res.render("user/create_annotation", {erros: erros});
            }else{
                const new_annotation = {
                    title: req.body.title,
                    annotation: req.body.annotation,
                    user_name: req.user.name_user,
                    id_user: req.user,
                    publication_type: req.body.publication_type
                }
                new Annotation(new_annotation).save().then(()=>{
                    req.flash("success_msg", "Anotação salva com sucesso!")
                    res.redirect("/list/annotation");
                }).catch((erro)=>{
                    req.flash("error_msg", "Houve um erro ao salva!")
                    res.redirect("/create/annotation");
                });
            }
        });
    // ROTA DE EDITAR ANOTAÇÃO
        router.post('/editing/annotation', user_accepted, (req,res)=>{
            // TRATAMENTO DE ERROS
            var erros = [];
            if(!req.body.title      || typeof req.body.title == undefined      || req.body.title == null     ||
               !req.body.annotation       || typeof req.body.annotation == undefined       || req.body.annotation == null ||
               !req.body.publication_type       || typeof req.body.publication_type == undefined       || req.body.publication_type == null){
                    erros.push({
                        texto: "Dados Inválidos!"
                    });
            }
            if(erros.length > 0){
                res.render("user/edit_annotation", {erros: erros});
            }else{
                Annotation.findOne({_id: req.body.id}).then((annotation)=>{
                    annotation.title = req.body.title
                    annotation.annotation = req.body.annotation
                    annotation.publication_type = req.body.publication_type
                    annotation.save().then(()=>{
                        req.flash("success_msg", "Anotação editada com sucesso!");
                        res.redirect("/list/annotation");
                    }).catch((error)=>{
                        req.flash("error_msg", "Houve um erro ao salvar edição!");
                        res.redirect("/edit/annotation");
                    });
                }).catch((error)=>{
                    req.flash("error_msg","Houve um erro ao editar anotação!");
                    res.redirect("/edit/annotation");
                });
            }
        });
    // ROTA DE DELETAR ANOTAÇÃO
        router.post("/delete/annotation", user_accepted, (req,res)=>{
            Annotation.remove({_id: req.body.id}).then(()=>{
                req.flash("success_msg", "Anotação deletada com sucesso!");
                res.redirect("/list/annotation");
            }).catch((error)=>{
                req.flash("error_msg", "Houve um erro ao deletar anotação");
                res.redirect("/list/annotation");
            });
        });
    // ROTA DE NOVO REGISTRO
        router.post('/new/registration', (req,res)=>{
            // TRATAMENTO DE ERROS
            var erros = [];
            if (!req.body.name_user || typeof req.body.name_user == undefined ||req.body.name_user == null){
                erros.push({texto: "Usuário inválido"});
            }
            if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
                erros.push({texto: "Senha inválida"});
            }
            if(req.body.password.length < 4){
                erros.push({texto: "Senha muito curta"});
            }
            if(req.body.name_user.length < 4){
                erros.push({texto: "Nome de usuário muito curto"});
            }
            if(req.body.password != req.body.password_compared){
                erros.push({texto: "Senhas imcopatíveis"});
            }
            if(erros.length > 0){
                res.render("user/registration", {erros: erros});
            }else{
                // VERIFICAR SE JÁ NÃO TEM UM USUÁRIO IGUAL NO BANCO DE DADOS
                User.findOne({name_user: req.body.name_user}).then((user) =>{
                    if(user){
                        req.flash("error_msg", "Já existe uma conta com este nome de usuário!");
                        res.redirect("/registration");
                    }else{
                        const new_user = new User({
                            name_user: req.body.name_user,
                            password: req.body.password
                        });
                        // APLICAR O HASH NA SENHA
                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(new_user.password, salt, (erro, hash) =>{
                                if(erro){
                                    req.flash("error_msg", "Houve um erro ao salvar usuário!");
                                    res.redirect("/");
                                }
                                new_user.password = hash
                                new_user.save().then(()=>{
                                    req.flash("success_msg", "Usuário registrado com sucesso!");
                                    res.redirect("/");
                                }).catch((err)=>{
                                    req.flash("error_msg", "Houve um erro ao registrar usuário!");
                                    res.redirect("/registration");
                                });
                            });
                        });
                    }
                });
            }
        });
    // ROTA DE REALIZAR O LOGIN
        router.post("/realizing/login",(req,res,next)=>{
            passport.authenticate('local',{
                successRedirect: "/list/annotation",
                failureRedirect: "/",
                failureFlash: true
            })(req,res,next);
        });

// EXPORTAR O ROUTER
    module.exports = router