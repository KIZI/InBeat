/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */


/**
 * Propagation of values within the taxonomy
 */
var ValuePropagation = function(){

	// propagation of values
	_propagate = function(taxonomy, entities, callback) {		
		var tax = {};
		var data = {};
		tax = JSON.parse(JSON.stringify(taxonomy));
		if(entities){
			for(var i = 0; i<entities.length; i++){
				if(entities[i] && entities[i].typeURI){
					_addValue(tax, entities[i].typeURI, entities[i].relevance?entities[i].relevance:1);
				}
			}
		}
		_aggregate(tax);				
		_normalize(tax, tax.value);				
		callback(null,tax);
	};

	// aggregation values from child nodes
	_aggregate = function (o){		
		var sum = 0;
		var numChild = 0;
		for (var i in o.children) {
			var childSum = _aggregate(o.children[i]);
			if(childSum>0) {
				numChild++;
			}
			sum += childSum;
		}		
		if(numChild>1 && !o.root){
			sum = sum/numChild;
		}
		o.value = sum + (o.value?o.value:0);
		return o.value;
	};

	// noramlize all values according to the root value
	_normalize = function (o, value){
		if(value!=0) {
			o.value /= value;
			o.value = Math.min(o.value,1);
		} else {
			o.value = 0;
		}
		o.value = Math.round(o.value*100)/100;
		for (var i in o.children) {
			_normalize(o.children[i],value);
		}
	};

	_addValue = function(o, name, value) {
		// if found -> set value
		if(o.uri && (o.uri==name || o.uri.replace("#","")==name)){
			if(!o.value){
				o.value = 0;
			}
			o.value += parseFloat(value);
		} else {
			// traverse all children
			for (var i in o.children) {
				_addValue(o.children[i], name, value);
			}
		}
	};

	return {
		propagate: _propagate
	};

}();

module.exports = ValuePropagation;