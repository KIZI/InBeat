/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Main object to access all shared business logic.
 */
var InBeatBusinessLogic = function() {

	var mongoose = require('mongoose');
	var config = require('./config').mongo;

	mongoose.connect(config.url);

	var _getModel = function(modelName) {
		var model = require('./model/'+modelName);
		return model;
	};

	var _getLogic = function(modelName) {
		var logic = require('./logic/'+modelName);
		return logic;
	};

	return {
		getModel: _getModel,
		getLogic: _getLogic
	};

}();
module.exports = InBeatBusinessLogic;