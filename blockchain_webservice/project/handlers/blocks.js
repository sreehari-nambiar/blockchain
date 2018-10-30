'use strict';

const SimpleChain = require('../simpleChain.js');
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


exports.add = function(request, h){
	if (request.payload['body'].trim().length === 0)  {
		return 'Bad Data, provide proper block data';
	} else {
		// return request.payload['body'].trim().length;
		return bc.addBlock(new SimpleChain.Block(request.payload['body'])).
		then((value) => {
			return JSON.parse(value);
		})
		.catch( (reason) => {
			return reason;
		});
	}
	
	//return('Good data');
	
}
