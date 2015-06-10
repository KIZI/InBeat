var AggregationRules = require(process.cwd() + '/model/aggregation-rules');

describe('Model - Aggregation Rules', function(){

	afterEach(function(done){
		AggregationRules.model.remove({}, function() {
			done();
		});
	});

	it('upsert', function(done){
		AggregationRules.upsert({"id":"1","content":"var c;"}, function(err){
			AggregationRules.findById('1', function(err, doc){
				if(!err && doc && doc.id=='1' && doc.content==="var c;"){
					done();
				}
			});
		});
	});
	
});

