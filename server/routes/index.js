const express = require('express');
const app = express();

//rutas
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./productos'));
app.use(require('./upload'));
app.use(require('./imagenes'));


module.exports = app;