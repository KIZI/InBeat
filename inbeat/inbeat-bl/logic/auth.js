var Auth = function() {

    var Account = require('../model/account');
    var Admin = require('../config').admin;

    var _auth = function(req, res, next) {
        if (!req.params.accountId) {
            res.status(400).end();
            return;
        }
        var realm = "Unauthorized for " + req.params.accountId;
        var authorization = req.headers.authorization;
        if (!authorization) {
            res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
            res.status(401).end();
            return;
        }
        var parts = authorization.split(' ');
        if (parts.length !== 2) {
            res.status(400).end();
            return;
        }
        var scheme = parts[0];
        var credentials = new Buffer(parts[1], 'base64').toString();
        var index = credentials.indexOf(':');
        if ('Basic' != scheme || index < 0) {
            res.status(400).end();
            return;
        }

        Account.findById(req.params.accountId, function(err, account) {
            if (account && account.credentials === credentials) {
                next();
                return;
            } else {
                if(req.params.accountId==="admin" && Admin.credentials === credentials){
                    next();
                    return;
                } else {
                    res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
                    res.status(401).end();
                    return;
                }
            }

        });
    };

    return {
        auth: _auth
    };

}();
module.exports = Auth;