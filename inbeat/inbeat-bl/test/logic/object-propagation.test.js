/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Object value propagation tests 
 */


var assert = require('assert');

var ValuePropagation = require(process.cwd() + '/logic/object-propagation');



describe('Object propagation', function(){

	var taxonomy = {};
	var resultTaxonomy = {};
	var entities = {};

	beforeEach(function(){
		taxonomy = {
		  "name": "Root",
		  "uri": "http://example.com/taxonomy/root",
		  "children": [{
		      "name": "Food",
		      "uri": "http://example.com/taxonomy/food"
		    },{
		      "name": "Electronics",
		      "uri": "http://example.com/taxonomy/electronics",
		      "children": [{
		        "name": "Televisions",
		        "uri": "http://example.com/taxonomy/televisions"
		      },{
		        "name": "Radios",
		        "uri": "http://example.com/taxonomy/radios"
		      }]
		    }
		  ]
		};
	});

	after(function(){
	});

	it('Propagate 1', function(done){
		resultTaxonomy = {
		  "name": "Root",
		  "uri": "http://example.com/taxonomy/root",
		  "value" : 1,
		  "children": [{
		      "name": "Food",
		      "uri": "http://example.com/taxonomy/food",
		      "value" : 0
		    },{
		      "name": "Electronics",
		      "uri": "http://example.com/taxonomy/electronics",
		      "value" : 1,
		      "children": [{
		        "name": "Televisions",
		        "uri": "http://example.com/taxonomy/televisions",
		        "value" : 1
		      },{
		        "name": "Radios",
		        "uri": "http://example.com/taxonomy/radios",
		        "value" : 0
		      }]
		    }
		  ]
		};
		entities = [{
	        "entityURI":"http://dbpedia.org/resource/Television",
	        "typeURI":"http://example.com/taxonomy/televisions"
	      }];
		ValuePropagation.propagate(taxonomy, entities, function(err, result){
			// console.log(JSON.stringify(result));
			// console.log(JSON.stringify(resultTaxonomy))
			assert.deepEqual(result, resultTaxonomy);
			done();
		});
	});

	it('Propagate 2', function(done){
		resultTaxonomy = {
		  "name": "Root",
		  "uri": "http://example.com/taxonomy/root",
		  "value" : 1,
		  "children": [{
		      "name": "Food",
		      "uri": "http://example.com/taxonomy/food",
		      "value" : 1
		    },{
		      "name": "Electronics",
		      "uri": "http://example.com/taxonomy/electronics",
		      "value" : 0,
		      "children": [{
		        "name": "Televisions",
		        "uri": "http://example.com/taxonomy/televisions",
		        "value" : 0
		      },{
		        "name": "Radios",
		        "uri": "http://example.com/taxonomy/radios",
		        "value" : 0
		      }]
		    }
		  ]
		};
		entities = [{
	      "entityURI":"http://dbpedia.org/resource/Onion",
	      "typeURI":"http://example.com/taxonomy/food"
	    },{
	      "entityURI":"http://dbpedia.org/resource/Salt",
	      "typeURI":"http://example.com/taxonomy/food"
	    }];
		ValuePropagation.propagate(taxonomy, entities, function(err, result){
			assert.deepEqual(result, resultTaxonomy);
			done();
		});
	});

	it('Propagate 3', function(done){
		resultTaxonomy = {
		  "name": "Root",
		  "uri": "http://example.com/taxonomy/root",
		  "value" : 1,
		  "children": [{
		      "name": "Food",
		      "uri": "http://example.com/taxonomy/food",
		      "value" : 1
		    },{
		      "name": "Electronics",
		      "uri": "http://example.com/taxonomy/electronics",
		      "value" : 1,
		      "children": [{
		        "name": "Televisions",
		        "uri": "http://example.com/taxonomy/televisions",
		        "value" : 1
		      },{
		        "name": "Radios",
		        "uri": "http://example.com/taxonomy/radios",
		        "value" : 0
		      }]
		    }
		  ]
		};
		entities = [{
	      "entityURI":"http://dbpedia.org/resource/Television",
	      "typeURI":"http://example.com/taxonomy/televisions"
	    },{
	      "entityURI":"http://dbpedia.org/resource/Salt",
	      "typeURI":"http://example.com/taxonomy/food"
	    }];
		ValuePropagation.propagate(taxonomy, entities, function(err, result){
			assert.deepEqual(result, resultTaxonomy);
			done();
		});
	});

	it('Propagate 4', function(done){
		resultTaxonomy = {
		  "name": "Root",
		  "uri": "http://example.com/taxonomy/root",
		  "value" : 1,
		  "children": [{
		      "name": "Food",
		      "uri": "http://example.com/taxonomy/food",
		      "value" : 1
		    },{
		      "name": "Electronics",
		      "uri": "http://example.com/taxonomy/electronics",
		      "value" : 1,
		      "children": [{
		        "name": "Televisions",
		        "uri": "http://example.com/taxonomy/televisions",
		        "value" : 1
		      },{
		        "name": "Radios",
		        "uri": "http://example.com/taxonomy/radios",
		        "value" : 1
		      }]
		    }
		  ]
		};
		entities = [{
	      "entityURI":"http://dbpedia.org/resource/Television",
	      "typeURI":"http://example.com/taxonomy/televisions"
	    },{
	      "entityURI":"http://dbpedia.org/resource/Salt",
	      "typeURI":"http://example.com/taxonomy/food"
	    },{
	      "entityURI":"http://dbpedia.org/resource/Radio",
	      "typeURI":"http://example.com/taxonomy/radios"
	    }];
		ValuePropagation.propagate(taxonomy, entities, function(err, result){
			assert.deepEqual(result, resultTaxonomy);
			done();
		});
	});

});