//Create user schema

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema ({

	//mongoDB will self generate the _id of a specific schema
	
	//required must be true
	//username must be unique
	//password can't be selected when we query a user later on
	name: String,
	username: {type: String, required: true, index: { unique: true }},
	password: {type: String, required: true, select: false}
});

//handle password hashing using 'bcrypt-nodejs' 
UserSchema.pre('save', function(next) {

	var user = this;

	if (!user.isModified('password')) 
		return next();

	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);
		
		user.password = hash;
		next();
	});
});

//a custom method to compare the input password with password in database
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
}

//export this user object so that we can use it later in our API.
module.exports = mongoose.model('User', UserSchema);