'use strict';
// console.log('test');

const Hapi = require('hapi');

//create a server running on port 8000

const server = Hapi.server({ port: 8000 });


// Routes
server.route(require('./routes'));

//Start the server
async function start() {

    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();