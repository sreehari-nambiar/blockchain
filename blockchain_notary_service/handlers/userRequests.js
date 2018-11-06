'use strict';

const userSession = require('../userSession.js');

exports.createSession = function(request, h){
	// Creates a user session for 5 minutes by logging in levelDB
	console.log("request for a new session....");
	//console.log(request.payload);
	if(request.payload.address.trim().length != 34){
		return 'Enter valid wallet address'
	} else{
		var address = request.payload.address;
		console.log(`rquest ${address}`);
		return userSession.createSession(address).then((value) => {
			if(value == false){
				return 'valdation window over, register again';
			}else{
				return value;
			}
		});
		// .catch((reason) => {return reason});
	}
}


exports.validateSignature = function(request, h){
	if(('signature' in request.payload) && ('address' in request.payload)){
		if(request.payload['signature'].trim().length !== 0 && request.payload['address'].trim().length !== 0){
			return userSession.validateSignature(request.payload)
			.then((value) => { return value});
			// .catch((reason) => {return reason});
		} else{
			return "Invalid Request: Either 'address' or 'signature' is missing";
		}
	} else{
		return "Invalid Request: Both 'address' and 'signature' are required for validation";
	}
}
