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