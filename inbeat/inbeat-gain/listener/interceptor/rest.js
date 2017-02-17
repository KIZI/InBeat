/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */


/**
 * Processing data comming to the REST interceptor
 */
exports.processRequest = function(request, callbackRequest) {

	// return if invalid request
	if (!request || request.method != 'POST') {
		callbackRequest("invalid request - null", null);
		return;
	}

	var body = '';
	request.on('data', function(postdata) {
		body += postdata;
		if (body.length > 1e6) {
			// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
			request.connection.destroy();
		}
	});
	request.on('end', function() {
		try {
			var parsedData = JSON.parse(body);
			_processData(request, parsedData, callbackRequest);
		} catch (err) {
			callbackRequest("invalid REST request " + err, null);
			return;
		}

	});

};

/**
 * Transform data to the unified representation
 */
var _processData = function(request, parsedData, callbackRequest) {
	var interaction = {};
	interaction.date = new Date();
	interaction.attributes = {};

	interaction.user = {};
	interaction.user.attributes = {};

	interaction.object = {};
	interaction.object.attributes = {};

	interaction.session = {};
	interaction.session.attributes = {};

	interaction.session.attributes.ip = request.headers['x-real-ip'] ? request.headers['x-real-ip'] : request.connection.remoteAddress;
	interaction.user.id = parsedData.userId?parsedData.userId:"";
	interaction.userId = parsedData.userId?parsedData.userId:"";

    if(parsedData.object) {
        interaction.object = parsedData.object;
        interaction.object.accountId = parsedData.accountId;
    }
	interaction.object.id = parsedData.objectId?parsedData.objectId:"unknown";
    interaction.object.objectId = parsedData.objectId?parsedData.objectId:"unknown";
	interaction.objectId = parsedData.objectId?parsedData.objectId:"unknown";
	// others
	interaction.accountId = parsedData.accountId;
	interaction.type = parsedData.type;
	if (parsedData.attributes) {
		interaction.attributes = parsedData.attributes;
	}
	if (parsedData.user && parsedData.user.attributes) {
		interaction.user.attributes = parsedData.user.attributes;
	}
	if (parsedData.session && parsedData.session.attributes) {
		interaction.session.attributes = parsedData.session.attributes;
	}
	callbackRequest(null, interaction);
};

exports.processData = _processData;