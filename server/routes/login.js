const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const app = express();

app.post('/login', function(req, res) {
    let body = req.body;

    usuario.findOne({ email: body.email }, (err, usuaurioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuaurioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuaurioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }
        usuaurioDB.password = undefined;
        let token = jwt.sign({
            usuario: usuaurioDB,

        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuaurioDB,
            token
        })
    });
});

module.exports = app;