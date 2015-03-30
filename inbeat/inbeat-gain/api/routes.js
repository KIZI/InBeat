var Interaction = require('inbeat-bl').getModel('interaction');
var Attribute = require('inbeat-bl').getModel('attribute');
var Account = require('inbeat-bl').getModel('account');
var AggregationRules = require('inbeat-bl').getModel('aggregation-rules');
var AggregationTaxonomy = require('inbeat-bl').getModel('aggregation-taxonomy');

var ObjectTaxonomy = require('inbeat-bl').getLogic('object-taxonomy');
var AggregationTableFormat = require('inbeat-bl').getModel('aggregation-tableformat');
var UserInterest = require('inbeat-bl').getLogic('user-interest');

var Logger = require('../config').Logger;
var async = require('async');


/*
*********************
 Admin account
*********************
*/
exports.getAdminAccount = function(req, res) {
    if (req.params.accountId) {
        Account.model.find({},function(err, accounts) {
            async.map(accounts,function(item,cb){
                var obj = {
                    id:item.id,
                    status:item.status,
                    sessionization:item.sessionization,
                    credentials:item.credentials
                };
                cb(null,obj);
            },function(err, all){
                res.json(all);
            });
        });
    } else {
        res.status(400).end();
    }
};

exports.updateAdminAccount = function(req, res) {
    if (req.params.accountId && req.body) {
        async.each(req.body,function(item,cb){
            Account.upsert(item.id,item, cb);
        },function(err,d){
            res.send(err);
        });
    } else {
        res.status(400).end();
    }
};

/*
*********************
 Account settings
*********************
*/
exports.getAccount = function(req, res) {
    if (req.params.accountId) {
        Account.findById(req.params.accountId, function(err, account) {
            if(account) {
                var out = {
                    status: account.status,
                    sessionization: account.sessionization,
                    credentials: account.credentials
                };
                res.json(out);
            } else {
                res.status(400).end();
            }
        });
    } else {
        res.status(400).end();
    }
};

exports.updateAccount = function(req, res) {
    if (req.params.accountId && req.body) {
        var data = {};
        if(req.body.status) {
            data.status = req.body.status;
        }
        if(req.body.sessionization) {
            data.sessionization = req.body.sessionization;
        }
        if(req.body.credentials) {
            data.credentials = req.body.credentials;
        }
        Account.upsert(req.params.accountId,data, function(err, account) {
            res.send(err,account);
        });
    } else {
        res.status(400).end();
    }
};


/*
*********************
 Aggregation rules
*********************
*/
exports.getRules = function(req, res) {
    if (req.params.accountId) {
        AggregationRules.findById(req.params.accountId, function(err, rules) {
            if(!err && rules) {
                res.send(rules.content);
            } else {
                res.status(400).end();
            }
        });
    } else {
        res.status(400).end();
    }
};

exports.updateRules = function(req, res) {
    if (req.params.accountId && req.body) {
        AggregationRules.upsert({id:req.params.accountId,content:req.body.body}, function(err, rules) {
            res.send(err);
        });
    } else {
        res.status(400).end();
    }
};

/*
*********************
 Content taxonomy
*********************
*/

exports.getTaxonomy = function(req, res) {
    if (req.params.accountId) {
        AggregationTaxonomy.findById(req.params.accountId, function(err, rules) {
            if(!err && rules) {
                res.send(rules.content);
            } else {
                res.status(400).end();
            }
        });
    } else {
        res.status(400).end();
    }
};

exports.updateTaxonomy = function(req, res) {
    if (req.params.accountId && req.body) {
        AggregationTaxonomy.upsert({id:req.params.accountId,content:req.body.body}, function(err, rules) {
            res.send(err);
        });
    } else {
        res.status(400).end();
    }
};

/*
*********************
 API
*********************
*/
exports.numberOfInteractions = function(req, res) {
	if (req.params.accountId) {
		var param = {
			accountId: req.params.accountId
		};
		if (req.query.uid) {
			param.userId = req.query.uid;
		}
		Interaction.count(param, function(err, count) {
			res.json({
				count: count
			});
		});
	} else {
        res.status(400).end();
	}
};

exports.interactions = function(req, res) {
	if (req.params.accountId) {
		var param = {
			accountId: req.params.accountId
		};
		if (req.query.uid) {
			param.userId = req.query.uid;
		}
		Interaction.findInteractionsPopulate(param, function(err, interactions) {
			res.json(interactions);
		});
	} else {
        res.status(400).end();
	}
};


