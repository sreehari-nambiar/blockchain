'use strict';

const SimpleChain = require('../simpleChain.js');
const userSession = require('../userSession.js');
let bc = new SimpleChain.Blockchain();


exports.find = function(request, reply){

	return bc.getBlock(request.params.block_ht).
	then((value) => {
		return JSON.parse(value);
	})

	.catch((reason) => {
		return `Block ${request.params.block_ht} not found`;
	});

}

exports.add1 = function(request, h){
	request.payload.star.story =  encodeStory(request.payload.star.story);
	return request.payload;
}

exports.add = function(request, h){
	if (request.payload['address'].trim().length != 34){
		return 'Enter valid address';
	} else if (isEmpty(request.payload['star'])){
		return 'Enter valid information about star';
	} else if (request.payload['star']['ra'].trim().length == 0 ){
		return 'Enter Right Ascension';
	} else if (request.payload['star']['dec'].trim().length == 0 ){
		return 'Enter Declination';
	} else if (request.payload['star']['story'].length == 0 ){
		return 'Enter your star story';
	} else if (request.payload['star']['story'].length > 250){
		return 'Star story too long, only 250 characters allowed';
	} else {
		//new changes
		let session = userSession.checkSession(request.payload['address']);
		console.log("checking session.....");
		return session.then((value) => {
			console.log(value);
			if(!(value === false)){
				if(value.messageSignature === "valid"){
					console.log(`registerStar:  ${value.registerStar}`);
					request.payload.star.story =  encodeStory(request.payload.star.story);
					if(new Buffer(request.payload.star.story).length > 500){
						return "Story too large to be stored in a Block, must be less than 500 bytes";
					}
					if(!(request.payload.star.story == false)){
						return bc.addBlock(new SimpleChain.Block(request.payload))
						.then((value) => {
							userSession.endSession(request.payload['address']);
							return JSON.parse(value);
						}) 
						// .catch((reason) => {
						// 	return reason;
						// })
					} else{
						return "invalid star story";
					}
				} else{
					return "address not valid, please sign and validate";
				}
			} else {
				console.log("invalid session...");
				return 'Sesion expired, login again to register your star';
			}
		});
		//end of new changes
	}
	
}

exports.getByAddress = function(request, h) {
	return bc.getBlocks(request.params)
		.then((value) => {
			console.log(request.params["address"]);
			return value
					.filter(block => block.body.address==request.params["address"]);
		});
}

exports.getByHash = function(request, h) {
	return bc.getBlocks()
		.then((value) => {
			return value.filter(block => block.hash ===request.params["hash"])[0];
			//return value[0];
		});
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function encodeStory(input) {
  if(/^[\x00-\x7F]*$/.test(input)){
  	return new Buffer(JSON.stringify(input)).toString('hex');
  } else {
  	return false;
  }
}

exports.getBlocks1 = function(request, reply){

	let story =  encodeStory(request.payload.star.story);
	if(new Buffer(story).length > 500){
		return "too large";
	} else { 
		return new Buffer(story).length ;
	}

}