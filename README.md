# InBeat

Interest Beat is a service for recommendation of content. InBeat was designed with emphasis on versatility, scalability and extensibility. The core contains the General Analytics INterceptor module, which collects and aggregates user interactions, the Preference Learning module and the Recommender System module.

## Demo

- [InBeat](http://www.inbeat.eu)

## Installation - manual installation

### Prerequisites

- [MongoDB](https://www.mongodb.org/)
- [Node.js](https://nodejs.org/) + npm
- [R](http://cran.r-project.org/)
- R packages - arules, pmml, XML
  * install.packages(c("arules","pmml","XML"),dependencies=TRUE, repos="http://mirrors.nic.cz/R/")
- Optional
  * proxy - [NGINX](http://nginx.org/), ...
  * monitoring service - [PM2](https://github.com/Unitech/pm2), ...

### Installation

You can use InBeat services as a seto of independent modules. Each module provides REST API as a self-reliant http service running on a specific port. All setting can be changed either in global config file (./inbeat/config.js) or in specific config file for each module (./inbeat/{module}/config.js).

Go to the 'inbeat' directory and run installation of nodejs dependencies:

```bash
# change dir
cd ./inbeat
# install nodejs dependencies
./install.sh
# start services
./start.sh
```

Each service runs on a predefined port and you can use REST API as the main communication channel.

## Installation - Chef cookbook (Recommended)

We provide a set of installation scripts to build a complete image with InBeat services. The following tutorial provides local installation for testing and development purposes. For production installation the same scripts for [Chef](https://www.chef.io/) in cookbooks folder.

### Prerequisites

- [VirtualBox](https://www.virtualbox.org/)
- [Vagrant](https://www.vagrantup.com/)
  * Plugins
    * vagrant plugin install vagrant-vbguest
    * vagrant plugin install vagrant-omnibus

### Vagrant

```bash
# start virtual server and install all dependencies
vagrant up
# login to vagrant virtual server
vagrant ssh
```

Open in your browser:

* http://localhost:8080/ - web interface + documentation
* http://localhost:8080/admin - simple administration console and examples

## Examples
All examples can be tested using the minimalistic admin web interafce that is build on top of RESTful APIs.

### Accounts

InBeat supports a usage of accounts. Each account is represented by its identifier (string), status ("verified" for active account), sessionization (number of minutes that specifies length of gap between two sessions) and credentials for authentication (HTTP Basic format username:password).

Create verified account with identifier _INBEAT-TEST_, username and password _INBEAT-TEST:INBEAT-TEST_.

```bash
# Create account in InBeat
curl --user "admin:admin" -X PUT --header "Content-Type: application/json" http://localhost:8080/gain/api/admin/account --data-binary '[
  {
    "id": "INBEAT-TEST",
    "status": "verified",
    "sessionization": 30,
    "credentials": "INBEAT-TEST:INBEAT-TEST"
  }
]'
```

### Aggregation Rules

Aggregation rules provide causes increase or decrease of final interest for object that the user interacted with.

E.g. if user provides interaction that represents "like", interest is increased. For all other interactions interest is increased.

```bash
# Create aggregation rules
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" http://localhost:8080/gain/api/INBEAT-TEST/aggregation/rules --data-binary '{
  "body": "if(interaction.attributes.action===\"like\") {aggregation.interest = 1;} else {aggregation.interest = -1;} "
}'
```
### Aggregation Taxonomy

Aggregation taxonomy can be used to infer more general categories based on specification of types that describe the objects.

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

```bash
# Create aggregation taxonomy
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" http://localhost:8080/gain/api/INBEAT-TEST/aggregation/taxonomy --data-binary '{
  "body": "{\"name\": \"Root\",\"uri\": \"http://example.com/taxonomy/root\",\"children\": [{      \"name\": \"Food\",\"uri\": \"http://example.com/taxonomy/food\"},{\"name\": \"Electronics\",      \"uri\": \"http://example.com/taxonomy/electronics\",\"children\": [{\"name\": \"Televisions\", \"uri\": \"http://example.com/taxonomy/televisions\"},{\"name\": \"Radios\", \"uri\": \"http://example.com/taxonomy/radios\"}]}]}"
}'
```

### Events

Events that are used as interest clues.

E.g. user (identified by _http://example.com/users/user1_) likes first object (identified by _http://example.com/objects/object1_) and dislikes second object (identified by _http://example.com/objects/object2_). First object is about _televisions_ (_Television_) and the second is about _food_ (_Onion_).

```bash
# Send events
curl -X POST --header "Content-Type: application/json" http://localhost:8080/gain/listener --data-binary '{
  "accountId": "INBEAT-TEST",
  "type": "event",
  "attributes":{
    "action":"like"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object1",
  "object":{
    "objectId":"http://example.com/objects/object1",
    "entities":[{
      "lod":"http://dbpedia.org/resource/Television",
      "type":"http://example.com/taxonomy/televisions"
    }]
  }
}'

curl -X POST --header "Content-Type: application/json" http://localhost:8080/gain/listener --data-binary '{
  "accountId": "INBEAT-TEST",
  "type": "event",
  "attributes":{
    "action":"dislike"
  },
  "userId": "http://example.com/users/user1",
  "objectId": "http://example.com/objects/object2",
  "object":{
    "objectId":"http://example.com/objects/object2",
    "entities":[{
      "lod":"http://dbpedia.org/resource/Onion",
      "type":"http://example.com/taxonomy/food"
    }]
  }
}'
```

### Export of interests

InBeat GAIN module provides export of aggregated data, that contain information about final interest per object and semantic description of object (including propagation in taxonomy)

```bash
# Get export
curl --user "INBEAT-TEST:INBEAT-TEST" "http://localhost:8080/gain/api/INBEAT-TEST/export/interests?uid=http://example.com/users/user1" > export.json
```

Example of output:
```json
[{
  "accountId": "INBEAT-TEST",
  "objectId": "http://example.com/objects/object1",
  "parentObjectId": "",
  "sessionId": "1427725950907",
  "userId": "http://example.com/users/user1",
  "interest": 1,
  "d_o_Root": 1,
  "d_o_Electronics": 1,
  "d_o_Televisions": 1,
  "d_r_Television": 1,
  "last": "1427725950959"
}, {
  "accountId": "INBEAT-TEST",
  "objectId": "http://example.com/objects/object2",
  "parentObjectId": "",
  "sessionId": "1427725950907",
  "userId": "http://example.com/users/user1",
  "interest": -1,
  "d_o_Root": 1,
  "d_o_Food": 1,
  "d_r_Onion": 1,
  "last": "1427725951539"
}]
```

### Preference Learning

The export can uploaded to Preference Learning module in order to perform rule mining

```bash
# Upload to PL
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" -d@export.json "http://localhost:8080/pl/api/INBEAT-TEST/data?uid=http://example.com/users/user1"
```

Rule mining can be initiated with specic parameters: type (jsapriori|arules|lm) , support and confidence.

```bash
# Get rules
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" "http://localhost:8080/pl/api/INBEAT-TEST/rules?uid=http://example.com/users/user1" --data-binary '{
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
    "d_o_Food": "1"
  },
  "consequent": {
    "interest": "negative"
  },
  "support": 0.5,
  "confidence": 1,
  "text": "{d_o_Food=1} => {interest=negative}"
},
..., {
  "antecedent": {
    "d_o_Electronics": "1"
  },
  "consequent": {
    "interest": "positive"
  },
  "support": 0.5,
  "confidence": 1,
  "text": "{d_o_Electronics=1} => {interest=positive}"
},
{}
]
```

### Classification/Recommender System

A set of rules can be uploade to Recommender System module

```bash
# Upload rules RS
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" -d@rules.json "http://localhost:8080/rs/api/INBEAT-TEST/rules?uid=http://example.com/users/user1"
```

Create descriptions of new objects

```bash
# Create new objects 
curl --user "INBEAT-TEST:INBEAT-TEST" -X POST --header "Content-Type: application/json" "http://localhost:8080/gain/api/INBEAT-TEST/object/attributes" --data-binary '
[
    {
        "accountId": "INBEAT-TEST",
        "objectId": "http://example.com/objects/object3",
        "entities": [
            {
                "type": "http://example.com/taxonomy/food",
                "lod": "http://dbpedia.org/resource/Garlic"
            }
        ]
    },
    {
        "accountId": "INBEAT-TEST",
        "objectId": "http://example.com/objects/object4",
        "entities": [
            {
                "type": "http://example.com/taxonomy/radios",
                "lod": "http://dbpedia.org/resource/Radio"
            }
        ]
    }
]'


Objects are classified using rule engine. Output is a rank that represents user interest for specific object.

```bash
# Classify
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8080/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object3"

curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8080/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object4"

curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8080/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1"
```

Example of output for the third object (about _Food_, _Garlic_). Since user does not like objects about _Food_(_Onion_), the third objects is ranked as _negative_:
```json
[{"objectId":"http://example.com/objects/object3","rank":"negative"}]
```

Example of output for the fourth object (about _Radios_, _Radio_). Since user liked objects about _Televisions_(_Television_) and both _Televisions_ and _Radios_ are subgroups of _Electronics_, the fourth objects is ranked as _positive_:
```json
[{"objectId":"http://example.com/objects/object4","rank":"positive"}]
```

## References & Awards

* Kuchař J., Kliegr T. **Bag-of-Entities text representation for client-side (video) recommender systems**. In First Workshop on Recommender Systems for Television and online Video (RecSysTV), ACM RecSys 2014 Foster City, Silicon Valley, USA, 6th-10th October 2014
  * http://recsystv.org/
* Kuchař J., Kliegr T. **Doporučování multimediálního obsahu s využitím senzoru Microsoft Kinect.** Znalosti 2014. 13th Annual Conference, Jasná pod Chopkom, Nízké Tatry, Slovakia, ISBN 978-80-245-2054-4, 2014
  * http://znalosti.eu/
* Kuchař J., Kliegr T. **InBeat: News Recommender System as a Service @ CLEF-NEWSREEL’14 CLEF-NEWSREEL**, CLEF 2014 Conference on Multilingual and Multimodal Information Access Evaluation, Sheffield, UK, 2014
  * http://www.clef-newsreel.org/
* Kliegr T., Kuchař J. **Orwellian Eye: Video Recommendation with Microsoft Kinect** Conference on Prestigious Applications of Intelligent Systems – PAIS 2014, ECAI 2014, Prague, Czech Republic
  * http://www.ecai2014.org/pais/accepted-papers-and-system-demos/
* Leroy, J., Rocca, F., Mancas, M., Madhkour, R., Grisard, F., Kliegr, T., Kuchar, J., Vit, J., Pirner, I., and Zimmermann P. **KINterestTV - Towards Non–invasive Measure of User Interest While Watching TV.** Innovative and Creative Developments in Multimodal Interaction Systems . Eds. Y. Rybarczyk, T. Cardoso, J. Rosas, and L. Camarinha-Matos. Springer, 2014.
  * http://link.springer.com/chapter/10.1007/978-3-642-55143-7_8
* Kuchař J., Kliegr T. **GAIN: web service for user tracking and preference learning – a SMART TV use case**. In Proceedings of the 7th ACM Recommender Systems Conference (RecSys 2013), Hong Kong, China. ACM.
  * http://dl.acm.org/citation.cfm?id=2508217
* Kuchař J., Kliegr T.: **GAIN: Analysis of Implicit Feedback on Semantically Annotated Content** , 7th Workshop on Intelligent and Knowledge Oriented Technologies, Smolenice, Slovakia, 2012
  * http://wikt2012.fiit.stuba.sk/data/wikt2012-proceedings.pdf

* 3rd place in CLEF-NEWSREEL, Sheffield, UK
  * http://www.clef-newsreel.org/previous-campaigns/newsreel-2014/
* Runner-up prize in International News Recommender Systems Workshop and Challenge, Hong Kong, China
  * https://sites.google.com/site/newsrec2013/challenge

## Authors

- Jaroslav Kuchař (https://github.com/jaroslav-kuchar)

## Licence
BSD License