/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Aggregation taxonomy model object
 */

var AggregationTaxonomy = function() {

	var mongoose = require('mongoose');
	var Schema = require('mongoose').Schema;
	var n3 = require('n3');

	var schema = new Schema({
		id: String,
//        type: String,
		content: String
	});

	var _model = null;
	try {
		_model = mongoose.model('AggregationTaxonomy', schema);
	} catch (err) {}
	_model = mongoose.model('AggregationTaxonomy');

	var _upsert = function(data, callback) {
		_model.update({id:data.id},{$set:data},{upsert:true},callback);
	};

	var _findById = function(id, callback) {
		_model.findOne({
			'id': id
		}, callback);
	};

	var _convert = function(data, callback){

		// tree structure
		var set = {};
		set.size = 0;

		// variables
		var prefix = "http://schema.org";
		var parser = new n3.Parser();

		parser.parse(data, function(error, triple) {
            if (triple) {
                if(triple.subject.indexOf(prefix)!=-1 && (triple.object.indexOf(prefix)!=-1 || triple.predicate == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type')) {

                    // get name from subject of triple of concept from uri (http://example.com#Name)
                    var name = (((triple.subject.split('#'))[1])?((triple.subject.split('#'))[1]):triple.subject.substr(triple.subject.lastIndexOf('/')+1));
                    // if not exists in set
                    if (!set[name]) {
                        // create new object and set default values
                        set[name] = {};
                        set[name].uri = triple.subject;
                        set[name].name = name;
                        // default parent
                        set[name].parent = 'Thing';
                        set.size++;
                    }
                    if (triple.predicate == 'http://www.w3.org/2000/01/rdf-schema#subClassOf') {
                        // get parent name from object of triple
                        var par = (((triple.object.split('#'))[1])?((triple.object.split('#'))[1]):triple.object.substr(triple.object.lastIndexOf('/')+1));
                        // set parent if exists
                        set[name].parent = par;
                    }
                    if (triple.predicate == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
                        // get type
                        var par2 = (((triple.object.split('#'))[1])?((triple.object.split('#'))[1]):triple.object.substr(triple.object.lastIndexOf('/')+1));
                        // set parent if exists
                        set[name].type = par2;
                    }
                }
            } else {
                // all triples processed
                for(var i in set){
                    if((set[i].type && set[i].type!='Class') || i=='Thing' || i=='schema-tmp'){
                        delete set[i];
                        set.size--;
                    } else {
                        delete set[i].type;
                    }
                }
                var tree = _buildTree(set, prefix);
                callback(null, tree);
            }
        });

	};

	var _buildTree = function(set, prefix) {
		var tree = {};
	    // root
	    tree.name = 'Thing';
	    tree.uri = prefix+'#Thing';
	    tree.children = [];
	    // while anything in set except size property
	    while (set.size > 0) {
	        // get keys from set
	        var keys = Object.keys(set);
	        // iterate all, skip first = size property
	        for (var i = 0; i < keys.length; i++) {
	            // get object from set
	            var top = set[Object.keys(set)[i]];
	            // if exists
	            if (top && top.parent) {
	                // find object parent in tree
	                var p = _traverse(tree, top.parent);
	                // if exists
	                if (p) {
	                    // if leaf, add children
	                    if (!p.children) {
	                        p.children = [];
	                    }
	                    // delete parent link
	                    delete top.parent;
	                    // add object as child of parent
	                    p.children.push(top);
	                    // decrease set
	                    set.size--;
	                    delete set[top.name];
	                }
	            } else {
	                if(top && top.name=='Thing'){
	                    // decrease set
	                    set.size--;
	                    delete set[top.name];
	                }
	            }
	        }
	    }
	    return tree;
	};

	var _traverse = function (o, name) {
	    // if found -> return
	    if (o.name == name) {
	        return o;
	    } else {
	        // traverse all children
	        var ret = null;
	        for (var i in o.children) {
	            var r = _traverse(o.children[i], name);
	            if (r) {
	                ret = r;
	            }
	        }
	        return ret;
	    }
	};



	return {
		model: _model,
		upsert: _upsert,
		findById: _findById,
		convert: _convert
	};

}();

module.exports = AggregationTaxonomy;