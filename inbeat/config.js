var configurations = {
	"test": {
		"inbeat-frontend": {
			"port": 8080
		},
		"inbeat-gain": {
			"listener-port": 3333,
			"api-port": 4401
		},
		"inbeat-pl": {
			"port": 4402
		},
		"inbeat-rs": {
			"port": 4403
		},
        "admin": {
            "credentials": "admin:admin"
        },
		"mongo": {
			"url": "mongodb://localhost/inbeat-test"
		},
		"mysql": {
			"host": "",
			"database": "",
			"user": "",
			"password": ""
		}
	},
	"development": {
		"inbeat-frontend": {
			"port": 8080
		},
		"inbeat-gain": {
			"listener-port": 3333,
			"api-port": 4401
		},
		"inbeat-pl": {
			"port": 4402
		},
		"inbeat-rs": {
			"port": 4403
		},
        "admin": {
            "credentials": "admin:admin"
        },
		"mongo": {
			"url": "mongodb://localhost/inbeat"
		},
		"mysql": {
			"host": "",
			"database": "",
			"user": "",
			"password": ""
		}
	},
	"production": {
		"inbeat-frontend": {
			"port": 8080
		},
		"inbeat-gain": {
			"listener-port": 3333,
			"api-port": 4401
		},
		"inbeat-pl": {
			"port": 4402
		},
		"inbeat-rs": {
			"port": 4403
		},
        "admin": {
            "credentials": "admin:admin"
        },
		"mongo": {
			"url": "mongodb://inbeat:inbeat@localhost/inbeat"
		},
		"mysql": {
			"host": "",
			"database": "",
			"user": "",
			"password": ""
		}
	}
};
module.exports = configurations;