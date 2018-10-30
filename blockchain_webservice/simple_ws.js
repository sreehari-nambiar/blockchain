const http = require('http');
const fs = require('fs');
const port = 3000;

// const filename = 'index.html';

//configure webservice
const app = http.createServer(function (request, response) {
	// body...
	response.writeHead(200, {"Content-Type": "text/html"});
	// response.end(fs.readFileSync(__dirname + "/"+ filename));

	let block = {'height': '0', 'data': '123'};
	response.write(JSON.stringify(block));
	response.end();
});


//notify console
console.log("service started on port 3001");

app.listen(port);