// VERIFICAR SE TA RODANDO A APLICAÇÃO NO HEROKU 
// COM O MONGODB ATLAS OU BANCO DE DADOS LOCAL
    if(process.env.NODE_ENV == "production"){
        module.exports = {mongoURI: "mongodb://brunnuscz:<pudim0611>@grupo.odaru.mongodb.net/annotation-system?retryWrites=true&w=majority"}
    }else{
        module.exports = {mongoURI: "mongodb://localhost/annotation-system"}
    }

