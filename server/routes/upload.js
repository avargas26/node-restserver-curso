const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Productos = require('../models/producto');
const fs = require('fs');
const path = require('path');
const app = express();

//default options
app.use(fileUpload());



app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: 'No files seleccionado '
        });
    }
    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(',')
            }
        });
    }

    let archivo = req.files.archivo;
    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensioens permitidas son ' + extensionesValidas.join(','),
                ext: extension
            }
        });
    }
    //cambiar nombre archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Aqui, imagen cargada!!!
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            });
        }
        borraArchivo(usuarioBD.img, 'usuarios');


        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

function imagenProducto(id, res, nombreArchivo) {
    Productos.findById(id, (err, productoBD) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            });
        }
        borraArchivo(productoBD.img, 'productos');


        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}
module.exports = app;