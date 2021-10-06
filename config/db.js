// VERIFICAR SE TA RODANDO A APLICAÇÃO NO HEROKU 
// COM O MONGODB ATLAS OU BANCO DE DADOS LOCAL
    
if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://brunnuscz:pudim0611@grupo-01.pn9mh.mongodb.net/db-noted-here?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/db-noted-here"}
}

