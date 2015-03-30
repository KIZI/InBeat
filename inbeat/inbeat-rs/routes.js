var Logger = require('./config').Logger;
var async = require('async');

var Attribute = require('inbeat-bl').getModel('attribute');
var Rules = require('inbeat-bl').getModel('rule');
var ObjectTaxonomy = require('inbeat-bl').getLogic('object-taxonomy');
var RuleEngine = require('inbeat-bl').getLogic('rule-engine');

exports.putRules = function (req, res) {
    if (req.params.accountId && req.query.uid && req.body && (req.headers['content-type'] === 'application/json' || req.headers['content-type'] === 'application/json;charset=UTF-8')) {
        var name = (req.params.accountId + "-" + req.query.uid).replace(/\W/g, '_');
        if(req.body!==null && req.body.length>0){
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

exports.classify = function(req, res) {
    if (req.params.accountId && req.query.uid) {
        var name =  (req.params.accountId + "-" + req.query.uid).replace(/\W/g, '_');
        async.waterfall([
            function ( cb) {
                _getObjects(req.params.accountId, req.query.id, cb);
            },
            function(objects, cb){
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
                var rankings = [];
                async.each(objects, function(item,ecb){
                    var ranking = RuleEngine.firstMatch(rules,item.taxonomy);
                    if(ranking.consequent) {
                        rankings.push({objectId: item.objectId, rank: ranking.consequent.interest});
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
    } else {
        res.status(400).end();
    }
};

var _getObjects = function (accountId, objectId, callback) {
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
            ObjectTaxonomy.objectAttributesTaxonomy(accountId, item.objectId, item.parentObjectId, true, function (err, data) {
                callback(err, data);
            });
        });
    } else {
        Attribute.findAllByAccountId(accountId, function (err, attributes) {
            if (err) {
                callback(err, null);
                return;
            }
            async.map(attributes, function (item, cb) {
                ObjectTaxonomy.objectAttributesTaxonomy(accountId, item.objectId, item.parentObjectId, true, function (err, data) {
                    cb(err, data[0]);
                });
            }, callback);
        });
    }
};