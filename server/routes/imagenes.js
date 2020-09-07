const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificaTokenImg } = require('../middlewares/autenticacion');
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        //lee el contextype sendfile
        res.sendFile(pathImg);
    } else {
        let noImagen = path.resolve(__dirname, '../assets/no-image.jpg');
        //lee el contextype sendfile
        res.sendFile(noImagen);
    }

});
module.exports = app;