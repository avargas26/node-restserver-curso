// PUERTO
process.env.PORT = process.env.PORT || 3000;

//entornos
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:HXd6GnkeRwskGetv@cluster0.dmisp.mongodb.net/cafe';
}
//vencimiento del token
//60 segundo segundo
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//seed de autentifiacion
process.env.SEED = process.env.SEED || 'ESTE-ES-EL-SEED-DEV';
process.env.URLDB = urlDB;

//google client
process.env.CLIENT_ID = process.env.CLIENT_ID || '1001717417835-ots6lbvcgj54actvqqcosasnb9m41epe.apps.googleusercontent.com';