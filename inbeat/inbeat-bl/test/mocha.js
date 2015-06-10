process.env.NODE_ENV = 'test';
var config = require(process.cwd() + '/config').mongo;
var mongoose = require('mongoose');
mongoose.connect(config.url);