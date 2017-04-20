var mongoose = require('mongoose');

var database = process.env_MONGO_URL || 'mongodb://localhost/shortly';
mongoose.connect(database);

var db = mongoose.connection;
module.exports = db;
