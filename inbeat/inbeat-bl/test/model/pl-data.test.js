var PlData = require(process.cwd() + '/model/pl-data');

describe('Model - PL Data', function(){

	afterEach(function(done){
		PlData.model.remove({}, function() {
			done();
		});
	});

	it('upsert', function(done){
		PlData.upsert({"id":"1","content":"var c;"}, function(err){
			PlData.findById('1', function(err, doc){
				if(!err && doc && doc.id=='1' && doc.content==="var c;"){
					done();
				}
			});
		});
	});
	
});

