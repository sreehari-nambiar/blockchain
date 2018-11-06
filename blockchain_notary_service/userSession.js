'use strict';

const bitcoinMessage = require('bitcoinjs-message');
var level = require('level');
var userDB = './userData';
var uDB = level(userDB, {valueEncoding: 'json'});
const sessionValidity = 300; //5 minutes

class User {
	constructor(address){
		this.address = address;
		this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
		this.message = address + ':' + this.requestTimeStamp + ':starRegistry';
		this.validationWindow = sessionValidity;
	}
}

function createSession(address){
	return new Promise((resolve, reject) => {
		resolve(checkSessionValidity(address)
		.then((value)=> {
							return value
						}))
	});
}


function validateSignature(message){
	return new Promise((resolve, reject) => {
		console.log(message);
		resolve(checkSessionValidity(message.address)
		.then((value) => {
			let newValue = {};
			if (!(value == false)){
				let msg = value.message;
				console.log("verifying user....")
				console.log(msg);
				if(bitcoinMessage.verify(msg, message.address, message.signature)){
					newValue["registerStar"] = "true";
					value["messageSignature"] = "valid";
				} else{
					newValue["registerStar"] = "false";
					value["messageSignature"] = "invalid";
				}
				newValue["status"] = value;
				console.log(newValue);
				uDB.put(message.address, JSON.stringify(value).toString());
				return newValue;
			} else{
				return "Invalid user session, please register";
			}
		}))
	});
}


function checkSessionValidity(address){
	return new Promise((resolve, reject) => {
		uDB.get(address, function(err, value){
			if(err){
				console.log("Creating user Session...");
				let user = new User(address);
				uDB.put(address, JSON.stringify(user).toString());
				console.log(JSON.stringify(user));
				resolve(user);	
			}else{
				let session = JSON.parse(value);
				let actualTimeStamp = session.requestTimeStamp;
				session.validationWindow = sessionValidity - (new Date().getTime().toString().slice(0,-3) - actualTimeStamp);
				if(session.validationWindow <= 0){
					console.log('valdation window over, register again...');
					endSession(session.address);
					resolve(false);
					// reject('valdation window over, register again...');
				}else{
					uDB.put(session.address, JSON.stringify(session).toString());
					resolve(session);
				}			
			}
		});	
	});		
}

function endSession(address){
		uDB.del(address, function (err){
			if(err) resolve('No key');
			return console.log('user session ended');
		});
}

module.exports = {
	User : User,
	createSession: createSession,
	checkSession : checkSessionValidity,
	validateSignature : validateSignature,
	endSession: endSession,
}

