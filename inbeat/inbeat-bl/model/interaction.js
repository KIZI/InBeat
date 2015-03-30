var Interaction = function() {

	var async = require('async');
	var mongoose = require('mongoose');
	var Schema = require('mongoose').Schema;
	var ObjectId = Schema.ObjectId;

    /*
     ,
     expires: 60*60*24*7
     */

	// schema of interaction
	var interactionSchema = new Schema({
		date: {
			type: Date,
			default: Date.now
		},
		accountId: {
			type: String,
			required: true
		},

		objectId: {
			type: String,
			required: true
		},
		object: {
//            id: {type: String},
//            attributes: {}
		},

		userId: {
			type: String,
			required: true
		},
		user: {
            id: {type: String},
            attributes: {}
		},

		sessionId: {
			type: String
		},
		session: {
            id: {type: String},
            attributes: {}
		},

		type: {
			type: String,
			required: true
		},
		attributes: {}
	});

	// indexes !!!
	interactionSchema.index({
		date: -1
	});
	interactionSchema.index({
		accountId: 1
	});
	interactionSchema.index({
		object: 1
	});
	interactionSchema.index({
		user: 1
	});
	interactionSchema.index({
		session: 1
	});

	// models
	var _model = null;
	try {
		_model = mongoose.model('Interaction', interactionSchema);
	} catch (err) {}
	_model = mongoose.model('Interaction');

	// findOne
	var _findOne = function(param, callback) {
        _model.findOne(param).exec(callback);
	};

	// count interactions by param
	var _count = function(param, callback) {
		_model.count(param, callback);
	};

	var _findUserSessions = function(param, callback) {
		_model.find(param).distinct('sessionId', callback);
	};

	var _findUserObjectsBySession = function(param, callback) {
		_model.find(param).distinct('objectId', callback);
	};

	// create
	var _create = function(account, data, createCallback) {
			// save interaction with all references
			_getSessionId(account.id, data.userId, new Date(), account.getSessionization(), function(sid) {
				data.sessionId = sid;
				_model.create(data, createCallback);
			});
	};

	// remove
	var _remove = function(param, removeCallback) {
	    _model.remove(param, removeCallback);
	};

	var _getSessionId = function(accountId, userId, date, difference, callback) {
        // find previous interactions
		_model.findOne({
			'accountId': accountId,
			'userId': userId,
			'date': {
				$lte: date
			}
		}).sort({
			'date': -1
		}).limit(1).exec(function(err, doc) {
            // if not existst -> start new session
			if (err || doc === null) {
				callback((new Date()).getTime());
			} else
			if ((date - doc.date.getTime()) > difference * 1000) {
                // if exists but expired -> new session
				callback((new Date()).getTime());
			} else {
                // continue in previous session
				callback(doc.sessionId);
			}
		});
	};

	var _findUserSessionInteractions = function(accountId, sessionId, userId, callback) {
		_model.find({
			'accountId': accountId,
			'sessionId': sessionId,
			'userId': userId
		}).sort({
			date: -1
		}).exec(callback);
	};

	var _findUserObjectInteractions = function(objectId, userId, callback) {
		_model.find({
			'objectId': objectId,
			'userId': userId
		}).sort({
			date: -1
		}).exec(callback);
	};

	var _findInteractions = function(param, callback) {
            _model.find(param).sort({
                date: -1
            }).exec(callback);
	};

	var _findInteractionsPopulate = function(param, callback) {
		_model.find(param).sort({
			date: -1
        }).limit(100).exec(callback);
	};

	return {
		model: _model,
		findOne: _findOne,
		count: _count,
		create: _create,
		remove: _remove,
		getSessionId: _getSessionId,
		findUserObjectInteractions: _findUserObjectInteractions,
		findUserSessionInteractions: _findUserSessionInteractions,
		findUserSessions: _findUserSessions,
		findUserObjectsBySession: _findUserObjectsBySession,
		findInteractions: _findInteractions,
		findInteractionsPopulate: _findInteractionsPopulate
	};

}();
module.exports = Interaction;