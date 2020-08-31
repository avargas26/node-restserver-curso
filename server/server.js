require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    //configuracion global de rutas
app.use(require('./routes/index'));

//Habilitar la carpeta public para que pueda acceder desde cualquier lugar
app.use(express.static(path.resolve(__dirname, '../public')));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;

    console.log('base de datos Online');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto ' + process.env.PORT);
})