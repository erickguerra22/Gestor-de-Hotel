'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/registerHotel',mdAuth.ensureAuthAdmin,hotelController.registerHotel);
api.put('/editHotel/:id',mdAuth.ensureAuthHotel,hotelController.editHotel);
api.delete('/deleteHotel/:id',mdAuth.ensureAuthHotel,hotelController.deleteHotel);
api.get('/login',hotelController.login);

module.exports=api;