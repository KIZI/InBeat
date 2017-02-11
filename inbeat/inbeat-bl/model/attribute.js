/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Attribute model object
 */

var Attribute = function() {

	var mongoose = require('mongoose');
	var Schema = require('mongoose').Schema;

	var attributeSchema = new Schema({
		accountId: {
			type: String,
			required: true
		},
		objectId: String,
		parentObjectId: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: '0'
		},
		group: {
			type: String,
			default: '0'
		},
		rating: {
			type: String,
			default: '0'
		},
		entities: [],
		attributes: {}
	});

	attributeSchema.index({
		accountId: 1
	});
	attributeSchema.index({
		objectId: 1
	});
	attributeSchema.index({
		parentObjectId: 1
	});
	attributeSchema.index({
		type: 1
	});
	attributeSchema.index({
		group: 1
	});
	attributeSchema.index({
		rating: -1
	});
	attributeSchema.index({
		accountId:1,
		group:1,
		type:1,
		objectId:1,
		rating: -1
	});

	var _model = null;
	try {
		_model = mongoose.model('Attribute', attributeSchema);
	} catch (err) {}
	_model = mongoose.model('Attribute');

	var _create = function(attribute, callback) {
		//_model.create(attribute, callback);
        _model.update({
            accountId: attribute.accountId,
            objectId: attribute.objectId
        }, {
            $set: attribute
        }, {
            upsert: true
        }, callback);
	};

	var _findAllByObjectParentObjectId = function(accountId, objectId, parentObjectId, callback) {
		if (parentObjectId === null || parentObjectId === "" || parentObjectId === undefined || parentObjectId === "undefined") {
			_model.find({
				'accountId': accountId,
				'objectId': objectId
			}, callback);
		} else {
			_model.find({
				'accountId': accountId,
				'objectId': objectId,
				'parentObjectId': parentObjectId
			}, callback);
		}
	};

	var _findByObjectId = function(accountId, objectId, callback) {
		_model.findOne({
			'accountId': accountId,
			'objectId': objectId
		}, callback);
	};

	var _findAllByObjectId = function(accountId, objectId, callback) {
		_model.find({
			'accountId': accountId,
			'objectId': objectId
		}, callback);
	};

	var _findAllByParentObjectId = function(accountId, objectId, callback) {
		_model.find({
			'accountId': accountId,
			'parentObjectId': objectId
		}, callback);
	};

    var _findAllByAccountId = function(accountId, callback) {
        _model.find({
            'accountId': accountId
        }, callback);
    };

	var _getDistinctEntityValues = function(accountId, param, callback) {
		_model.distinct('entities.' + param, {
			'accountId': accountId
		}, callback);
	};

    // remove
    var _remove = function(param, removeCallback) {
        _model.remove(param, removeCallback);
    };

	return {
		model: _model,
		create: _create,
		findByObjectId: _findByObjectId,
		findAllByObjectId: _findAllByObjectId,
        findAllByAccountId: _findAllByAccountId,
		findAllByObjectParentObjectId: _findAllByObjectParentObjectId,
		findAllByParentObjectId: _findAllByParentObjectId,
		getDistinctEntityValues: _getDistinctEntityValues,
        remove: _remove
	};

}();
module.exports = Attribute;