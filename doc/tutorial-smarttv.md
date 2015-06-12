# InBeat Tutorial - Sensors and Ontologies  

This tutorial describes a complex deployment of InBeat on a "SmartTV" use case, covering advanced topics such as **sensor input**, semantic description of content with **entities** and **ontologies**, application of hand-coded rules for aggregation of implicit feedback into *interest*, and building of **rule-based user models**.

**_A live demo_** (using simulation buttons instead of real Microsoft Kinect sensor) is available at http://inbeat.eu/demo/base/.

###The story
InBeat is used to process information about behaviour of TV watchers coming from Microsoft Kinect positioned below the television. The user is recommended new multimedia content to see based on the preference model built by InBeat. 

###Input data
There are multiple implicit feedback actions send by Kinect for each object (shot), such as *smile* or *user is watching* , in addition to user actions with a remote control such as *pause*. The textual content of the broadcast is semantically enriched with entities, which are linked to the DBpedia ontology. 

The InBeat administrator further needs to provide the definition of aggregation rules for computing the interest.

###What this tutorial covers

Setup
- [Creating user account](#accounts)
- [Definition of interest aggregation rules](#agregation-rules)
- [Definition of the taxonomy (ontology) describing content](#aggregation-taxonomy)
- [Description of content with entities](#content)

User data acquistion
- [Format in which InBeat receives user actions](#actions)

User model  building and recommendation
- [Export of aggregated data](#export-of-aggregated-interests)
- [Building rule-based preference model](#preference-learning)
- [Description of objects for recommendation](#new-objects-for-classification)
- [Use of the model to rank new content](#classificationrecommender-system)



## Accounts

To create account you can use either a REST API call or [http://localhost:8880/admin/#/gain-adminAccount](http://localhost:8880/admin/#/gain-adminAccount)

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


### Aggregation Rules

The remote control and Microsoft Kinect sensor can send various actions. Each action can represent a  different level of user interest. Let's setup for each action a  rule which increases or decreases overall interest of the item.

action | interest change
--- | --- 
play | 0
skip | -1
volumeup | +0.5
smile | +0.5

The rules are encoded using JavaScript as:
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

Let the objects  be described using the following taxonomy (ontology):

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

Let us consider there are two videos the users can interact with: first about televisions and the second about food.


objectId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Television | entity_Onion | entity_Salt
--- | --- | --- | --- | --- | --- | --- | --- | ---
http://example.com/objects/object1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0
http://example.com/objects/object2 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1

The description of the objects can be predefined in InBeat using the web admin console [http://localhost:8880/admin/#/gain-description](http://localhost:8880/admin/#/gain-description) or REST API call.


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

The objects do not have to be defined before hand. The other option is that the description of the object is sent as  part of the user action. See the next section of this tutorial for more details.

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

Let us assume that the tutorial user (identified by http://example.com/users/user1) provides three actions during the session in front of the TV. During the first video she smiles (detected by Microsoft Kinect) and increases volume. The second video is skipped using the remote control button. 


The first and second action is in the JSON format represented as follows:

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


The third action is in the JSON format represented as follows:

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

The tabular representation is following:

accountId | objectId | parentObjectId | sessionId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Television | entity_Onion | entity_Salt | interest
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
INBEAT-TUTORIAL | http://example.com/objects/object1 | | 1427725950907 | **1** | 0 | **1** | 1 | 0 | 1 | 0 | 0 | **1**
INBEAT-TUTORIAL | http://example.com/objects/object2 | | 1427725950907 | **1** | 1 | 0 | 0 | 0 | 0 | 1 | 1 | **-1**

This export contains the final value of interest as well as the result of  taxonomy propagation. 
For the first object, the user provided two interaction, both of them increased total interest by +0.5. The final value is +1.


### Preference learning

Use the web admin console [http://localhost:8880/admin/#/pl-data](http://localhost:8880/admin/#/pl-data) and 
[http://localhost:8880/admin/#/pl-rule](http://localhost:8880/admin/#/pl-rule)
or 

```bash
# Upload to PL
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" -d@export.json "http://localhost:8880/pl/api/INBEAT-TUTORIAL/data?uid=http://example.com/users/user1"
```

Rule mining can be initiated with the following set of parameters: type (jsapriori|arules|lm), support and confidence. We will use the built-in jsapriori rule learner.
Support and confidence are two standard parameters of association rule learning, for explanation refer e.g. to [Wikipedia](http://en.wikipedia.org/wiki/Association_rule_learning#Useful_Concepts).

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

Example output:
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

The resulting rules are sorted in a descending order according to the following criteria: confidence, support, rule length. The order is important, because it determines which rule will be used in case of multiple rules match a test instance.


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
Let us assume that the recommendations are drawn from the set of two objects: object3 and object4. The description of these objects needs to be submitted to InBeat. 

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
In this final phase, we use the user's profile consisting of ordered set of rules to rank two possible objects to recommend: object3 and object4. 

This phase consists of two steps: 
- upload of the rule set exported by the InBeat preference learning module to the recommender (i.e. a simple rule engine), 
- invocation of the engine on the object3 and object4


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
--- | --- | ---
http://example.com/objects/object3 | negative | 1
http://example.com/objects/object4 | positive | 1

The reason why  the third object (about _Food_, _Garlic_) is ranked as _negative_ is as follows. Since user skipped the object about _Food_(_Onion_), there is a rule _{type_Food=1} => {interest=negative}_ in the rule list. Since this is the highest rule matching the description of _object3_, it is used for classification. 

The reason why  fourth object (about _Radios_, _Radio_) is ranked as _positive_ is as follows. Since the user smiled during the video about _Televisions_(_Television_) and both _Televisions_ and _Radios_ are subsued under _Electronics_ in the taxonomy, there is a rule _{type_Electronics=1} => {interest=positive}_ in the rule list. Since this is the highest rule matching the description of _object4_, it is used for classification.

The confidence 1 associated with both recommendations corresponds to the confidence scores associated with the used rules.