exports.deleteInteractions = function(req, res) {
    if (req.params.accountId) {
        var param = {
            accountId: req.params.accountId
        };
        if (req.query.uid) {
            param.userId = req.query.uid;
        }
        Interaction.remove(param, function(err, interactions) {
            res.send("");
        });
    } else {
        res.status(400).end();
    }
};

exports.numberOfSessions = function(req, res) {
	if (req.params.accountId) {
		var param = {
			accountId: req.params.accountId
		};
		if (req.query.uid) {
			param.userId = req.query.uid;
		}
		Interaction.findUserSessions(param, function(err, sessions) {
			res.json({
				count: sessions.length
			});
		});
	} else {
        res.status(400).end();
	}
};

exports.getObjectAttributes = function(req, res) {
	if (req.query.pid) {
		Attribute.findAllByParentObjectId(req.params.accountId, req.query.pid, function(err, attrs) {
			res.json(attrs);
		});
	} else if (req.query.id) {
		Attribute.findAllByObjectId(req.params.accountId, req.query.id, function(err, attrs) {
			res.json(attrs);
		});
	} else {
        // res.status(400).end();
        Attribute.findAllByAccountId(req.params.accountId, function(err, attrs) {
            res.json(attrs);
        });
	}
};

exports.deleteObjectAttributes = function(req, res) {
    if (req.params.accountId) {
        var param = {
            accountId: req.params.accountId
        };
        if (req.query.uid) {
            param.userId = req.query.uid;
        }
        Attribute.remove(param, function(err, interactions) {
            res.send("");
        });
    } else {
        res.status(400).end();
    }
};

exports.postObjectAttributes = function(req, res) {
	if (req.body && req.body.length > 0) {
		async.each(req.body, function(item, cb) {
			Attribute.model.update({
				'accountId': item.accountId,
				'objectId': item.objectId,
				'parentObjectId': item.parentObjectId
			}, {
				$set: item
			}, {
				'upsert': true
			}, cb);
		}, function(err) {
			if (err) res.status(400).send(err);
			res.status(201).end();
		});

	} else {
        res.status(400).end();
	}
};

exports.objectAttributesTaxonomy = function(req, res) {
	if (req.query.id) {
		ObjectTaxonomy.objectAttributesTaxonomy(req.params.accountId, req.query.id, null, false, function(err, data) {
			res.json(data);
		});
	} else {
        res.status(400).end();
	}
};

exports.objectAttributesTaxonomyFlat = function(req, res) {
	if (req.query.id) {
		ObjectTaxonomy.objectAttributesTaxonomy(req.params.accountId, req.query.id, null, true, function(err, data) {
			res.json(data);
		});
	} else {
        res.status(400).end();
	}
};
/*
exports.userObjectInterest = function(req, res) {
	if (req.query.id && req.query.uid) {
		UserInterest.getInterestForObject(req.params.accountId, req.query.id, req.query.uid, null, function(err, interests) {
			res.json(interests);
		});
	} else {
        res.status(400).end();
	}
};

exports.userSessionInterest = function(req, res) {
	if (req.params.accountId && req.query.uid) {
		UserInterest.getInterestForSession(req.params.accountId, req.query.uid, function(err, interests) {
			res.json(interests);
		});
	} else {
        res.status(400).end();
	}
};
*/

exports.userExportInterest = function(req, res) {
	if (req.params.accountId && req.query.uid) {
        AggregationTableFormat.find(req.params.accountId, req.query.uid, function(err, interests) {
            interests = JSON.parse(JSON.stringify(interests));

            for(var i=0;i<interests.length;i++){
                if(interests[i].interest>1){
                    interests[i].interest = 1;
                }
                if(interests[i].interest<-1){
                    interests[i].interest = -1;
                }
                interests[i].interest = parseFloat(interests[i].interest);
            }
			res.format({
                'application/json': function() {
                    res.set({ 'content-type': 'application/json; charset=utf-8' });
                    res.json(interests);
                },
                'text/csv': function() {
                    UserInterest.formatExportOutput(interests, 'text/csv', null, function(err, out) {
                        res.end(out);
                    });
                },
                'text/plain': function() {
                    UserInterest.formatExportOutput(interests, 'text/plain', {
                        tablename: req.params.accountId + "-" + req.query.uid
                    }, function(err, out) {
                        res.end(out);
                    });
                }
			});
		});
	} else {
        res.status(400).end();
	}

};

exports.deleteUserExportInterest = function(req, res) {
    if (req.params.accountId) {
        var param = {
            accountId: req.params.accountId
        };
        if (req.query.uid) {
            param.userId = req.query.uid;
        }
        AggregationTableFormat.remove(param, function(err, interactions) {
            res.send("");
        });
    } else {
        res.status(400).end();
    }
};