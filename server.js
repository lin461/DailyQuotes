var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config'); // use ./ since config is in the same directory.
var mongoose = require('mongoose'); // require mongoose package to connect to database mongoDB.
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http); // add socket.io for real-time between web clients and servers.

//connection to database
mongoose.connect(config.database, function(err) {
	if (err) {
		console.log(err);
	} else{
		console.log("Connected to the database");
	}
});

//add some middleware (app.use())
//set extended to false will only parse a string.
//true: any value vedio, images etc.  
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// any file in the public folder will be rendered if requested. (by index.html)
app.use(express.static(__dirname + '/public')); 


//for sign-up api from api.js
//so we can use Localhost:3000/api/...
var api = require('./app/routes/api')(app, express, io);
app.use('/api', api);


//'*' : any route that responses to this file.
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html'); // always go to index.html 

});

// listen on port
http.listen(config.port, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000");
	}
});