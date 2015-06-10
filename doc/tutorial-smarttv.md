# InBeat - Smart TV Use Case 

Let consider the Smart TV use case where the content in semantially enriched. Each fragment of multimedia content is extended about a set of semantic features that describe the fragment. 

The Smart TV is able to collect inforamtion from two inputs: remote control and Microsoft Kinect sensor. Remote control is for basic actions like play, pause, skip etc. Microsoft Kinect can provide additional interest clues like watching the screen or emotions.

## Accounts

To create account you can use either REST API call or [http://localhost:8880/admin/#/gain-adminAccount](http://localhost:8880/admin/#/gain-adminAccount)

Default admin credentials are (can be changed by manual editting of ./inbeat/config.js configuration file):
* username: admin
* password: admin

For the following information about account:

id | status | sessionization | credentials
--- | --- | --- | --- 
INBEAT-TUTORIAL | verified | 30 | INBEAT-TUTORIAL:INBEAT-TUTORIAL

Insert the following JSON format to the admin interface:

```json
[
  {
    "id": "INBEAT-TUTORIAL",
    "status": "verified",
    "sessionization": 30,
    "credentials": "INBEAT-TUTORIAL:INBEAT-TUTORIAL"
  }
]
```

Or use cURL to send a request:


```bash
# Create account in InBeat
curl --user "admin:admin" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/admin/account --data-binary '[
  {
    "id": "INBEAT-TUTORIAL",
    "status": "verified",
    "sessionization": 30,
    "credentials": "INBEAT-TUTORIAL:INBEAT-TUTORIAL"
  }
]'
```


### Agregation Rules

The remotet control and Microsoft Kinect sensor can send various actions and each action can represent different level of user interest. We can set for each action rule which increases or decreases overall interest of the item.

action | interest change
--- | --- 
play | 0
skip | -1
volumeup | +0.5
smile | +0.5

The set of rules is presented by JavaScript code. For the previous example:
```javascript
if(interaction.attributes.action==="play") {
	aggregation.interest = 0;
} else if(interaction.attributes.action==="skip") {
	aggregation.interest = -1;
} else if(interaction.attributes.action==="volumeup") {
	aggregation.interest = +0.5;
} else if(interaction.attributes.action==="smile") {
  aggregation.interest = +0.5;
}
```

Insert the previous code to the web admin console [http://localhost:8880/admin/#/gain-aggregation-rules](http://localhost:8880/admin/#/gain-aggregation-rules)
or use the cURL call

```bash
# Create aggregation rules
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/INBEAT-TUTORIAL/aggregation/rules --data-binary '{
  "body": "if(interaction.attributes.action===\"play\") {	aggregation.interest = 0;} else if(interaction.attributes.action===\"skip\") {	aggregation.interest = -1;} else if(interaction.attributes.action===\"volumeup\") {	aggregation.interest = +0.5;} else if(interaction.attributes.action===\"smile\") {  aggregation.interest = +0.5;}"
}'
```

### Aggregation Taxonomy

Each content can be described by a set of items from the following taxonomy:

For the following taxonomy:

* Root
  * Food
  * Electronics
    * Televisions
    * Radios


JSON representation:

```json
{
  "name": "Root",
  "uri": "http://example.com/taxonomy/root",
  "children": [{
      "name": "Food",
      "uri": "http://example.com/taxonomy/food"
    },{
      "name": "Electronics",
      "uri": "http://example.com/taxonomy/electronics",
      "children": [{
        "name": "Televisions",
        "uri": "http://example.com/taxonomy/televisions"
      },{
        "name": "Radios",
        "uri": "http://example.com/taxonomy/radios"
      }]
    }
  ]
}
```

Use the web admin console [http://localhost:8880/admin/#/gain-aggregation-taxonomy](http://localhost:8880/admin/#/gain-aggregation-taxonomy) or 

```bash
# Create aggregation taxonomy
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/INBEAT-TUTORIAL/aggregation/taxonomy --data-binary '{
  "body": "{\"name\": \"Root\",\"uri\": \"http://example.com/taxonomy/root\",\"children\": [{      \"name\": \"Food\",\"uri\": \"http://example.com/taxonomy/food\"},{\"name\": \"Electronics\",      \"uri\": \"http://example.com/taxonomy/electronics\",\"children\": [{\"name\": \"Televisions\", \"uri\": \"http://example.com/taxonomy/televisions\"},{\"name\": \"Radios\", \"uri\": \"http://example.com/taxonomy/radios\"}]}]}"
}'
```

### Content

Let consider there are two advertisment videos: first about Televisions and the second about Food.


objectId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Television | entity_Onion | entity_Salt
--- | --- | --- | --- | --- | --- | --- | --- | ---
http://example.com/objects/object1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0
http://example.com/objects/object2 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1

Those description of objects can be predefined in InBeat using web admin console [http://localhost:8880/admin/#/gain-description](http://localhost:8880/admin/#/gain-description) or REST API call.


The description of both objects in JSON is:

```json
[
    {
      "accountId": "INBEAT-TUTORIAL",
      "objectId":"http://example.com/objects/object1",
      "entities":[{
        "entityURI":"http://dbpedia.org/resource/Television",
        "typeURI":"http://example.com/taxonomy/televisions"
      }]
    },
    {
      "accountId": "INBEAT-TUTORIAL",
      "objectId":"http://example.com/objects/object2",
      "entities":[{
        "entityURI":"http://dbpedia.org/resource/Onion",
        "typeURI":"http://example.com/taxonomy/food"
      },{
        "entityURI":"http://dbpedia.org/resource/Salt",
        "typeURI":"http://example.com/taxonomy/food"
      }]
    }
]
```

Description of object can be part of each interaction too. See the next section of this tutorial for more details.

Example of REST API call:

```bash
# Update attributes
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X POST --header "Content-Type: application/json" "http://localhost:8880/gain/api/INBEAT-TUTORIAL/object/attributes" --data-binary '[
    {
      "accountId": "INBEAT-TUTORIAL",
      "objectId":"http://example.com/objects/object1",
      "entities":[{
        "entityURI":"http://dbpedia.org/resource/Television",
        "typeURI":"http://example.com/taxonomy/televisions"
      }]
    },
    {
      "accountId": "INBEAT-TUTORIAL",
      "objectId":"http://example.com/objects/object2",
      "entities":[{
        "entityURI":"http://dbpedia.org/resource/Onion",
        "typeURI":"http://example.com/taxonomy/food"
      },{
        "entityURI":"http://dbpedia.org/resource/Salt",
        "typeURI":"http://example.com/taxonomy/food"
      }]
    }
]'
```

### Actions

The tutorial user (identified by http://example.com/users/user1) provides three actions during the session in front of TV. During the first advertisment he smiled (detected by Microsoft Kinect) and increased volume. The second advertisement he skipped using the remote control button. 


The first and second action is in JSON format represented as follows:

```json
{
  "accountId": "INBEAT-TUTORIAL",
  "type": "event",
  "attributes":{
    "action":"smile"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object1",
  "object":{
    "objectId":"http://example.com/objects/object1",
    "entities":[{
      "entityURI":"http://dbpedia.org/resource/Television",
      "typeURI":"http://example.com/taxonomy/televisions"
    }]
  }
}
```

```json
{
  "accountId": "INBEAT-TUTORIAL",
  "type": "event",
  "attributes":{
    "action":"volumeup"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object1",
  "object":{
    "objectId":"http://example.com/objects/object1",
    "entities":[{
      "entityURI":"http://dbpedia.org/resource/Television",
      "typeURI":"http://example.com/taxonomy/televisions"
    }]
  }
}
```


The third action is in JSON format represented as follows:

```json
{
  "accountId": "INBEAT-TUTORIAL",
  "type": "event",
  "attributes":{
    "action":"skip"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object2",
  "object":{
    "objectId":"http://example.com/objects/object2",
    "entities":[{
      "entityURI":"http://dbpedia.org/resource/Onion",
      "typeURI":"http://example.com/taxonomy/food"
    },{
      "entityURI":"http://dbpedia.org/resource/Salt",
      "typeURI":"http://example.com/taxonomy/food"
    }]
  }
}
```

Use the web admin console [http://localhost:8880/admin/#/gain-listener](http://localhost:8880/admin/#/gain-listener) or 

```bash
# Send events
curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
  "accountId": "INBEAT-TUTORIAL",
  "type": "event",
  "attributes":{
    "action":"smile"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object1",
  "object":{
    "objectId":"http://example.com/objects/object1",
    "entities":[{
      "entityURI":"http://dbpedia.org/resource/Television",
      "typeURI":"http://example.com/taxonomy/televisions"
    }]
  }
}'

curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
  "accountId": "INBEAT-TUTORIAL",
  "type": "event",
  "attributes":{
    "action":"volumeup"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object1",
  "object":{
    "objectId":"http://example.com/objects/object1",
    "entities":[{
      "entityURI":"http://dbpedia.org/resource/Television",
      "typeURI":"http://example.com/taxonomy/televisions"
    }]
  }
}'

curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
  "accountId": "INBEAT-TUTORIAL",
  "type": "event",
  "attributes":{
    "action":"skip"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object2",
  "object":{
    "objectId":"http://example.com/objects/object2",
    "entities":[{
      "entityURI":"http://dbpedia.org/resource/Onion",
      "typeURI":"http://example.com/taxonomy/food"
    },{
      "entityURI":"http://dbpedia.org/resource/Salt",
      "typeURI":"http://example.com/taxonomy/food"
    }]
  }
}'
```

objectId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Television | entity_Onion | entity_Salt | Action
--- | --- | --- | --- | --- | --- | --- | --- | --- | ---
http://example.com/objects/object1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | smile
http://example.com/objects/object1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | volumeup
http://example.com/objects/object2 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | skip


### Export of aggregated interests

Use the web admin console [http://localhost:8880/admin/#/gain-export](http://localhost:8880/admin/#/gain-export) or 

```bash
# Get export
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" "http://localhost:8880/gain/api/INBEAT-TUTORIAL/export/interests?uid=http://example.com/users/user1" > export.json
```

Example of output in JSON:
```json
[{
  "accountId": "INBEAT-TUTORIAL",
  "objectId": "http://example.com/objects/object1",
  "parentObjectId": "",
  "sessionId": "1427725950907",
  "userId": "http://example.com/users/user1",
  "interest": 1,
  "type_Root": 1,
  "type_Electronics": 1,
  "type_Televisions": 1,
  "entity_Television": 1,
  "last": "1427725950959"
}, {
  "accountId": "INBEAT-TUTORIAL",
  "objectId": "http://example.com/objects/object2",
  "parentObjectId": "",
  "sessionId": "1427725950907",
  "userId": "http://example.com/users/user1",
  "interest": -1,
  "type_Root": 1,
  "type_Food": 1,
  "entity_Onion": 1,
  "entity_Salt": 1,
  "last": "1427725951539"
}]
```

The tabular represrntation is following:

accountId | objectId | parentObjectId | sessionId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Television | entity_Onion | entity_Salt | interest
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
INBEAT-TUTORIAL | http://example.com/objects/object1 | | 1427725950907 | **1** | 0 | **1** | 1 | 0 | 1 | 0 | 0 | **1**
INBEAT-TUTORIAL | http://example.com/objects/object2 | | 1427725950907 | **1** | 1 | 0 | 0 | 0 | 0 | 1 | 1 | **-1**

Final value of interest is computed and output of taxonomy propagation is provided. 
For the first object user provided two interaction, both of them increased total interest by +0.5. The final value is +1.


### Preference learning

Use the web admin console [http://localhost:8880/admin/#/pl-data](http://localhost:8880/admin/#/pl-data) and 
[http://localhost:8880/admin/#/pl-rule](http://localhost:8880/admin/#/pl-rule)
or 

```bash
# Upload to PL
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" -d@export.json "http://localhost:8880/pl/api/INBEAT-TUTORIAL/data?uid=http://example.com/users/user1"
```

Rule mining can be initiated with a set of parameters: type (jsapriori|arules|lm) , support and confidence.

```json
{
  "type": "jsapriori",
  "support": 0.01,
  "confidence": 0.01
}
```

```bash
# Get rules
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" "http://localhost:8880/pl/api/INBEAT-TUTORIAL/rules?uid=http://example.com/users/user1" --data-binary '{
  "type": "jsapriori",
  "support": 0.01,
  "confidence": 0.01
}' > rules.json
```

Example of output:
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

All mined rules, sorted according to CBA (decreasingly by confidence, support, rule length):

rule | support | confidence
--- | --- | ---
{type_Electronics=1} => {interest=positive} | 0.5 | 1
{type_Televisions=1} => {interest=positive} | 0.5 | 1 
{entity_Onion=1} => {interest=negative} | 0.5 | 1
{entity_Salt=1} => {interest=negative} | 0.5 | 1
{entity_Television=1} => {interest=positive} | 0.5 | 1
{type_Food=1} => {interest=negative} | 0.5 | 1
{type_Electronics=1,type_Root=1} => {interest=positive} | 0.5 | 1
{type_Electronics=1,type_Televisions=1} => {interest=positive} | 0.5 | 1
{type_Electronics=1,entity_Television=1} => {interest=positive} | 0.5 | 1
{type_Food=1,type_Root=1} => {interest=negative} | 0.5 | 1
{type_Food=1,entity_Onion=1} => {interest=negative} | 0.5 | 1
{type_Food=1,entity_Salt=1} => {interest=negative} | 0.5 | 1
{type_Root=1,type_Televisions=1} => {interest=positive} | 0.5 | 1
{type_Root=1,entity_Onion=1} => {interest=negative} | 0.5 | 1
{type_Root=1,entity_Salt=1} => {interest=negative} | 0.5 | 1
{type_Root=1,entity_Television=1} => {interest=positive} | 0.5 | 1
{type_Televisions=1,entity_Television=1} => {interest=positive} | 0.5 | 1
{entity_Onion=1,entity_Salt=1} => {interest=negative} | 0.5 | 1
{type_Root=1,entity_Onion=1,entity_Salt=1} => {interest=negative} | 0.5 | 1
{type_Electronics=1,type_Root=1,type_Televisions=1} => {interest=positive} | 0.5 | 1
{type_Electronics=1,type_Root=1,entity_Television=1} => {interest=positive} | 0.5 | 1
{type_Electronics=1,type_Televisions=1,entity_Television=1} => {interest=positive} | 0.5 | 1
{type_Food=1,type_Root=1,entity_Onion=1} => {interest=negative} | 0.5 | 1
{type_Food=1,type_Root=1,entity_Salt=1} => {interest=negative} | 0.5 | 1
{type_Food=1,entity_Onion=1,entity_Salt=1} => {interest=negative} | 0.5 | 1
{type_Root=1,type_Televisions=1,entity_Television=1} => {interest=positive} | 0.5 | 1
{type_Food=1,type_Root=1,entity_Onion=1,entity_Salt=1} => {interest=negative} | 0.5 | 1
{type_Electronics=1,type_Root=1,type_Televisions=1,entity_Television=1} => {interest=positive} | 0.5 | 1
{type_Root=1} => {interest=positive} | 0.5 | 0.5 
{type_Root=1} => {interest=negative} | 0.5 | 0.5 


### New objects for classification

objectId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Garlic | entity_Radio
--- | --- | --- | --- | --- | --- | --- | --- 
http://example.com/objects/object3 | 0 | 1 | 0 | 0 | 0 | 1 | 0
http://example.com/objects/object4 | 0 | 0 | 0 | 0 | 1 | 0 | 1

Create on [http://localhost:8880/admin/#/gain-description](http://localhost:8880/admin/#/gain-description)

using:

```json
[
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object3",
        "entities": [
            {
                "typeURI": "http://example.com/taxonomy/food",
                "entityURI": "http://dbpedia.org/resource/Garlic"
            }
        ]
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object4",
        "entities": [
            {
                "typeURI": "http://example.com/taxonomy/radios",
                "entityURI": "http://dbpedia.org/resource/Radio"
            }
        ]
    }
]
```

or 

```bash
# Create new objects
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X POST --header "Content-Type: application/json" "http://localhost:8880/gain/api/INBEAT-TUTORIAL/object/attributes" --data-binary '
[
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object3",
        "entities": [
            {
                "typeURI": "http://example.com/taxonomy/food",
                "entityURI": "http://dbpedia.org/resource/Garlic"
            }
        ]
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object4",
        "entities": [
            {
                "typeURI": "http://example.com/taxonomy/radios",
                "entityURI": "http://dbpedia.org/resource/Radio"
            }
        ]
    }
]'
```

### Classification/Recommender System

Use the web admin console [http://localhost:8880/admin/#/rs-rule](http://localhost:8880/admin/#/rs-rule) and 
[http://localhost:8880/admin/#/rs-classification](http://localhost:8880/admin/#/rs-classification)

or

```bash
# Upload rules RS
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" -d@rules.json "http://localhost:8880/rs/api/INBEAT-TUTORIAL/rules?uid=http://example.com/users/user1"
```

```bash
# Classify
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT "http://localhost:8880/rs/api/INBEAT-TUTORIAL/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object3"

curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT "http://localhost:8880/rs/api/INBEAT-TUTORIAL/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object4"
```

The output:

```json
[{"objectId":"http://example.com/objects/object3","rank":"negative"}]
```
```json
[{"objectId":"http://example.com/objects/object4","rank":"positive"}]
```

objectId | rank | confidence
--- | --- 
http://example.com/objects/object3 | negative | 1
http://example.com/objects/object4 | positive | 1


For the third object (about _Food_, _Garlic_). Since user skipped object about _Food_(_Onion_), the third objects is ranked as _negative_. Rule _{type_Food=1} => {interest=negative}_ is used for classification.

For the fourth object (about _Radios_, _Radio_). Since user smiled during the advertisment about _Televisions_(_Television_) and both _Televisions_ and _Radios_ are subgroups of _Electronics_, the fourth objects is ranked as _positive_. Rule _{type_Electronics=1} => {interest=positive}_ is used for classifiaction.

