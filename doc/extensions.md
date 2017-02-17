# InBeat - Extensions
This web page covers currently available possibilities for custom extensions (Others will be announced soon!).

## Custom Interceptors
Interceptors are designed for processing of input interactions. Developers can create their own custom collector and processor of interaction that intercepts and transform the data formats. 

Currently mainly REST-based interceptor is supported.

Required format for the storage engine is following (required attributes are also mentioned):
```json
var interaction = {};
interaction.date = new Date();
interaction.accountId = "id_account";
interaction.attributes = {};

interaction.user = {};
interaction.user.id = "id_user";
interaction.user.attributes = {};

interaction.object = {};
interaction.object.id = "id_object";
interaction.object.attributes = {};

interaction.session = {};
interaction.session.attributes = {};
```

Developers should create their own implementations of transformations from their input format to the required format,

Example:
```javascript
exports.processRequest = function(request, callbackRequest) {
  // return if invalid request
  if (!request || request.method != 'POST') {
    callbackRequest("invalid request - null", null);
    return;
  }

  var body = '';
  request.on('data', function(postdata) {
    body += postdata;
    if (body.length > 1e6) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      request.connection.destroy();
    }
  });
  request.on('end', function() {
    try {
      var parsedData = JSON.parse(body);
      var interaction = {};
      interaction.accountId = parsedData.accountId;
      // ... other conversions
      callbackRequest(null, interaction);
    } catch (err) {
      callbackRequest("invalid REST request " + err, null);
      return;
    }

  });

};
```

Place the implementation to the directory: ``inbeat/inbeat-gain/listener/interceptor/`` and change the path to the new interceptor in ``inbeat/inbeat-gain/listener/server.js``

## Custom Miners

Developers can connect their own rule mining implementations to learn user preference models. 

Currently three miner types are supported:

- R arules Apriori
- Pure JS Apriori implementation
- Experimental external miner - EasyMiner/LispMiner (under development)

Required format of rules:
```json
[
{}, {
  "antecedent": {
    "type_Food": "1"
  },
  "consequent": {
    "interest": "negative"
  },
  "support": 0.5,
  "confidence": 1,
  "text": "{type_Food=1} => {interest=negative}"
},
, {
  "antecedent": {
    "type_Electronics": "1"
  },
  "consequent": {
    "interest": "positive"
  },
  "support": 0.5,
  "confidence": 1,
  "text": "{type_Electronics=1} => {interest=positive}"
},
{}
]
```

Example of the implementation: 
```javascript
var MinerArules = function() {
    // perform mining task
    var _task = function(name,task,callback){
        // read data for PL
        PLData.findById(name,function(err,data){
            if(err || !data || !data.content){
                callback(err,null);
                return;
            }
            var interactions = JSON.parse(data.content);
            // preprocessing
            ...            
            // start mining
            var rules = Apriori.run(interactions, ...);
            callback(null,JSON.stringify(rules));
        });
    };

    return {
        mine: _task
    };
}();
module.exports = MinerArules;
```

Place the implementation to the directory: ``inbeat/inbeat-bl/logic/`` and change the configuration in ``inbeat/inbeat-pl/routes.js``
