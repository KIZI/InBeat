var Miner = function() {

	var Logger = require('../config').Logger;

	var request = require('request');
	var xml2js = require('xml2js');
	var S = require('string');
	var parser = new xml2js.Parser();

    var UserInterest = require('./user-interest');
    var PLData = require('./../model/pl-data');
    var MysqlConnector = require('./mysql-connector');
    var MinerXml = require('./miner-xml');

    var async = require('async');

    var configMysql = require('./../config').mysql;

    var minerURI = 'http://connect-dev.lmcloud.vse.cz/LinkedTV/';
	var username="gain";
	var password="gain";
	var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

	var _register = function(resource, regCallback) {
		if (!resource) {
			regCallback('Miner - invalid register parameters object', null);
			return;
		}
		var data = '<RegistrationRequest sharedBinaries="true"><Connection type="MySQL"><Server>'+resource.server+'</Server><Database>'+resource.database+'</Database><Username>'+resource.username+'</Username><Password>'+resource.password+'</Password></Connection></RegistrationRequest>';
		request({url: minerURI + 'miners', body: data, method: "POST", headers: {"Authorization":auth}}, function(error, response, body) {
			//console.log(error, response, body);
			if (!error && response.statusCode == 200) {
				parser.parseString(S(body).trim().s, function(err, result) {
					if (!err && result.response['$'].status == 'success') {
						regCallback(null, result.response['$'].id);
					} else {
						regCallback('post request failed - register' + error + body);
					}
				});

			} else {
				regCallback('post request failed - register' + error + body);
			}
		});

	};

	var _import = function(id, dictionary, callback) {
		if (!dictionary || dictionary === '' || !id || id === '') {
			callback('Miner - invalid datadictionary or id', null);
			return;
		}
		//console.log(dictionary);
		request({url: minerURI + 'miners/' + id + '/DataDictionary', body: dictionary, method: "PUT", headers:{"Authorization":auth}}, function(error, response, body) {
			//console.log(id, response.statusCode, error, body);
			if (!error && response.statusCode == 200) {
				parser.parseString(S(body).trim().s, function(err, result) {
					if (!err && result.response['$'].status == 'success') {
						callback(null, result.response['$'].id);
					} else {
						callback('post request failed ' + error + body);
					}
				});

			} else {
				callback('post request failed error ' + error + body);
			}
		});
	};

	var _task = function(id, task, callback) {
		if (!task || task === '' || !id || id === '') {
			callback('Miner - invalid task or id', null);
			return;
		}
		request({url: minerURI + '/miners/' + id + '/tasks/task?template=4ftMiner.Task.Template.PMML', body: task, method: "POST", headers:{"Authorization":auth}}, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				callback(null,body);
			} else {
				callback('post request failed ' + error + body);
			}
		});
	};

    var _mine = function(name,task,callback){
        PLData.findById(name,function(err,data){
            if(err || !data || !data.content){
                callback(err,null);
                return;
            }
            var p = {
                tablename: name,
                support: task.support,
                confidence: task.confidence
            };
            UserInterest.formatExportOutput(JSON.parse(data.content), 'text/plain', p, function(err, out) {
                if (err) {
                    callback(err,null);
                    return;
                }
                MysqlConnector.startConnection(configMysql);
                MysqlConnector.execute(out, function(err) {
                    if (err) {
                        callback(err,null);
                        return;
                    }
                    var query = "select column_name from information_schema.columns where table_name='" + p.tablename + "';";
                    MysqlConnector.execute(query, function(err, results) {
                        if (err) {
                            Logger.error(err);
                            return;
                        }
                        async.map(results, function(item, cb) {
                            cb(null, item.column_name);
                        }, function(err, columns) {
                            MysqlConnector.endConnection();
                            MinerXml.getDictionary(columns, p, function(err, dictionary) {
                                MinerXml.getTask(columns, p, function(err, task) {
                                    //fs.writeFileSync("dictionary.xml", dictionary);
                                    //fs.writeFileSync("task.xml", task);
                                    var resource = {
                                        type: 'MySQLConnection',
                                        metabase: ''
                                    };
                                    resource.server = configMysql.host;
                                    resource.database = configMysql.database;
                                    resource.username = configMysql.user;
                                    resource.password = configMysql.password;
                                    Miner.register(resource, function(err, dsid) {
                                        if (err) {
                                        	console.log(err);
                                            Logger.error(err);
                                            return;
                                        }
                                        //Miner.import(configMiner.dsid, dictionary, function(err, id) {
                                        Miner.import(dsid, dictionary, function(err, id) {
                                            if (err) {
                                                Logger.error(err);
                                                return;
                                            }
                                            //Miner.task(configMiner.dsid, task, function(err, rules) {
                                            Miner.task(dsid, task, function(err, rules) {
                                                if (err) Logger.error(err);
                                                callback(null, rules);
                                                MysqlConnector.endConnection();
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    });
                });
            });

        });
    };

	return {
		register: _register,
		import: _import,
		task: _task,
        mine: _mine
	};
}();
module.exports = Miner;