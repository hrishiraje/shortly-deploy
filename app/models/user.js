// var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/shortly');
//-----------
// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });
//--------

var UserSchema = new Mongoose.schema({
  username: { type: String, required: true },
  password = { type: String, required: true }
})

var User = mongoose.model('User', UserSchema);

UserSchema.methods.initialize = function() {
  this.on('creating', this.hashPassword);
}

UserSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
}

UserSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
    }
});
// Not sure if this is needed
// var UserGroup = new Mongoose.Schema({
//   users: [{type: Mongoose.Schema.ObjectId, ref: 'users'}]
// });
module.exports = User;
