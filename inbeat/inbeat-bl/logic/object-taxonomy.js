/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */


/**
 * Creating object taxonomy - tree based or flat JSON structire
 */
var ObjectTaxonomy = function(){

	var Attribute = require('../model/attribute');
    var AggregationTaxonomy = require('../model/aggregation-taxonomy');
	var ValuePropagation = require('./object-propagation');

	_preorder = function(o, value){
		if(o && o.name && o.value && o.value!==0)
        value['type_'+o.name] = o.value?o.value:0;
		for (var i in o.children) {
			_preorder(o.children[i],value);
		}
	};

	// create taxonomy for speciic object - merge attributes and taxonomy
	_objectAttributesTaxonomy = function(accountId, objectId, parentObjectId, flat, callback){
		// get attributes
		Attribute.findAllByObjectParentObjectId(accountId, objectId, parentObjectId, function(err, attrs){
			// get taxonomy
            AggregationTaxonomy.findById(accountId, function(err, aggregationTaxonomy){
				if(err || !aggregationTaxonomy || !aggregationTaxonomy.content || aggregationTaxonomy.conten==="") {
					// console.log(err);
                    callback(err, null);
                    return;
				} else {
                    var taxonomy = JSON.parse(aggregationTaxonomy.content);
					var result = [];
					var attrCount = attrs.length;
					if(attrCount<=0){
						var ress = {};
						ress.objectId = objectId;
						ress.parentObjectId = parentObjectId;
						if(flat){
							var vector = {};
							_preorder(taxonomy, vector);
						}
						ress.taxonomy = vector;
						result.push(ress);
						callback(null, result);
                        return;
					}
					// propagate all values (attributes) within the taxonomy
					for(var attr in attrs){
                        (function(attri){
                            ValuePropagation.propagate(taxonomy, attrs[attri].entities, function(err, tax){
                                var ress = {};
                                ress.objectId = attrs[attri].objectId;
                                ress.parentObjectId = attrs[attri].parentObjectId;
                                if(flat){
                                    var vector = {};
                                    _preorder(tax, vector);
                                    tax = vector;
                                    for(e=0;e<attrs[attri].entities.length;e++){
										if(attrs[attri] && attrs[attri].entities && attrs[attri].entities[e] && attrs[attri].entities[e].entityURI){
											tax["entity_"+attrs[attri].entities[e].entityURI.substring(attrs[attri].entities[e].entityURI.lastIndexOf('/')+1).replace(/\./g,"_")] = 1;
                                        }
                                    }
                                }
                                ress.taxonomy = tax;
                                result.push(ress);
                                if(--attrCount<=0) {
                                    callback(null, result);
                                }
                            });
                        })(attr);
					}
				}
			});
		});
	};

	return {
		objectAttributesTaxonomy: _objectAttributesTaxonomy
	};
}();
module.exports = ObjectTaxonomy;