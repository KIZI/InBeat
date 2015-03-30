var MysqlConnector = function() {

	var mysql = require('mysql');
	var connection = null;

	_startConnection = function(conn) {
		if (conn) {
			conn.multipleStatements = true;
			connection = mysql.createConnection(conn);
			connection.connect();
		}
	};

	_endConnection = function() {
		if (connection) {
			connection.end();
			connection = null;
			//connection.destroy();
		}
	};

	_execute = function(q, callback) {
		if (!connection) {
			callback("No connection");
			return;
		}
		if (!q || q === "") {
			callback("No query");
			return;
		}
		connection.query(q, function(err, result) {
			callback(err,result);
		});
	};

	return {
		startConnection: _startConnection,
		endConnection: _endConnection,
		execute: _execute
	};

}();
module.exports = MysqlConnector;