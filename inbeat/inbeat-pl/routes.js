var Logger = require('./config').Logger;

var async = require('async');

var Miner = require('inbeat-bl').getLogic('miner');
var MinerArules = require('inbeat-bl').getLogic('miner-arules');
var MinerJS = require('inbeat-bl').getLogic('miner-js');

var Rules = require('inbeat-bl').getModel('rule');
var PLData = require('inbeat-bl').getModel('pl-data');

exports.putData = function(req, res) {
    if (req.params.accountId && req.query.uid && req.body && (req.headers['content-type'] === 'application/json' || req.headers['content-type'] === 'application/json;charset=UTF-8')) {
        var name = (req.params.accountId + "-" + req.query.uid).replace(/\W/g, '_');
        if(req.body!==null && req.body.length>0){
            PLData.upsert({id:name,type:"application/json",content:JSON.stringify(req.body)},function(err,data){
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

exports.mineRules = function(req, res) {
    if (req.params.accountId && req.query.uid) {
        var name =  (req.params.accountId + "-" + req.query.uid).replace(/\W/g, '_');
        var input = req.body;
        var curMiner = Miner;
        var curType = "application/xml";

        var task = {};
        task.confidence = (input && input.confidence)?input.confidence:0.01;
        task.support = (input && input.support)?input.support:0.01;

        if(input && input.type) {
            switch (input.type) {
                case "arules":
                    curMiner = MinerArules;
                    curType = "text/csv";
                    break;
                case "jsapriori":
                    curMiner = MinerJS;
                    curType = "application/json";
                    break;
                default:
                    curMiner = Miner;
                    curType = "application/xml";
                    task.confidence = (input && input.confidence)?input.confidence:0.7;
                    task.support = (input && input.support)?input.support:2;
                    break;
            }
        }

        curMiner.mine(name,task,function(err, data){
            Rules.upsert({
                'id': name,
                'type': curType,
                'content': data
            }, function(err, r) {
                if (err) Logger.error(err);
                res.set('Content-Type', curType);
                res.send(data);
            });
        });
    } else {
        res.status(400).end();
    }
};

exports.getRules = function(req, res) {
	if (req.params.accountId && req.query.uid) {
		var p = {
			tablename: (req.params.accountId + "-" + req.query.uid).replace(/\W/g, '_')
		};
		Rules.findById(p.tablename, function(err, rul) {
			if (err) {
				Logger.error(err);
				res.status(400).send(err);
				return;
			}
			res.set('Content-Type', rul.type);
			res.send((rul && rul.content) ? rul.content : '');
		});
	} else {
		res.status(400).end();
	}
};