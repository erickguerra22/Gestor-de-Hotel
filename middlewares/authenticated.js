'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var keyU = 'clav3_5up3r_53cr37a_u5uar10';
var keyH = 'clav3_5up3r_53cr37a_h073l';

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'Petición sin autenticación' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, keyU);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: 'Token expirado' });
            }
        } catch (ex) {
            return res.status(404).send({ message: 'Token no válido.' });
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'Petición sin autenticación' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, keyU);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: 'Token expirado' });
            } else if (payload.role != 'ADMIN') {
                return res.status(401).send({ message: '¡Acceso denegado!' });
            }
        } catch (ex) {
            return res.status(404).send({ message: 'Token no valido' })
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthHotel = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'Petición sin autenticación' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, keyH);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: 'Token expirado' });
            }
        }catch(ex){
            return res.status(404).send({message:'Token no válido'});
        }

        req.hotel = payload;
        next();
    }
}