var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

UserSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
        this.password = hash;
      });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;
