/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Account test
 */

var Account = require(process.cwd() + '/model/account');

describe('Model - Account', function(){

	before(function(){
	});

	after(function(){
	});

	beforeEach(function(done){
		Account.create({id: '1', status: 'verified', sessionization: 1200}, function(err){
			Account.create({id: '2', status: 'whatever', sessionization: 1500}, function(err){
				done();
			});
		});
	});

	afterEach(function(done){
		Account.model.remove({}, function() {
			done();
		});
	});

	it('Create', function(done){				
		Account.create({id: 'id'}, function(err){
			Account.findById('id', function(err, doc){
				if(!err && doc && doc.id=='id'){
					done();
				}
			});
		});
	});

	it('Is verified - verified', function(done){
		Account.isVerified('1', function(valid){
			valid.should.equal(true);
			done();
		});
	});
	it('Is verified - not verified', function(done){
		Account.isVerified('2', function(valid){
			valid.should.equal(false);
			done();
		});
	});
	it('Is verified - not exists', function(done){
		Account.isVerified('?', function(valid){
			valid.should.equal(false);
			done();
		});
	});

	it('session identification', function(done){
		Account.findById('1', function(err, doc){
			if(!err && doc && doc.getSessionization()==1200){
				done();
			}
		});
	});

	it('upsert', function(done){
		Account.upsert("1",{"sessionization":300}, function(err){
			Account.findById('1', function(err, doc){
				if(!err && doc && doc.id=='1' && doc.getSessionization()==300){
					done();
				}
			});
		});
	});
	
});

