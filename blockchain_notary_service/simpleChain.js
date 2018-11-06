'use strict';
var SHA256 = require('crypto-js/sha256');
var level = require('level');
var chainDB = './chaindata';
var db = level(chainDB, {valueEncoding: 'json'});


class Block {
	constructor(data){
		this.height = 0;
		this.hash = "";
		this.body = data;
		this.time = 0;
		this.previousBlockHash = "";
	}
} //class Block {


class Blockchain{

	constructor(){
		this.createGenesisBlock();
	}


	createGenesisBlock(){
		this.getBlock(0).catch((reason) => {
			console.log("Genesis Block does not exist, creating one...");
			this.addBlock(new Block("Genesis block"));
		});
	} //createGenesisBlock(){

	addBlock(newBlock){

		return new Promise((resolve, reject) => {

			this.getBlockHeight().then((prev_ht) => {
				
				newBlock.time = new Date().getTime().toString().slice(0,-3);
				newBlock.height = prev_ht + 1;

				if(newBlock.height > 0){
					this.getBlock(newBlock.height-1).then((value) => {
						
						newBlock.previousBlockHash = JSON.parse(value).hash;
						newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
						db.put(newBlock.height, JSON.stringify(newBlock).toString());
						resolve(JSON.stringify(newBlock));

					});
				} else {

					newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
					db.put(newBlock.height, JSON.stringify(newBlock).toString());
					resolve(JSON.stringify(newBlock));

				}

			});
		});

	} //addBlock(newBlock){

	getBlock(height){
		return new Promise((resolve, reject) => {
			db.get(height, function(err, value){
				if(err) reject('Block not found', err);
				resolve(value);
			});
		});


	}

	getBlockHeight(){

		return new Promise((resolve, reject) => {

			let i = 0;
			db.createReadStream()
				.on('data', function(){
					i++;
				})
				.on('close', function(){
					i = i-1;
					resolve(i);
				});

		});

	}

	validateBlock(block_height){

		return new Promise ((resolve, reject) => {

			this.getBlock(block_height).then(() => {

				let block = JSON.parse(value);
				let block_hash = block.hash;
				block.hash = '';
				let valid_block_hash = SHA256(JSON.stringify(block)).toString();
				if(block_hash === valid_block_hash){
					resolve(true);
				} else{
					reject(`Block number ${blockHeight} is not valid`);
				}

			});

		});
	}

	validateChain(){

		var promiseArray = [];
		this.getBlockHeight().then((value) => {

			for (let i = 0; i <= value ; i++) {
				promiseArray.push(this.validateBlock(i))
			}

			Promise.all(promiseArray).then(function(values){
				console.log('The Chain is valid');
			})
			.catch(function(reason){
				console.log('Chain is not valid', reason);
			});

		});

	}


	getBlocks(){
		return new Promise((resolve, reject) =>{
			let output = [];
			db.createValueStream({gt : 0})
				.on('data', function(data){
					// console.log(data);
					output.push(JSON.parse(data));
				})
				.on('end', function(data){
					resolve(output);
				});	
		});
	}


	getBlocksByParam(request){
		return new Promise((resolve, reject) =>{
			let param = Object.keys(request)[0];
			// console.log(param);
			let output = [];
			db.createReadStream()
				.on('data', function(data){
					if (JSON.parse(data.value)[param]===request[param]) {
						output.push(JSON.parse(data.value));
					}
				})
				.on('end', function(data){
					resolve(output);
				});	
		});
	}
}

module.exports = {
	Block : Block,
	Blockchain : Blockchain
}
// --------------------------------------------------------------------------
// Testing

// var bc = new Blockchain();

// db.createReadStream(JSON.parse(data.value).address == '189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx')
// 	.on('data', function(data){
// 		// if (JSON.parse(data.value).body.address=="189DuKEEZTb5QiHov1zdFPTXX66PbJrKCx") {
// 			console.log(data);
// 		// }	
// 		// console.log('key=', data)
// 	})

// (function theLoop (i) {
//   setTimeout(function () {
//   	let blockTest = new Block("Test Block - " + (i+1)); 
//     my_blockchain.addBlock(blockTest);
//     i++;
//     if(i<10) theLoop(i);
//   }, 100);
// })(0)



// bc.getBlock(3).then((value) => {

// 	return console.log(value);
// });

