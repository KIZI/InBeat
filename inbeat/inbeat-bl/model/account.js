var Account = function() {

	var mongoose = require('mongoose');
	var Schema = require('mongoose').Schema;

	var accountSchema = new Schema({
		id: String,
		status: String,
//		type: String,
//		secret: String,
		credentials: String,
		sessionization: Number
	});

	accountSchema.index({
		id: 1
	});
	accountSchema.index({
		type: 1
	});

	accountSchema.methods.getSessionization = function() {
		return this.sessionization;
	};

	accountSchema.methods.getType = function() {
		return this.type;
	};

	var _model = null;
	try {
		_model = mongoose.model('Account', accountSchema);
	} catch (err) {}
	_model = mongoose.model('Account');

	var _isVerified = function(accountId, callback) {
		_model.findOne({
			id: accountId
		}, function(err, doc) {
			if (!err && doc && doc.status == 'verified') {
				callback(true, doc);
			} else {
				callback(false, doc);
			}
		});
	};

	var _create = function(account, callback) {
		_model.create(account, callback);
	};

	var _findById = function(accountId, callback) {
		_model.findOne({
			id: accountId
		}, callback);
	};

    var _upsert = function(accountId, data, callback) {
        _model.update({id:accountId},{$set:data},{upsert:true},callback);
    };

	return {
		model: _model,
		create: _create,
		isVerified: _isVerified,
		findById: _findById,
        upsert: _upsert
	};

}();

module.exports = Account;