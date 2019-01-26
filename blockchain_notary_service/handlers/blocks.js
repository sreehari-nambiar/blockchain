'use strict';

const Boom = require("boom")
const SimpleChain = require('../simpleChain.js')
const userSession = require('../userSession.js')
let bc = new SimpleChain.Blockchain()


exports.find = function(request, h) {

    return bc.getBlock(request.params.block_ht)
        .then((value) => {
            let newValue = JSON.parse(value);
            newValue.body.star['storyDecoded'] = new Buffer(newValue.body.star.story, 'hex').toString();
            return newValue;
        })
        .catch((reason) => {
            throw Boom.notFound(`Blocks ${request.params.block_ht} not found`)
        });

}



exports.add = function(request, h) {

    if (request.payload['address'].trim().length != 34) {
        throw Boom.badData('Enter valid wallet address')
    } else if (isEmpty(request.payload['star'])) {
        throw Boom.badData('Enter valid information about star')
    } else if (request.payload['star']['ra'].trim().length == 0) {
        throw Boom.badData('Right Ascension is required')
    } else if (request.payload['star']['dec'].trim().length == 0) {
        throw Boom.badData('Declination is required')
    } else if (request.payload['star']['story'].length == 0) {
        throw Boom.badData('star story is required')
    } else if (request.payload['star']['story'].length > 250) {
        throw Boom.entityTooLarge('Star story too long, only 250 characters allowed')
    } else if (!(encodeStory(request.payload['star']['story']))) {
        throw Boom.badData('Only ASCII Charatcers supported in story')
    } else {
        //new changes
        let session = userSession.checkSession(request.payload['address']);
        return session.then((value) => {
            if (!(value === false)) {
                if (value.messageSignature === "valid") {
                    let story = Buffer.from(request.payload.star.story, 'ascii');
                    // encodeStory(request.payload.star.story);
                    if (story.length > 500) {
                        throw Boom.entityTooLarge("Story too large to be stored in a Block, must be less than 500 bytes")
                    } else {
                        request.payload.star.story = story.toString('hex');
                        // if(!(request.payload.star.story == false)){
                        return bc.addBlock(new SimpleChain.Block(request.payload))
                            .then((value) => {
                                userSession.endSession(request.payload['address']);
                                return JSON.parse(value);
                            })
                    }
                } else {
                    throw Boom.preconditionFailed("address not valid, please sign and validate")
                }
            } else {
                throw Boom.unauthorized("Sesion expired, login again to register your star")
            }
        });
        //end of new changes
    }

}

exports.getByAddress = function(request, h) {
    return bc.getBlocks(request.params)
        .then((value) => {
            console.log(typeof(value))
            let block_by_address = value.filter(block => block.body.address === request.params["address"]);
            console.log(typeof(block_by_address))
            block_by_address.forEach((block) => {
                block.body.star['storyDecoded'] = new Buffer(block.body.star.story, 'hex').toString();
            })
            return block_by_address;
        });
}

exports.getByHash = function(request, h) {
    return bc.getBlocks()
        .then((value) => {
            let block_by_hash = value.filter(block => block.hash === request.params["hash"])[0];
            block_by_hash.body.star['storyDecoded'] = new Buffer(block_by_hash.body.star.story, 'hex').toString();
            return block_by_hash;
        });
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function encodeStory(input) {
    if (/^[\x00-\x7F]*$/.test(input)) {
        // return new Buffer(input).toString('hex');
        return true;
    } else {
        return false;
    }
}