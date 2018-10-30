'use strict';

const Blocks = require('./handlers/blocks.js');


module.exports = [{

	method: 'GET',
	path: '/block/{block_ht}',
	handler: Blocks.find

}, 
{
	method: 'POST',
	path: '/block',
	handler: Blocks.add

}];
