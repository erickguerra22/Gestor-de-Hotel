'use strict'

var User = require('../models/user.model');
var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwtU = require('../services/user.jwt');

function registerUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.username && params.email && params.password && params.name && params.lastname && params.phone && params.nationality) {
        User.findOne({ $or: [{ username: params.username }, { email: params.email }, { phone: params.phone }] }, (err, finded) => {
            if (err) {
                res.status(500).send({ error: 'Error interno en el servidor.', err });
            } else if (finded) {
                res.status(400).send({ message: 'El nombre de usuario, correo electrónico o número de teléfono ingresado ya está en uso.' });
            } else {
                user.name = params.name;
                user.lastname = params.lastname;
                user.phone = params.phone;
                user.nationality = params.nationality;
                user.role = 'USER';
                user.username = params.username;
                user.email = params.email;

                bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                    if (err) {
                        res.status(500).send({ error: 'Error interno al intentar encriptar' });
                    } else if (passwordHashed) {
                        user.password = passwordHashed;

                        user.save((err, userSaved) => {
                            if (err) {
                                res.status(500).send({ error: 'Error interno del servidor.', err });
                            } else if (userSaved) {
                                res.send({ 'Usuario registrado': userSaved });
                            } else {
                                res.status(400).send({ message: 'No ha sido posible registrarse.' });
                            }
                        });
                    } else {
                        res.status(400).send({ message: 'No ha sido posible encriptar la contraseña.' })
                    }
                });
            }
        });
    } else {
        res.status(200).send({ message: 'Debe ingresar todos los datos requeridos.' })
    }
}

function registerAdmin(req, res) {
    var params = req.body;
    var user = new User();

    if (params.username && params.email && params.password && params.name && params.lastname && params.phone && params.nationality) {
        User.findOne({ $or: [{ username: params.username }, { email: params.email }, { phone: params.phone }] }, (err, finded) => {
            if (err) {
                res.status(500).send({ error: 'Error interno en el servidor.', err });
            } else if (finded) {
                res.status(400).send({ message: 'El nombre de usuario, correo electrónico o número de teléfono ingresado ya está en uso.' });
            } else {
                user.name = params.name;
                user.lastname = params.lastname;
                user.phone = params.phone;
                user.nationality = params.nationality;
                user.role = 'ADMIN';
                user.username = params.username;
                user.email = params.email;

                bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                    if (err) {
                        res.status(500).send({ error: 'Error interno al intentar encriptar' });
                    } else if (passwordHashed) {
                        user.password = passwordHashed;

                        user.save((err, userSaved) => {
                            if (err) {
                                res.status(500).send({ error: 'Error interno del servidor.', err });
                            } else if (userSaved) {
                                res.send({ 'Usuario registrado': userSaved });
                            } else {
                                res.status(400).send({ message: 'No ha sido posible registrarse.' });
                            }
                        });
                    } else {
                        res.status(400).send({ message: 'No ha sido posible encriptar la contraseña.' })
                    }
                });
            }
        });
    } else {
        res.send({ message: 'Debe ingresar todos los datos requeridos.' });
    }
}

function editUser(req, res) {
    var userId = req.params.id;
    var actualizar = req.body;
    if (req.user.sub == userId) {
        if (actualizar.password) {
            bcrypt.hash(actualizar.password, null, null, (err, passwordHashed) => {
                if (err) {
                    res.status(500).send({ error: 'Error interno del servidor', err });
                } else if (passwordHashed) {
                    actualizar.password = passwordHashed;
                } else {
                    res.status(400).send({ message: 'Error al encriptar.' });
                }
            });
        }
        User.findById(userId, (err, finded) => {
            if (err) {
                res.status(500).send({ error: 'Error interno en el servidor.', err });
            } else if (finded) {
                if (actualizar.username != finded.username || actualizar.email != finded.email || actualizar.phone != finded.phone) {
                    User.findOne({ $or: [{ username: actualizar.username }, { email: actualizar.email }, { phone: actualizar.phone }] }, (err, finded) => {
                        if (err) {
                            res.status(500).send({ error: 'Error interno del servidor.', err });
                        } else if (finded) {
                            res.status(200).send({ message: 'El nombre de usuario, correo electrónico o número de teléfono ingresado ya está en uso.' });
                        } else {
                            User.findByIdAndUpdate(userId, actualizar, { new: true }, (err, updatedUser) => {
                                if (err) {
                                    res.status(500).send({ error: 'Error interno en el servidor.', err });
                                } else if (updatedUser) {
                                    res.send({ 'Usuario actualizado': updatedUser });
                                } else {
                                    res.status(400).send({ message: 'El usuario no ha sido actualizado.' })
                                }
                            });
                        }
                    })
                } else {
                    User.findByIdAndUpdate(userId, actualizar, { new: true }, (err, updatedUser) => {
                        if (err) {
                            res.status(500).send({ error: 'Error interno en el servidor.', err });
                        } else if (updatedUser) {
                            res.send({ 'Usuario actualizado': updatedUser });
                        } else {
                            res.status(400).send({ message: 'El usuario no ha sido actualizado.' })
                        }
                    });
                }
            } else {
                res.status(400).send({ message: 'Usuario no encontrado.' })
            }
        });
    } else {
        res.send({ message: 'El id ingresado no corresponde con el usuario accesado.' })
    }
}

