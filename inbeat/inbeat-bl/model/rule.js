var Rule = function() {

	var mongoose = require('mongoose');
	var Schema = require('mongoose').Schema;

	var schema = new Schema({
		id: String,
        type: String,
		content: String
	});

	var _model = null;
	try {
		_model = mongoose.model('Rule', schema);
	} catch (err) {}
	_model = mongoose.model('Rule');


	var _create = function(rules, callback) {
		_model.create(rules, callback);
	};

	var _upsert = function(rules, callback) {
		_model.update({id:rules.id},{$set:rules},{upsert:true},callback);
	};


	var _findById = function(id, callback) {
		_model.findOne({
			'id': id
		}, callback);
	};


	return {
		model: _model,
//		create: _create,
		upsert: _upsert,
		findById: _findById
	};

}();

module.exports = Rule;