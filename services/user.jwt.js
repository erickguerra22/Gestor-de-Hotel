'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clav3_5up3r_53cr37a_u5uar10';

exports.createToken = (user) => {
    var payload = {
        sub:user._id,
        username : user.username,
        email : user.email,
        name: user.name,
        lastName: user.lastname,
        phone: user.phone,
        nationality: user.nationality,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(15,"minutes").unix()
    }
    return jwt.encode(payload,key);
}