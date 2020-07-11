'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/registerUser', userController.registerUser);
api.put('/editUser/:id', mdAuth.ensureAuth, userController.editUser);
api.delete('/deleteUser/:id', mdAuth.ensureAuth, userController.deleteUser);
api.post('/registerAdmin',userController.registerAdmin);
api.get('/listUsers', mdAuth.ensureAuthAdmin, userController.listUsers);
api.get('/login', userController.login);
api.post('/searchHotel',mdAuth.ensureAuth,userController.searchHotel);

module.exports = api;