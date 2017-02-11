/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Rule tests
 */

var Rule = require(process.cwd() + '/model/rule');

describe('Model - Rule', function(){

	afterEach(function(done){
		Rule.model.remove({}, function() {
			done();
		});
	});

	it('upsert', function(done){
		Rule.upsert({"id":"1","content":"var c;"}, function(err){
			Rule.findById('1', function(err, doc){
				if(!err && doc && doc.id=='1' && doc.content==="var c;"){
					done();
				}
			});
		});
	});
	
});

