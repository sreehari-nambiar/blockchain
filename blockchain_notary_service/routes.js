'use strict';

const Blocks = require('./handlers/blocks.js');
const UserRequests = require('./handlers/userRequests.js')

module.exports = [
{
	method: 'GET',
	path: '/block/{block_ht}',
	handler: Blocks.find
}, 
{
	method: 'GET',
	path: '/stars/address:{address}',
	handler: Blocks.getByAddress
},
{
	method: 'GET',
	path: '/stars/hash:{hash}',
	handler: Blocks.getByHash
},
{
	method: 'POST',
	path: '/block',
	handler: Blocks.add
},
{
	method: 'POST',
	path: '/requestValidation',
	handler: UserRequests.createSession
},
{
	method: 'POST',
	path: '/message-signature/validate',
	handler: UserRequests.validateSignature
},
];