http://stackoverflow.com/questions/31156884/how-to-use-https-on-node-js-using-express-socket-io



It is hard to test your example without your key and cert files instead I am going to provide an example where I am using Express, socket.io, and https.

First I will create the key and cert files, so inside a directory run the following commands from your terminal:

The command below it is going to generate a file containing an RSA key.

$ openssl genrsa 1024 > file.pem
Here you will be asked to input data but you can leave blank pressing enter until the crs.pem is generated.

$ openssl req -new -key file.pem -out csr.pem
Then a file.crt file will be created containing an SSL certificate.

$ openssl x509 -req -days 365 -in csr.pem -signkey file.pem -out file.crt
So in my app.js file where I am setting and starting the server notice that I am using the files file.pem and file.crt generated in the last step:

var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();

var options = {
	key: fs.readFileSync('./file.pem'),
	cert: fs.readFileSync('./file.crt')
};
var serverPort = 443;

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
	console.log('new connection');
	socket.emit('message', 'This is a message from the dark side.');
});

server.listen(serverPort, function() {
	console.log('server up and running at %s port', serverPort);
});
and then my public/index.html where I am consuming the server:

<!doctype html>
<html>

	<head>

	</head>
	<body>
		<h1>I am alive!!</h1>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.js"></script>

		<script>
			var URL_SERVER = 'https://localhost:443';
			var socket = io.connect(URL_SERVER);

			socket.on('message', function(data) {
				alert(data);
			});
		</script>
	</body>

</html>
then finally if you access from the browser at https://localhost, you will see an alert with a message that is coming from the websocket server.