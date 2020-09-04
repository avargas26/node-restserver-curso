const express = require('express');
const app = express();

//rutas
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categorias'));
app.use(require('./productos'));


module.exports = app;