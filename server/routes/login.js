const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//CONFIGURACIONES DE GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    usuario.findOne({ email: googleUser.email }, (err, usuaurioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuaurioDB) {
            if (usuaurioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usuar su autentificación normal'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuaurioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuaurioDB,
                    token
                });
            }
        } else {
            // si el usuarion no existe en bd
            let users = new usuario();
            users.nombre = googleUser.nombre;
            users.email = googleUser.email;
            users.img = googleUser.img;
            users.google = true;
            users.password = ':)';

            users.save((err, usuaurioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({
                    usuario: usuaurioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuaurioDB,
                    token
                });
            });
        }
    });

});
module.exports = app;