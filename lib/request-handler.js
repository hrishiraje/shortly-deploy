var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if(err) { console.log("Error"); }
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.find({ url: uri}, function(err, link) {
    if (link.length > 0) {
      res.send(200, link);
    } else {
      Promise.promisify(util.getUrlTitle)(uri)
      .then(function(title) {
        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        link.initialize();
        link.save(function(err) {
          if(err) { console.log("Error"); }
          res.send(200, link);
        })
      })
      .catch(function(err) {
        console.log("Error has occurred");
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if(!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.hashPassword().then(function() {
        newUser.save(function(err) {
          if (err) {
            console.log("Error hashing password");
          }
          util.createSession(req, res, newUser);
        });
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {

  Link.findOne({code: req.params[0]}, function(err, link) {
    if(!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err) {
        if (err) { console.log("Error"); }
        return res.redirect(link.url);
      });
    }
  });
};
