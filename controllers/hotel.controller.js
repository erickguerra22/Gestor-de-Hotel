'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwtH = require('../services/hotel.jwt');

function hotelCode(randomNumber) {
    var counter = 0;

    while (counter = 0) {
        Enterprise.findOne({ businessCode: randomNumber }, (err, find) => {
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (find) {
                randomNumber = Math.floor(Math.random() * 100000000);
            } else {
                randomNumber = randomNumber;
                counter++;
            }
        });
    }
    return randomNumber;
}

function registerHotel(req, res) {
    var hotel = new Hotel();
    var params = req.body;

    if (params.email && params.name && params.phone && params.location && params.password&&params.score&&params.startDate&&params.endDate) {
        Hotel.findOne({ $or: [{ email: params.email }, { phone: params.phone }] }, (err, finded) => {
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (finded) {
                res.send({ message: 'El correo electrónico o número de teléfono ingresados ya están asignados' });
            } else {
                hotel.email = params.email;
                hotel.name = params.name;
                hotel.location = params.location;
                hotel.phone = params.phone;
                hotel.score = params.score;
                hotel.startDate = new Date(params.startDate);
                hotel.endDate = new Date(params.endDate);
                hotel.hotelCode = hotelCode(Math.floor(Math.random() * 1000000));

                bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                    if (err) {
                        res.status(500).send({ error: 'Error interno del servidor.', err });
                    } else if (passwordHashed) {
                        hotel.password = passwordHashed;

                        hotel.save((err, savedHotel) => {
                            if (err) {
                                res.status(500).send({ error: 'Error interno del servidor.', err });
                            } else if (savedHotel) {
                                res.send({ 'Hotel registrado': savedHotel });
                            } else {
                                res.status(400).send({ message: 'Error al guardar el registro.' });
                            }
                        })
                    } else {
                        res.status(400).send({ message: 'Error al encriptar la contraseña.' });
                    }
                });
            }
        });
    } else {
        res.status(400).send({ message: 'Debe ingresar todos los datos requeridos.' });
    }
}

function editHotel(req, res) {
    var hotelId = req.params.id;
    var actualizar = req.body;

    if (req.hotel.sub == hotelId) {
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

        if (actualizar.hotelCode) {
            res.status(400).send({ message: 'No está autorizado para cambiar el código del Hotel.' });
        } else {

            Hotel.findById(hotelId, (err, finded) => {
                if (err) {
                    res.status(500).send({ error: 'Error interno en el servidor.', err });
                } else if (finded) {
                    if (actualizar.email != finded.email || actualizar.phone != finded.phone) {
                        Hotel.findOne({ $or: [{ phone: actualizar.phone }, { email: actualizar.email }] }, (err, finded) => {
                            if (err) {
                                res.status(500).send({ error: 'Error interno del servidor.', err });
                            } else if (finded) {
                                res.status(200).send({ message: 'El correo electrónico o número de teléfono ingresado ya está en uso.' });
                            } else {
                                Hotel.findByIdAndUpdate(hotelId, actualizar, { new: true }, (err, updatedHotel) => {
                                    if (err) {
                                        res.status(500).send({ error: 'Error interno en el servidor.', err });
                                    } else if (updatedHotel) {
                                        res.send({ 'Hotel actualizado': updatedHotel });
                                    } else {
                                        res.status(400).send({ message: 'El hotel no ha sido actualizado.' })
                                    }
                                });
                            }
                        });
                    } else {
                        Hotel.findByIdAndUpdate(hotelId, actualizar, { new: true }, (err, updatedHotel) => {
                            if (err) {
                                res.status(500).send({ error: 'Error interno en el servidor.', err });
                            } else if (updatedHotel) {
                                res.send({ 'Usuario actualizado': updatedHotel });
                            } else {
                                res.status(400).send({ message: 'El usuario no ha sido actualizado.' })
                            }
                        });
                    }
                } else {
                    res.status(400).send({ message: 'Hotel no encontrado.' })
                }
            });
        }
    } else {
        res.send({ message: 'El id ingresado no corresponde con el hotel accesado.' })
    }
}

function deleteHotel(req, res) {
    var hotelId = req.params.id;

    if (req.hotel.sub == hotelId) {
        Hotel.findByIdAndDelete(hotelId, (err, deleted) => {
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (deleted) {
                res.send({ message: 'Registro eliminado exitosamente' });
            } else {
                res.status(400).send({ message: 'No ha sido posible eliminar el registro' });
            }
        });
    }else {
        res.send({ message: 'El id ingresado no corresponde con el hotel accesado.' })
    }
}

function login(req, res) {
    var params = req.body;

    if (params.hotelCode || params.email) {
        if (params.password) {
            Hotel.findOne({ $or: [{ hotelCode: params.hotelCode }, { email: params.email }] }, (err, check) => {
                if (err) {
                    res.status(500).send({ error: 'Error interno del servidor', err });
                } else if (check) {
                    bcrypt.compare(params.password, check.password, (err, passwordOk) => {
                        if (err) {
                            res.status(500).send({ error: 'Error al comparar', err });
                        } else if (passwordOk) {
                            if (params.gettoken = true) {
                                res.send({ token: jwtH.createToken(check) });
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
        res.send({ message: 'Debes ingresar el correo electrónico o código de empresa.' });
    }
}

module.exports = {
    registerHotel,
    editHotel,
    deleteHotel,
    login
}