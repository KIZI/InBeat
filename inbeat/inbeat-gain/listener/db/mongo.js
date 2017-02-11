/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

// imports
var logger = require('../../config').Logger;

var Interaction = require('inbeat-bl').getModel('interaction');
var Account = require('inbeat-bl').getModel('account');
var Attribute = require('inbeat-bl').getModel('attribute');

var AggregationTableFormat = require('inbeat-bl').getModel('aggregation-tableformat');

var async = require('async');

/**
 * Store data to existing collections
 */
exports.add = function(data, callbackSaved) {
    // verify account id
    Account.isVerified(data.accountId, function(valid, account) {
        if (valid) {
            async.waterfall([
                function(callback) {
                    Interaction.create(account, data, function(err) {
                        callback(err);
                    });
                },
                function(callback) {
                    if(data.object.objectId){
                        Attribute.create(data.object,callback);
                    } else {
                        callback(null,null);
                    }
                },
                function(d1,callback) {
                    AggregationTableFormat.construct(data, callback);
                },
                function(aggregation,callback) {
                    AggregationTableFormat.upsert(aggregation, callback);
                }

            ], callbackSaved);

        } else {
            logger.warn('Request is not verified - accountId: ' + data.accountId + ', uri: ' + ((data.object.attributes && data.object.attributes.hostname) ? data.object.attributes.hostname : '') + data.object.id);
            callbackSaved(null);
        }
    });
};