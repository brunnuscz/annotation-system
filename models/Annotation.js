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
    publication_type:{
        type: String,
        require: true
    },
    user_name:{
        type: String,
        required: true
    },
    id_user: {
        // É A FORMA QUE O MONGO GRAVA O ID NO BANCO DE DADOS
        type: Schema.Types.ObjectId,
        // REFERÊNCIAR QUAL É MODEL
        ref: 'User',
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    } 
});
// CRIANDO O DOCUMENTO "TABELA"
mongoose.model("annotations", Annotation);