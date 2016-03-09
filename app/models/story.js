//in the homepage, we can create a new story and save it to database.

//Create story schema


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StorySchema = new Schema({

	//mongoDB will self generate the _id of a specific schema
	//Schema.Types.ObjectId
	creator: { type: Schema.Types.ObjectId, ref: 'User'},
	content: String,
	created: {type: Date, defauly: Date.now}

});

//export the story object so we can use it later
module.exports = mongoose.model('Story', StorySchema);

