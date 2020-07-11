'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/GestorHoteles2018037', {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log('Conexión a la base de datos realizada con éxito.');
    app.listen(port,()=>{
        console.log('Servidor de express corriendo en el puerto:',port);
    });
}).catch(err=>{
    console.log('Error de conexión.',err);
});