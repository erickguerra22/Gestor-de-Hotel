'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var hotelSchema = Schema({
    email:String,
    name:String,
    phone:String,
    location:String,
    hotelCode:String,
    password:String,
    startDate:Date,
    endDate:Date,
    score: Number
});

module.exports=mongoose.model('hotel',hotelSchema);