'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clav3_5up3r_53cr37a_h073l';

exports.createToken = (hotel) => {
    var payload = {
        sub: hotel._id,
        email: hotel.email,
        name: hotel.name,
        phone: hotel.phone,
        location: hotel.location,
        hotelCode: hotel.hotelCode,
        iat: moment().unix(),
        exp:moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload,key);
}