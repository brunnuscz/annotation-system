const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name_user:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    } 
});
// CRIANDO O DOCUMENTO "TABELA"
mongoose.model("users", User);