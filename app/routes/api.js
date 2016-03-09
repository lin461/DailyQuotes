//API

//require package 
var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');

//get the secret key to be used in the login later on.
var secretKey = config.secretKey;


// use json web token to create token
function createToken(user) {
	
	var token = jsonwebtoken.sign({

		// decode id, name, username
		// don't decode password for security
		id: user._id,
		name: user.name,
		username: user.username

	}, secretKey, { // use secret key to decode token and prevent easy hacking
		expirtesInMinute: 1440 // 24 hours
	});


	return token;

}


//API
module.exports = function(app, express, io) {
	
	var api = express.Router();

	api.get('/all_stories', function(req,res) {
		Story.find({}, function(err, stories) {

			if(err) {
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});

	
	// Sign up API
	// api.post to post data to Server
	// localhost:3000/api/signup
	api.post('/signup', function(req, res) {
		
		//User from user.js
		// .body is the body-parser, 
		//so we can read the value on the website.
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		// encode user information via token 
		var token = createToken(user);

		//save to database
		user.save(function(err) {
			if (err) {
				res.send(err);
				return;
			} 

			//if no error, get a response by json.
			res.json({ 

				success: true,
				message: 'User has been created!',
				token: token

			});
		});
	});


	// api.get to fetch the users from database
	// localhost:3000/api/users
	api.get('/users', function(req,res) {

		// find is a mongoose method to find every user object in database 
		User.find({}, function(err, users) {
			if (err) {
				res.send(err);
				return;
			}
			//if no error
			res.json(users);
			//get all users in the database
		});

	});

	// Login API
	// localhost:3000/api/login
	api.post('/login', function(req, res) {

		// findOne: find a specific object in database
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if (err) throw err;

			if (!user) {
				res.send({ message: "User doesn't exist"});
			}
			else if (user) {

				// if user exist, check password 
				var validPassword = user.comparePassword(req.body.password);

				if (!validPassword) {

					res.send({ message: "Invalid Password"});

				} else {
					//token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfully login!",
						token: token
					});
				}
			}

		});

	});

	//middleware is like a police officer who verify your token
	//depend where you put your middleware
	//Everything above the Middleware is destination A.
	//Eveything below is destination B, where we want to go to.
	//put this Middleware after user login

	//Middleware 
	api.use(function(req, res, next) {

		console.log("Somebody just came to our app!");

		// fetch the token from where you store the token (from the body or the headers)
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		//check if a token exists
		if (token) {

			//verify the token, i.e., the police officer
			jsonwebtoken.verify(token, secretKey, function(err, decoded){

				if (err) {
					res.status(403).send({success: false, message: "Failed to authenticate user"});

				} else {
					//if no error
					//decode the information in the token
					//go to next
					req.decoded = decoded;

					next();

				}

			});
		} else {
			// if a token doesn't exist
			res.status(403).send({success: false, message: "No Token Provided"});
		}

	});

	// after middleware
	// In order to go to Destination B, we need to provide a legitimate token
	// to pass the middleware


	// use a chaining method to do multiple http methods on one route.
	// chain a new message, no ';' 
	api.route('/')

		.post(function(req,res) {

			var story = new Story ({

				// since already req.decoded in the middleware
				creator: req.decoded.id,
				content: req.body.content,

			});

			//save the value to database
			story.save(function(err, newStory) {

				if (err) {
					res.send(err);
					return;
				}
				io.emit('story', newStory)
				res.json({message: "New Story Created!"});
			});

		}) //chain a new message, no ';' 

		.get(function(req, res) {

			//find all stories created by this user
			Story.find({ creator: req.decoded.id }, function(err, stories) {


				if (err) {
					res.send(err);
					return;
				}

				res.send(stories);
			});

		}); // ';' ending of the chaining method


	// in order to get req.decoded in the middleware when we build the front-end
	// make a seperate API to get it 
	api.get('/me', function(req, res) {

		res.send(req.decoded);
	});



	return api;

}