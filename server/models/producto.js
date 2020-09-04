var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const usuario = require('./usuario');
const categoria = require('./categorias');

var productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: categoria,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: usuario
    }
});


module.exports = mongoose.model('Producto', productoSchema);