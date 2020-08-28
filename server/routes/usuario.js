const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
})

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //ESTO ES UN CALLBACK
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //elimina el valor de retorno
        //usuarioDB.password = null;
        usuarioDB.password = undefined
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let id = req.params.id;
    /*esta es na forma de eliminar los campos k no se deben actualizar
    delete body.password;
    delete body.google;
    */
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let cambiarEstado = {
        estado: false
    };
    let id = req.params.id;
    //eliminar registro de la bd
    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });*/
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;