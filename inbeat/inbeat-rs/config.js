/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

var log4js = require('log4js');
log4js.configure({
	appenders: [{
		"type": "dateFile",
		"filename": __dirname + "/../logs/inbeat-rs.log",
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