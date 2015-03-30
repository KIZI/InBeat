var log4js = require('log4js');
log4js.configure({
	appenders: [{
		"type": "dateFile",
		"filename": __dirname + "/../logs/inbeat-pl.log",
		"pattern": "-yyyy-MM-dd",
		"alwaysIncludePattern": false
	}]
});
var logger = log4js.getLogger();

var c_env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
var configurations = require('../config');

// overwrite global config
// configurations.test = {}

module.exports = configurations[c_env];
module.exports.Logger = logger;