function deleteUser(req, res) {
    var userId = req.params.id;
    if (req.user.sub == userId) {
        User.findByIdAndDelete(userId, (err, deletedUser) => {
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor.', err });
            } else if (deletedUser) {
                res.send({ message: 'Registro eliminado con éxito.' });
            } else {
                res.status(400).send({ message: 'Registro no eliminado.' });
            }
        });
    } else {
        res.send({ message: 'El id ingresado no corresponde con el usuario accesado.' })
    }
}

function listUsers(req, res) {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor.', err });
        } else if (users != '') {
            res.send({ 'Usuarios registrados': users });
        } else {
            res.status(404).send({ message: 'No hay datos para mostrar.' });
        }
    });
}

function login(req, res) {
    var params = req.body;

    if (params.username || params.email) {
        if (params.password) {
            User.findOne({ $or: [{ username: params.username }, { email: params.email }] }, (err, check) => {
                if (err) {
                    res.status(500).send({ error: 'Error interno del servidor', err });
                } else if (check) {
                    bcrypt.compare(params.password, check.password, (err, passwordOk) => {
                        if (err) {
                            res.status(500).send({ error: 'Error al comparar', err });
                        } else if (passwordOk) {
                            if (params.gettoken = true) {
                                res.send({ token: jwtU.createToken(check) });
                            } else {
                                res.send({ message: 'Bienvenido', user: check });
                            }
                        } else {
                            res.send({ message: 'Contraseña incorrecta' });
                        }
                    });
                } else {
                    res.send({ message: 'Datos de usuario incorrectos' });
                }
            });
        } else {
            res.send({ message: 'Debes ingresar tu contraseña.' })
        }
    } else {
        res.send({ message: 'Debes ingresar tu correo electrónico o tu username' });
    }
}

function searchHotel(req,res){
    var params = req.body;
    var orderBy;
    if(params.orden==0){
        orderBy={name:1};
    }else if(params.orden==1){
        orderBy={name:-1};
    }else if(params.orden==2){
        orderBy={score:1};
    }else if(params.orden==3){
        orderBy={score:-1};
    }else{
        orderBy='';
    }

    if(params.startDate&&params.endDate){
        Hotel.find({startDate:{$lte:params.startDate},endDate:{$gte:params.endDate}},(err,finded)=>{
            if(err){
                res.status(500).send({error:'Error interno del servidor.',err});
            }else if(finded){
                res.send({'Hoteles disponibles':finded});
            }else{
                res.send({message:'No se han encontrado resultados.'});
            }
        }).sort(orderBy);
    }else if(params.score){
        Hotel.find({score:params.score},(err,finded)=>{
            if(err){
                res.status(500).send({error:'Error interno del servidor.',err});
            }else if(finded){
                res.send({'Hoteles disponibles':finded});
            }else{
                res.send({message:'No se han encontrado resultados.'});
            }
        }).sort(orderBy);
    }else{
        res.send({message:'Debe ingresar parámetros de búsqueda correctos.'})
    }
}

module.exports = {
    registerUser,
    editUser,
    deleteUser,
    registerAdmin,
    listUsers,
    login,
    searchHotel
}