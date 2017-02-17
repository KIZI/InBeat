/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * User interest conversion formats tests
 */


var assert = require('assert');

var UserInterest = require(process.cwd() + '/logic/user-interest');

describe('Format Export Output', function(){

	var input = {};

	before(function(){
		input = [
		{a:1,b:2},
		{a:3,c:0},
		{d:1}
		]
	});

	after(function(){
	});

	it('CSV', function(done){
		UserInterest.formatExportOutput(input, 'text/csv',{}, function(err, result){
			assert.equal(result, "a;b;c;d\n1;2;0;0\n3;0;0;0\n0;0;0;1\n");
			done();
		});
	});

	it('MySQL', function(done){
		UserInterest.formatExportOutput(input, 'text/plain',{}, function(err, result){
			var resultMysql = "DROP TABLE IF EXISTS `TEST`; \n\
CREATE TABLE `TEST` (Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`accountId` TEXT , `userId` TEXT, `sessionId` TEXT, `objectId` TEXT, `parentObjectId` TEXT, `a` FLOAT default 0, `b` FLOAT default 0, `c` FLOAT default 0, `d` FLOAT default 0);\n\
INSERT INTO `TEST`(Id, `a`, `b` ) VALUES (0,\"1\", \"2\");\n\
INSERT INTO `TEST`(Id, `a`, `c` ) VALUES (0,\"3\", \"0\");\n\
INSERT INTO `TEST`(Id, `d` ) VALUES (0,\"1\");\n"
			assert.equal(result, resultMysql);
			done();
		});
	});

	it('JSON', function(done){
		UserInterest.formatExportOutput(input, 'application/json',{}, function(err, result){
			assert.equal(result, JSON.stringify(input));
			done();
		});
	});

});