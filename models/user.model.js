'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = Schema({
    username:String,
    email:String,
    password:String,
    name:String,
    lastname:String,
    phone:String,
    nationality:String,
    role:String
});

module.exports=mongoose.model('user',userSchema);