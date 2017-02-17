/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Aggregation Taxonomy tests
 */

var AggregationTaxonomy = require(process.cwd() + '/model/aggregation-taxonomy');

describe('Model - Aggregation Taxonomy', function(){

	afterEach(function(done){
		AggregationTaxonomy.model.remove({}, function() {
			done();
		});
	});

	it('upsert', function(done){
		AggregationTaxonomy.upsert({"id":"1","content":"var c;"}, function(err){
			AggregationTaxonomy.findById('1', function(err, doc){
				if(!err && doc && doc.id=='1' && doc.content==="var c;"){
					done();
				}
			});
		});
	});
	
});

