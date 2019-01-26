'use strict';

const Boom = require("boom")
const userSession = require('../userSession.js');

exports.createSession = function(request, h) {
    if (request.payload.address.trim().length != 34) {
        throw Boom.badRequest('Enter valid wallet address')
    } else {
        var address = request.payload.address;
        return userSession.createSession(address).then((value) => {
            if (value == false) {
                throw Boom.unauthorized('valdation window over, register again');
            } else {
                return value;
            }
        });
    }
}


exports.validateSignature = function(request, h) {
    if (('signature' in request.payload) && ('address' in request.payload)) {
        if (request.payload['signature'].trim().length !== 0 && request.payload['address'].trim().length !== 0) {
            return userSession.validateSignature(request.payload)
                .then((value) => { return value });;
        } else {
            throw Boom.badRequest("Invalid Request: Either 'address' or 'signature' is missing")
        }
    } else {
        throw Boom.badRequest("Invalid Request: Both 'address' and 'signature' are required for validation")
    }
}