/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Business logic to properly execute pure JS Apriaori implementation
 */

var MinerArules = function() {

    // modules
    var async = require('async');
    var fs = require('fs');
    var _ = require('underscore');
    var Apriori = require('./apriori');
    var PLData = require('./../model/pl-data');

    // perform mining task
    var _task = function(name,task,callback){
        PLData.findById(name,function(err,data){
            if(err || !data || !data.content){
                callback(err,null);
                return;
            }
            var interactions = JSON.parse(data.content);
            // preprocessing
            var preprocessing = [task.className];
            for(var i=0;i<interactions.length;i++){
                // remove specific attributes
                if ("last"!==task.className)
                    delete interactions[i].last;
                if ("accountId"!==task.className)
                    delete interactions[i].accountId;
                if ("objectId"!==task.className)
                    delete interactions[i].objectId;
                if ("parentObjectId"!==task.className)
                    delete interactions[i].parentObjectId;
                if ("sessionId"!==task.className)
                    delete interactions[i].sessionId;
                if ("userId"!==task.className)
                    delete interactions[i].userId;
                if ("interest"===task.className) {
                    // convert interest value
                    if(interactions[i].interest==0) {
                        interactions[i].interest = "neutral";
                    } else if(interactions[i].interest<0) {
                        interactions[i].interest = "negative";
                    } else {
                        interactions[i].interest = "positive";
                    }
                } else {
                    delete interactions[i].interest;
                }
                // detect columns with non-zero values
                var keys = Object.keys(interactions[i]);
                for(var key in keys){
                    if(interactions[i][keys[key]]!=0 && preprocessing.indexOf(keys[key])===-1 && typeof keys[key] === 'string' ){
                        preprocessing.push(keys[key]);
                    }
                }
            }
            // remove "columns" with zero values
            for(var i=0;i<interactions.length;i++){
                var keys = Object.keys(interactions[i]);
                for(var key in keys){
                    if(preprocessing.indexOf(keys[key])===-1 && typeof keys[key] === 'string'){
                        delete interactions[i][keys[key]];
                    }
                }
            }
            // start mining
            var rules = Apriori.run(interactions,{minSupport: task.support?task.support:0.01, minConfidence: task.confidence?task.confidence:0.01, limit:500, filter: task.className+"="});
            callback(null,JSON.stringify(rules));
        });
    };

    return {
        task: _task,
        mine: _task
    };

}();
module.exports = MinerArules;