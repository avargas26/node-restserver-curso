const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categorias');

//todas categoriaz
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                categorias
            })
        })
});

//mostrartar categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

//crear categoria
app.post('/categoria', verificaToken, (req, res) => {
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//upd
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCat = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCat, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//borrar solo administrador puede borrar
//pedir token
app.delete('/categoria/:id', verificaToken, (req, res) => {
    let role = req.usuario.role;
    let id = req.params.id;
    if (role == 'ADMIN_ROLE') {

        Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no se encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                usuario: categoriaDB
            });
        });
    }

});

module.exports = app;