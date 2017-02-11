/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 * Rule Engine
 * 
 * @version 0.0.1
 */
(function() {

var RuleEngine = (function() {

	/**
	 * Match rule and item
	 * @param  {Rule} rule [description]
	 * @param  {item} item [description]
	 * @return {boolean}      [description]
	 */
	var _matchRule = function(rule, item){
		for(var i = 0; i<Object.keys(rule.antecedent).length;i++){
			var a = Object.keys(rule.antecedent)[i];
			if(Object.keys(item).indexOf(a)>-1 && rule.antecedent[a]==item[a]){
			} else {
				return false;
			}
		}
		return true;
	};

	/**
	 * Match all rules and item
	 * @param  {Array} rules [description]
	 * @param  {Item} item  [description]
	 * @return {boolean}       [description]
	 */
	var _match = function(rules, item){
		var out = [];
		for(var r=0; r<rules.length; r++){
			if(_matchRule(rules[r],item)){
				out.push(rules[r]);
			}
		}
		return out;
	};

	/**
	 * Find array of specified number of unique consequents that match the item
	 * @param  {Array} rules  [description]
	 * @param  {Item} item   [description]
	 * @param  {Number} unique [description]
	 * @return {Array}        [description]
	 */
	var _topMatch = function(rules, item, unique){
		var out = [];
		for(var r=0; r<rules.length; r++){
			var key = Object.keys(rules[r].consequent)[0];
			if(_matchRule(rules[r],item) && out.indexOf(rules[r].consequent[key])===-1){
				out.push(rules[r].consequent[key]);
				if(out.length==unique){
					break;
				}
			}
		}
		return out;
	};

	/**
	 * returns first matching rule
	 * @param  {[type]} rules  [description]
	 * @param  {[type]} item   [description]
	 * @return {[type]}        [description]
	 */
	var _firstMatch = function(rules, item){
		var out = {};
		for(var r=0; r<rules.length; r++){
			var key = Object.keys(rules[r].consequent)[0];
			if(_matchRule(rules[r],item)){
				return rules[r];
			}
		}
		return out;
	};

	return {
		match: _match,
		topMatch: _topMatch,
		firstMatch: _firstMatch
	};

})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	module.exports = RuleEngine;
else
	window.RuleEngine = RuleEngine;

})();
