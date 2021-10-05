// CARREGANDO MÓDULOS
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const user = require("./routes/user");
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    const passport = require('passport');
    require("./config/auth")(passport);
    // const db = require('./config/db');
// CONFIGURAÇÕES
    // SESSION
        app.use(session({
            secret: "annotationforever",
            resave: true,
            saveUninitialized: true
        }));
    // CONFIGURANDO PASSPORT
        app.use(passport.initialize()); 
        app.use(passport.session());
    // FLASH
        app.use(flash());
    // MIDDLEWARES
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next();
    });
    // BODY PARSER
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    // HANDLEBARS
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    // MONGOOSE
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/annotation-system',{
            userNewUrlParser: true,
            useUnifiedTopology: true
        });
    // PUBLIC
        app.use(express.static(path.join(__dirname,"public")));
        
// ROTAS
    // ROTA INICIAL
        app.get('/',(req,res)=>{
            res.render("index");
        });
        
        app.use('', user);

// OUTROS
    const porta = process.env.PORT ||8081;
    app.listen(porta, function(){
        console.log("Servidor Rodando na porta: "+porta);
    });