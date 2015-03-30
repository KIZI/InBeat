var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var routes = require('./routes');
var auth = require('inbeat-bl').getLogic('auth').auth;

var config = require("../config");
var port = config["inbeat-gain"]["api-port"];

var app = express();

app.use(bodyParser.json());
app.use(compression());

// Routes
// index
app.get('/gain/api', function(req, res) {
	res.status(200).end();
});

// admin account
app.get('/gain/api/:accountId/account', auth, routes.getAdminAccount);
app.put('/gain/api/:accountId/account', auth, routes.updateAdminAccount);

// account
app.get('/gain/api/:accountId', auth, routes.getAccount);
app.put('/gain/api/:accountId', auth, routes.updateAccount);

// aggregation
app.get('/gain/api/:accountId/aggregation/rules', auth, routes.getRules);
app.put('/gain/api/:accountId/aggregation/rules', auth, routes.updateRules);
app.get('/gain/api/:accountId/aggregation/taxonomy', auth, routes.getTaxonomy);
app.put('/gain/api/:accountId/aggregation/taxonomy', auth, routes.updateTaxonomy);

// stats
app.get('/gain/api/:accountId/interaction/number', auth, routes.numberOfInteractions);
app.get('/gain/api/:accountId/interaction', auth, routes.interactions);
app.put('/gain/api/:accountId/interaction', auth, routes.deleteInteractions);
app.get('/gain/api/:accountId/session/number', auth, routes.numberOfSessions);

// object descriptions
app.get('/gain/api/:accountId/object/attributes', auth, routes.getObjectAttributes);
app.post('/gain/api/:accountId/object/attributes', auth, routes.postObjectAttributes);
app.put('/gain/api/:accountId/object/attributes', auth, routes.deleteObjectAttributes);
app.get('/gain/api/:accountId/object/taxonomies', auth, routes.objectAttributesTaxonomy);
app.get('/gain/api/:accountId/object/flattaxonomies', auth, routes.objectAttributesTaxonomyFlat);

// export
app.get('/gain/api/:accountId/export/interests', auth, routes.userExportInterest);
app.put('/gain/api/:accountId/export/interests', auth, routes.deleteUserExportInterest);

app.listen(port, function() {
	console.log("InBeat: GAIN api listening on: "+port);
});

process.on('SIGINT', function() {
	console.log('\nshutting down from  SIGINT (Crtl-C)');
	process.exit();
});