var AggregationTaxonomy = function() {

	var mongoose = require('mongoose');
	var Schema = require('mongoose').Schema;

	var schema = new Schema({
		id: String,
//        type: String,
		content: String
	});

	var _model = null;
	try {
		_model = mongoose.model('AggregationTaxonomy', schema);
	} catch (err) {}
	_model = mongoose.model('AggregationTaxonomy');

	var _upsert = function(data, callback) {
		_model.update({id:data.id},{$set:data},{upsert:true},callback);
	};

	var _findById = function(id, callback) {
		_model.findOne({
			'id': id
		}, callback);
	};

	return {
		model: _model,
		upsert: _upsert,
		findById: _findById
	};

}();

module.exports = AggregationTaxonomy;