/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

var Logger = require('./config').Logger;
var async = require('async');

var Attribute = require('inbeat-bl').getModel('attribute');
var Rules = require('inbeat-bl').getModel('rule');
var ObjectTaxonomy = require('inbeat-bl').getLogic('object-taxonomy');
var RuleEngine = require('inbeat-bl').getLogic('rule-engine');

/**
 * Uploading rules to the RS module
 */
exports.putRules = function (req, res) {
    // checking preconditions
    if (req.params.accountId && req.query.uid && req.body && (req.headers['content-type'] === 'application/json' || req.headers['content-type'] === 'application/json;charset=UTF-8')) {
        var name = (req.params.accountId + "-" + req.query.uid).replace(/\W/g, '_');
        if(req.body!==null && req.body.length>0){
            // save to DB
            Rules.upsert({id:name,type:"application/json",content:JSON.stringify(req.body)},function(err,data){
                res.status(200).end();
                return;
            });
        } else {
            res.status(400).end();
            return;
        }
    } else {
        res.status(400).end();
    }
};

/**
 * Classification of content items
 */
exports.classify = function(req, res) {
    if (req.params.accountId && req.query.uid) {
        var name =  (req.params.accountId + "-" + req.query.uid).replace(/\W/g, '_');

        if(req.body && (req.headers['content-type'] === 'application/json' || req.headers['content-type'] === 'application/json;charset=UTF-8')) {
            async.waterfall([
                function(cb){
                    // load rule based classifier
                    Rules.findById(name, function(err, rul) {
                        if (err) {
                            cb(err,null,null);
                        } else if (rul===null) {
                           cb("No rules",null,null);
                        }else {
                            cb(null,JSON.parse(rul.content));
                        }
                    });
                },
                function(rules,cb){
                    // classify
                    var matches = RuleEngine.topMatch(rules,req.body,5);
                    var result = [];
                    for(var i=0;i<matches.length;i++) {
                        result.push({objectId: matches[i], confidence:(1-(i)/parseFloat(matches.length))});
                    }
                    cb(null,result);
                }
            ], function (err, recommendations) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.send(recommendations);
            });
        } else {
            // classify existing objects
            async.waterfall([
                function ( cb) {
                    // get objects from the DB
                    _getObjects(req.params.accountId, req.query.id, cb);
                },
                function(objects, cb){
                    // load rule based classifier
                    Rules.findById(name, function(err, rul) {
                        if (err) {
                            cb(err,null,null);
                        } else if (rul===null) {
                           cb("No rules",null,null);
                        }else {
                            cb(null,objects, JSON.parse(rul.content));
                        }
                    });
                },
                function(objects,rules,cb){
                    // classify
                    var rankings = [];
                    async.each(objects, function(item,ecb){
                        var ranking = RuleEngine.firstMatch(rules,item.taxonomy);
                        if(ranking.consequent) {
                            rankings.push({objectId: item.objectId, rank: ranking.consequent.interest, confidence: ranking.confidence});
                        }
                        ecb(null);
                    });
                    cb(null,rankings);
                }
            ], function (err, recommendations) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.send(recommendations);
            });
        }
    } else {
        res.status(400).end();
    }
};

/**
 * Get all objects from the DB
 */
var _getObjects = function (accountId, objectId, callback) {
    // if object specified
    if(objectId){
        Attribute.findAllByObjectId(accountId,objectId, function (err, items) {
            if (err) {
                callback(err, null);
                return;
            }
            if(items.length === 0){
                callback(null,[]);
                return;
            }
            var item = items[0];
            // convert object description to a flat JSON
            ObjectTaxonomy.objectAttributesTaxonomy(accountId, item.objectId, item.parentObjectId, true, function (err, data) {
                callback(err, data);
            });
        });
    } else {
        // alse all objects
        Attribute.findAllByAccountId(accountId, function (err, attributes) {
            if (err) {
                callback(err, null);
                return;
            }
            // convert all objects descriptions to a flat JSON
            async.map(attributes, function (item, cb) {
                ObjectTaxonomy.objectAttributesTaxonomy(accountId, item.objectId, item.parentObjectId, true, function (err, data) {
                    cb(err, data[0]);
                });
            }, callback);
        });
    }
};