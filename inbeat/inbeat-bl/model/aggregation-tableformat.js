var AggregationTableFormat = function () {

    var mongoose = require('mongoose');
    var Schema = require('mongoose').Schema;
    var ObjectTaxonomy = require(__dirname + '/../logic/object-taxonomy');
    var Interaction = require(__dirname + '/interaction');
    var AggregationTableFormat = require(__dirname + '/aggregation-tableformat');
    var AggregationRules = require(__dirname + '/aggregation-rules');
    var async = require('async');
    var _ = require('underscore');

    var schema = new Schema({
        accountId: String,
        userId: String,
        sessionId: String,
        last: String,
        objectId: String,
        parentObjectId: String,
        interest: String
    }, { strict: false });

    schema.index({
        accountId: 1,
        userId: 1,
        objectId: 1,
        parentObjectId: 1
    });

    schema.index({
        accountId: 1,
        userId: 1,
        sessionId: 1
    });

    var _model = null;
    try {
        _model = mongoose.model('AggregationTableFormat', schema);
    } catch (err) {
    }
    _model = mongoose.model('AggregationTableFormat');

    var _upsert = function (aggregation, callback) {
        var interest = aggregation.interest;
        aggregation.last = new Date().getTime()+"";
        delete(aggregation.interest);
        _model.update({
            accountId: aggregation.accountId,
            userId: aggregation.userId,
            sessionId: aggregation.sessionId,
            objectId: aggregation.objectId,
            parentObjectId: aggregation.parentObjectId
        }, {
            $set: aggregation,
            $inc: {
                'interest': interest
            }
        }, {
            upsert: true
        }, callback);
    };

    var _construct = function(interaction, callback){
        async.waterfall([
            function(cb){
                // init aggregation format
                var aggregation = {
                    accountId:interaction.accountId,
                    userId: interaction.userId,
                    objectId: interaction.objectId,
                    parentObjectId: interaction.parentObjectId?interaction.parentObjectId:""
                };
                // load info about session and copy previous context variables if any
                _getCurrentSession(interaction.accountId, interaction.userId, function(session){
                    aggregation = _.extend(aggregation, session);
                    cb(null,aggregation);
                });
            },
            function(aggregation, cb){

                AggregationRules.findById(aggregation.accountId,function(err,aggregationRules){
                    if(err || !aggregationRules || !aggregationRules.content || aggregationRules.content==="") {
                        aggregation.interest = 0;
                        cb(null,aggregation);
                    } else {
                        // compute interest
                        if (interaction.attributes && interaction.attributes.action) {
                            // !!!! eval
                            var result = eval(aggregationRules.content);
                        } else {
                            aggregation.interest = 0;
                        }
                    }

                });
                // add context variable to output
                if(interaction.type === 'context'){
                    aggregation["c_"+interaction.attributes.action] = interaction.attributes.value;
                }
                cb(null,aggregation);
            },
            function(aggregation, cb){
                // extend about object taxonomy
                ObjectTaxonomy.objectAttributesTaxonomy(aggregation.accountId, aggregation.objectId, aggregation.parentObjectId, true, function(err, taxonomy){
                    if(taxonomy && taxonomy.length>0 && taxonomy[0].taxonomy){
                        aggregation = _.extend(aggregation, taxonomy[0].taxonomy);
                    }
                    cb(err,aggregation);
                });
            },
            function(aggregation, cb){
                // extend about object user attributes
                if(interaction.user.attributes){
                    aggregation = _.extend(aggregation, interaction.user.attributes);
                }
                cb(null,aggregation);
            }            
        ], function (err, aggregation) {
            // console.log(err,aggregation);
            // console.log(callback);
            callback(err, aggregation);
            return;
        });
    };


    var _getCurrentSession = function(accountId, userId, callback) {
        // load latest interaction to copy session id
        Interaction.model.findOne({"accountId":accountId,"userId":userId}).sort({date: -1}).limit(1).exec(function(err,interaction){
            // load latest aggregations
            _model.findOne({
                'accountId': accountId,
                'userId': userId,
                'sessionId': interaction.sessionId
            }).limit(1).exec(function(err, doc) {
                if (err || doc === null) {
                    // if does not exist -> start new one
                    callback({sessionId: interaction.sessionId});
                    return;
                } else {
                    var out = {sessionId:doc.sessionId};
                    doc = doc.toObject();
                    async.each(Object.keys(doc), function(item,cb){
                        if(item.indexOf("c_")===0){
                            out[item] = doc[item];
                        }
                        cb(null);
                    },function(err){
                        callback(out);
                    });
                }
            });
        });

    };

    var _find = function(accountId, userId, callback){
        if(userId) {
           _model.find({'accountId':accountId, 'userId':userId},{"_id": 0}).sort({
                sessionId: -1
            }).exec(callback);
        } else {
           _model.find({'accountId':accountId},{"_id": 0}).sort({
                sessionId: -1
            }).exec(callback);
        }
        // _model.find({'accountId':accountId, 'userId':userId},{"_id": 0},callback);
    };

    var _findWithProjection = function(accountId, userId, projectionFilter, callback){
        projection = {"_id": 0};
        for(var p in projectionFilter){
            projection[projectionFilter[p]] = 1;
        }
        if(userId) {
           _model.find({'accountId':accountId, 'userId':userId}, projection).sort({
                sessionId: -1
            }).exec(callback);
        } else {
           _model.find({'accountId':accountId}, projection).sort({
                sessionId: -1
            }).exec(callback);
        }
        // _model.find({'accountId':accountId, 'userId':userId},{"_id": 0},callback);
    };

    // remove
    var _remove = function(param, removeCallback) {
        _model.remove(param, removeCallback);
    };

    return {
        upsert: _upsert,
        construct: _construct,
        find: _find,
        findWithProjection: _findWithProjection,
        remove: _remove
    };

}();

module.exports = AggregationTableFormat;