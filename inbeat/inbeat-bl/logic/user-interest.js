/**
 * InBeat - Interest Beat
 * @author Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
 * 
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file. 
 * 
 */

/**
 * Exporting user interests in multiple representations
 */

var UserInterest = function() {

    var _ = require('underscore');

    // export data in multiple formats
	_formatExportOutput = function(output, format, params, callback) {
		if (!output || output.length <= 0) {
			callback(null, "");
			return;
		}
        var keys = [];
        for (var i in output) {
            keys = _.union(keys,Object.keys(output[i]));
        }
		var res = "";
		switch (format) {
			case 'text/csv':
				res = "";
				res += (keys.join(";") + "\n");
				for (var i in output) {
                    if(Object.keys(output[i]).length > 0) {
                        for (k = 0; k < keys.length; k++) {
                            if (k < keys.length - 1)
                                res += ((output[i][keys[k]]?output[i][keys[k]]:"0") + ";");
                            else
                                res += ((output[i][keys[k]]?output[i][keys[k]]:"0") + "\n");
                        }
                    }
                }
				callback(null, res);
				break;
			case 'text/plain':
				var tablename = "`TEST`";
				if (params && params.tablename) {
					tablename = "`" + params.tablename + "`";
				}
				res = "";
				res += ("DROP TABLE IF EXISTS " + tablename + "; \n");
				res += ("CREATE TABLE " + tablename + " (Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,");
				var subout = JSON.parse(JSON.stringify(keys));
                subout = _.without(subout,"accountId","userId","sessionId","objectId","parentObjectId");
                subout = _.map(subout,function(val){
                    val = val.replace(/^\s+|\s+$/g, '');
                    val = val.replace(/\W/g, '');
                    return val;
                });
				res += "`accountId` TEXT , `userId` TEXT, `sessionId` TEXT, `objectId` TEXT, `parentObjectId` TEXT, `" + ((subout).join("` FLOAT default 0, `") + "` FLOAT default 0);\n");
				for (i in output) {
					// IGNORE
                    if(Object.keys(output[i]).length >0) {
                        res += ("INSERT INTO " + tablename + "(Id, ");
                        var names = _.map(Object.keys(output[i]), function (val) {
                            val = val.replace(/^\s+|\s+$/g, '');
                            val = val.replace(/\W/g, '');
                            return val;
                        });
                        res += "`" + (names.join("`, `") + "` ) VALUES (0,\"");

                        for (k = 0; k < Object.keys(output[i]).length; k++) {
                            if (k < Object.keys(output[i]).length - 1)
                                res += (output[i][Object.keys(output[i])[k]] + "\", \"");
                            else
                                res += (output[i][Object.keys(output[i])[k]] + "\");\n");
                        }
                    }
				}
				callback(null, res);
				break;
			default:
				callback(null, JSON.stringify(output));
				break;
		}

	};


	return {
		// getAllUserInterests: _getAllUserInterests,
		formatExportOutput: _formatExportOutput
	};

}();
module.exports = UserInterest;