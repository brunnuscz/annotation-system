const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Annotation = new Schema({
    title:{
        type: String,
        required: true
    },
    annotation:{
        type: String,
        required: true
    },
    user_name:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    } 
});
// CRIANDO O DOCUMENTO "TABELA"
mongoose.model("annotations", Annotation);