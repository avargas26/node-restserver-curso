const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();

let Productos = require('../models/producto');

//todos los productos
//populate usuario y categorias
//paginado
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.body.desde || 0;
    desde = Number(desde);

    Productos.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        });
});

//todos los productos por id
//populate usuario y categorias
app.get('/productos/:id', (req, res) => {

});
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Productos.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        });

});
//grabar usuario
//grabar caetoria
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Productos({
        usuario: req.usuario._id,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        nombre: body.nombre
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//actualizar productos por id
app.put('/productos/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let datos = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible
    }
    Productos.findByIdAndUpdate(id, datos, {
        new: true,
        runValidators: true
    }, (err, productosBD) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productosBD) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: productosBD
        });
    });

});

//borrar producto
//cambiar el disponible a false
app.delete('/productos/:id', (req, res) => {

});
module.exports = app;