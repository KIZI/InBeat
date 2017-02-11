/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Merge object attributes and interactions - for specific multimedia content 
 */
var ObjectInteractions = function() {

	_findInteractions = function(objectAttributes, interactions, callback) {


		objectAttributes = JSON.parse(JSON.stringify(objectAttributes));

		for (var ai = 0; ai < objectAttributes.length; ai++) {
			objectAttributes[ai].interactions = [];

			for (var ii = 0; ii < interactions.length; ii++) {
				if (interactions[ii].attributes && interactions[ii].attributes.category==="Video") {
					if (objectAttributes[ai].attributes.start <= interactions[ii].attributes.value && objectAttributes[ai].attributes.end > interactions[ii].attributes.value) {
						objectAttributes[ai].interactions.push(interactions[ii]);
					}
				} else {
					objectAttributes[ai].interactions.push(interactions[ii]);
				}
			}
			delete objectAttributes[ai].attributes;

		}
		callback(null, objectAttributes);
	};

	return {
		findInteractions: _findInteractions
	};

}();
module.exports = ObjectInteractions;