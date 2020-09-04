const mongoose = require('mongoose');
const usuario = require('./usuario');


let Schema = mongoose.Schema;
let categoriasSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, "La descripción es necesaria"],
        unique: true
    },
    usuario: {
        type: String,
        default: 0,
        //ref: 'UsuarioModel',//Debería funcionar
        ref: usuario
    }
});

categoriasSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();
    return categoriaObject;
}

module.exports = mongoose.model('Categorias', categoriasSchema);