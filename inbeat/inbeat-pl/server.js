/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var routes = require('./routes');
var auth = require('inbeat-bl').getLogic('auth').auth;

var config = require("./config");
var port = config["inbeat-pl"]["port"];

var app = express();

app.use(bodyParser.json());
app.use(compression());

// Routes
// index
app.get('/pl/api', function(req, res) {
	res.status(200).end();
});

// pl
app.put('/pl/api/:accountId/data', auth, routes.putData);
app.get('/pl/api/:accountId/rules', auth, routes.getRules);
app.put('/pl/api/:accountId/rules', auth, routes.mineRules);

app.listen(port, function() {
	console.log("InBeat: PL api listening on: "+port);
});

process.on('SIGINT', function() {
	console.log('\nshutting down from  SIGINT (Crtl-C)');
	process.exit();
});