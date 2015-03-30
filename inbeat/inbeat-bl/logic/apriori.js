/*

	http://win.ua.ac.be/~adrem/bibrem/pubs/fpm_survey.pdf
	http://www-users.cs.umn.edu/~kumar/dmbook/ch6.pdf
	https://fenix.tecnico.ulisboa.pt/downloadFile/3779571250095/licao_9.pdf
	http://staffwww.itn.liu.se/~aidvi/courses/06/dm/lectures/lec7.pdf

 */


(function() {
/**
 * return unique set of items
 * @return {Array} [description]
 */
if (typeof Array.prototype.unique === 'undefined') {
	Array.prototype.unique = function() {
		var o = {}, i, l = this.length, r = [];
		for(i=0; i<l;i+=1) o[this[i]] = this[i];
		for(i in o) r.push(o[i]);
		return r;
	};
}

/**
 * true if array contains element
 * @param  {element} v [description]
 * @return {boolean}   [description]
 */
if (typeof Array.prototype.contains === 'undefined') {
	Array.prototype.contains = function (v) {
		return this.indexOf(v) > -1;
	};
}

/**
 * index of by regexp
 * @type {[type]}
 */
if (typeof Array.prototype.reIndexOf === 'undefined') {
    Array.prototype.reIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };
}


/**
 * Apriori algorithm
 * @author Jaroslav Kuchar
 * @version 0.0.1
 */
var Apriori = (function() {

	var data = [];
	var uniqueTitles = [];

	var minSupport = 0;
	var minConfidence = 0;
	var limit = 100;
	var minLen = 1;
	var filter = "";

	var conf = {};

	var _initAsObject = function(){
		var candidates = [];
		// iterate over all rows 
		for(var i=0; i<data.length; i++){
			// if(i%1000==0){
			// 	console.log(i);
			// }
			// iterate all column
			var titles = Object.keys(data[i]);
			uniqueTitles = uniqueTitles.concat(titles);
			var d = [];
			for(var j=0; j<titles.length; j++){
				if(typeof conf.preprocess !== undefined) {
					if(data[i][titles[j]]!==conf.preprocess){
						// convert to colName=colValue
						d.push(titles[j]+'='+data[i][titles[j]]);
						// add to initial set of candidates
						candidates.push(new Array(titles[j]+'='+data[i][titles[j]]));
					}
				} else {
					// convert to colName=colValue
					d.push(titles[j]+'='+data[i][titles[j]]);
					// add to initial set of candidates
					candidates.push(new Array(titles[j]+'='+data[i][titles[j]]));				}
			}
			data[i] = d;
			// console.log(data[i]);
			data[i].sort();
			uniqueTitles = uniqueTitles.unique();
			candidates = candidates.unique();
		}
		uniqueTitles = uniqueTitles.unique();
		return candidates.unique().sort();
	};

	/*
	var _initAsArray = function(){
		var candidates = [];
		// iterate over all rows 
		for(var i=0; i<data.length; i++){
			// iterate all column
			for(var j=0; j<titles.length; j++){
				// convert to colName=colValue
				data[i][j] = titles[j]+'='+data[i][j];
				// add to initial set of candidates
				candidates.push(new Array(data[i][j]));
			}
			data[i].sort();
		}
		return candidates.unique().sort();
	};
	*/

	var _contains = function(array1, array2){
		// if array1 contains all values from array2 -> true
		for(var i=0; i<array2.length; i++){
			if(!array1.contains(array2[i])){
				return false;
			}
		}
		return true;
	};

	var _computeSupport = function(candidates){
		var out = [];
		for(var c=0;c<candidates.length; c++){
			var support =0;
			for(var d=0; d<data.length; d++){
				if(_contains(data[d],candidates[c])){
					support++;
				}
			}
			out.push(support/data.length);
		}
		return out;
	};

	var _filterCandidates = function(candidates){
		// filter by minSupport
		var support = _computeSupport(candidates);
		// console.log(support);
		var out = [];
		for(var i=0; i< candidates.length; i++){
			// if(candidates[i].reIndexOf(filter)>-1){
			// 	console.log(candidates[i]);
			// }
			if(support[i]>=minSupport && support[i]>0){
			// if(support[i]>=minSupport && support[i]>0 && candidates[i].reIndexOf(filter)>-1){
				out.push(candidates[i]);
			}
		}
		// console.log(out.length);
		return out;
	};

	var _newCandidates = function(oldCandidates, initialCandidates){
		// generate set of new candidates
		var candidates = [];
		// iterate over all old and combine with initial set
		for(var i=0; i<oldCandidates.length; i++){
			for(var j=0; j<initialCandidates.length; j++){
				// only if not exists in the 
				if(!oldCandidates[i].contains(initialCandidates[j][0])){
					candidates.push(oldCandidates[i].concat(initialCandidates[j]).sort());
				}
			}
		}
		// console.log(candidates.length);
		// console.log(candidates.unique().length)
		return candidates.unique();
	};

	var _compare = function(a, b){
		var diff = b.confidence - a.confidence;
		if(diff!==0){
			return diff;
		}
		diff = b.support - a.support;
		if(diff!==0){
			return diff;
		}
		diff = a.antecedent.length - b.antecedent.length;
		if(diff!==0){
			return diff;
		}
		// return b.antecedent.length - a.antecedent.length;
	};

	var _generateRules = function(input){
		// generate final set of rules
		var out = [];
		for(var i=0;i<input.length;i++){
			var candidate = input[i];
			var antecedent = [];
			var consequent = [];
			for(var c=0;c<candidate.length;c++){
				// add only filtered by consequent
				if(candidate[c].indexOf(filter)>-1){
					consequent.push(candidate[c]);
				} else {
					antecedent.push(candidate[c]);
				}
			}
			// add only filtered by consequent and minLen			
			if(consequent.length>0 && antecedent.length >= minLen){
				var rule = _computeMetrics({'antecedent': antecedent, 'consequent': consequent});				
				if(rule.confidence >= minConfidence && rule.support>=minSupport){
					rule.text = "{" + rule.antecedent.join(",") + "} => {" + rule.consequent.join(",") + "}";
					var o = {};
					for(var a=0; a<rule.antecedent.length; a++){
						var part = rule.antecedent[a].split("=");
						o[part[0]] = part[1];
					}
					rule.antecedent = o;

					var o = {};
					for(var a=0; a<rule.consequent.length; a++){
						var part = rule.consequent[a].split("=");
						o[part[0]] = part[1];
					}
					rule.consequent = o;
					out.push(rule);
				}
			}
		}
		return out.sort(_compare);
	};

	var _computeMetrics = function(rule){
		var AB = 0;
		var A = 0;
		for(var d=0; d<data.length; d++){
			if(_contains(data[d],rule.antecedent) && _contains(data[d],rule.consequent)){
				AB++;
			}
			if(_contains(data[d],rule.antecedent)){
				A++;
			}
		}
		rule.support = AB/data.length;
		rule.confidence = AB/A;
		return rule;
	};

	var _run = function(inputs, config){
		data = inputs;
		// config
		if(config.minSupport){
			minSupport = config.minSupport;
		}
		if(config.minConfidence){
			minConfidence = config.minConfidence;
		}
		if(config.limit){
			limit = config.limit;
		}
		if(config.filter){
			filter = config.filter;
		}
		conf = config;
		// initial set of candidates
		initialCandidates = _initAsObject();
		// output set
		var out = [];
		// candidates = initialCandidates;
		// remove by minSupport
		candidates = _filterCandidates(initialCandidates);
		// console.log(initialCandidates);
		// console.log(candidates);
		// process.exit(1);
		// initialCandidates = candidates;
		// add to results
		out = out.concat(candidates);
		for(var t = 0; t<uniqueTitles.length-1; t++){
			// new candidates as combination of previous and initial
			candidates = _newCandidates(candidates,initialCandidates);
			// console.log(candidates);
			// remove by minSupport
			candidates = _filterCandidates(candidates);
			// console.log(candidates);
			// add to results
			out = out.concat(candidates);
			// reached limit of max number of rules
			// console.log(out.length);
			if(out.length>limit){
				break;
			}
		}
		// console.log(out.length);
		var rules = _generateRules(out);
		return rules;
	};

	return {
		run: _run
	};

})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	module.exports = Apriori;
else
	window.Apriori = Apriori;

})();