# InBeat

[![Build Status](https://travis-ci.org/KIZI/InBeat.svg?branch=master)](https://travis-ci.org/KIZI/InBeat)

Interest Beat is a service for recommendation of content. InBeat was designed with emphasis on versatility, scalability and extensibility. The core contains the General Analytics INterceptor module, which collects and aggregates user interactions, the Preference Learning module and the Recommender System module.

## Latest updates

- 2017-01-24: Included TravisCI to continuously check the builds.
- 2016-11-15: Integration of a [rule pruning](https://cran.r-project.org/package=rCBA) as a part of the [Preference Learning](#preference-learning) module based on the [Apriori](https://cran.r-project.org/package=arules). 
  * Allows to significantly reduce the amount of rules in user models. This reduces memory requirements and speeds up recommendations.

## Demo

- [InBeat](http://www.inbeat.eu)

## Documentation and tutorials

- [Documentation](./doc/main.md)

## Local and development installation

We provide a set of installation scripts to build a complete image with InBeat services. The following tutorial provides local installation for testing and development purposes. 

Other installation possibilities are described in the [documentation](./doc/main.md).


### Docker

Recommended for testing purposes and other installations.

- [Docker](https://www.docker.com/)
  * tested with Docker 1.12+

```bash
# pull from docker hub
docker pull kizi/inbeat
# or build a docker image from scratch
# docker build -t inbeat .
# run 
docker run -d -p 8880:80 --name inbeat kizi/inbeat
```

### Vagrant

For development purposes:

- [VirtualBox](https://www.virtualbox.org/)
  * tested with virtual box 4.3.2.8
- [Vagrant](https://www.vagrantup.com/)
  * tested with vagrant 1.7.2
  * Plugins
    * vagrant plugin install vagrant-vbguest
    * vagrant plugin install vagrant-omnibus

#### Build a new image (recommended) 

```bash
# install virtualbox and vagrant 
# if this does not proceed correctly, install latest version from virtualbox.org and vagrantup.com
sudo apt-get install virtualbox vagrant
# create local copy of inbeat git repository
git clone https://github.com/KIZI/InBeat.git
cd InBeat
# install plugins
vagrant plugin install vagrant-vbguest
vagrant plugin install vagrant-omnibus
# start virtual server and install all dependencies
vagrant up
# login to vagrant virtual server - optional
# vagrant ssh
```

Open in your browser:

* [http://localhost:8880/](http://localhost:8880/) - web interface + documentation
* [http://localhost:8880/admin](http://localhost:8880/admin) - simple administration console and examples

## Examples
All examples can be tested using the minimalistic admin web interafce that is built on top of RESTful APIs.

### Accounts

InBeat supports the usage of accounts. Each account is represented by its identifier (string), status ("verified" for active account), sessionization (number of minutes that specifies length of gap between two interactions to start a new session) and credentials for authentication (HTTP Basic format username:password).

Create verified account with identifier _INBEAT-TEST_, username and password _INBEAT-TEST:INBEAT-TEST_. Admin credentials are configured in (./inbeat/config.js).

```bash
# Create account in InBeat
curl --user "admin:admin" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/admin/account --data-binary '[
  {
    "id": "INBEAT-TEST",
    "status": "verified",
    "sessionization": 30,
    "credentials": "INBEAT-TEST:INBEAT-TEST"
  }
]'
```

### Aggregation Rules

Aggregation rules cause increase or decrease of final interest for object that the user interacted with. Aggregation Rules are  a specific setting valid per account. They have to be created for each account.

E.g. if user provides interaction that represents "like", interest is increased. For all other interactions interest is decreased.

```bash
# Create aggregation rules
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/INBEAT-TEST/aggregation/rules --data-binary '{
  "body": "if(interaction.attributes.action===\"like\") {aggregation.interest = 1;} else {aggregation.interest = -1;} "
}'
```
### Aggregation Taxonomy

Aggregation taxonomy can be used to infer more general categories based on a specification of types that describe the objects. Taxonomy is a specific setting valid per account. It has to be created for each account.

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
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/INBEAT-TEST/aggregation/taxonomy --data-binary '{
  "body": "{\"name\": \"Root\",\"uri\": \"http://example.com/taxonomy/root\",\"children\": [{      \"name\": \"Food\",\"uri\": \"http://example.com/taxonomy/food\"},{\"name\": \"Electronics\",      \"uri\": \"http://example.com/taxonomy/electronics\",\"children\": [{\"name\": \"Televisions\", \"uri\": \"http://example.com/taxonomy/televisions\"},{\"name\": \"Radios\", \"uri\": \"http://example.com/taxonomy/radios\"}]}]}"
}'
```

### Events

Events  are used as a representation of interactions with objects. Each event is used as an interest clue according to a predefined set of aggregation rules.

E.g. user (identified by _http://example.com/users/user1_) likes first object (identified by _http://example.com/objects/object1_) and dislikes second object (identified by _http://example.com/objects/object2_). First object is about _televisions_ (_Television_) and the second is about _food_ (_Onion_).

```bash
# Send events
curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
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
      "entityURI":"http://dbpedia.org/resource/Television",
      "typeURI":"http://example.com/taxonomy/televisions"
    }]
  }
}'

curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
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
      "entityURI":"http://dbpedia.org/resource/Onion",
      "typeURI":"http://example.com/taxonomy/food"
    }]
  }
}'
```

### Export of aggregated data

InBeat GAIN module provides an export of aggregated data. It contains information about the final interest per object and the semantic description of object (including propagation in taxonomy).

```bash
# Get export
curl --user "INBEAT-TEST:INBEAT-TEST" "http://localhost:8880/gain/api/INBEAT-TEST/export/interests?uid=http://example.com/users/user1" > export.json
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
  "type_Root": 1,
  "type_Electronics": 1,
  "type_Televisions": 1,
  "entity_Television": 1,
  "last": "1427725950959"
}, {
  "accountId": "INBEAT-TEST",
  "objectId": "http://example.com/objects/object2",
  "parentObjectId": "",
  "sessionId": "1427725950907",
  "userId": "http://example.com/users/user1",
  "interest": -1,
  "type_Root": 1,
  "type_Food": 1,
  "entity_Onion": 1,
  "last": "1427725951539"
}]
```

### Preference Learning

The export can be uploaded to the Preference Learning module in order to use this data as an input for rule mining. The set of rules represents user preferences.

```bash
# Upload to PL
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" -d@export.json "http://localhost:8880/pl/api/INBEAT-TEST/data?uid=http://example.com/users/user1"
```

Rule mining can be initiated with a set of parameters: type (jsapriori|arules|lm) , support and confidence.

```bash
# Get rules
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" "http://localhost:8880/pl/api/INBEAT-TEST/rules?uid=http://example.com/users/user1" --data-binary '{
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

### Classification/Recommender System

A set of generated rules can be uploaded to the Recommender System module.

```bash
# Upload rules RS
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" -d@rules.json "http://localhost:8880/rs/api/INBEAT-TEST/rules?uid=http://example.com/users/user1"
```

The same set of objects used for learning of interest can be used for classification, which may be useful  for validation purposes. New additional objects can be created, including descriptions:

```bash
# Create new objects
curl --user "INBEAT-TEST:INBEAT-TEST" -X POST --header "Content-Type: application/json" "http://localhost:8880/gain/api/INBEAT-TEST/object/attributes" --data-binary '
[
    {
        "accountId": "INBEAT-TEST",
        "objectId": "http://example.com/objects/object3",
        "entities": [
            {
                "typeURI": "http://example.com/taxonomy/food",
                "entityURI": "http://dbpedia.org/resource/Garlic"
            }
        ]
    },
    {
        "accountId": "INBEAT-TEST",
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

Objects are classified using a rule engine. Output is a rank that represents user interest for a specific object.

```bash
# Classify
curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object3"

curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object4"

curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1"
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

Publications:

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

Awards:

* 3rd place in CLEF-NEWSREEL, Sheffield, UK
  * http://www.clef-newsreel.org/previous-campaigns/newsreel-2014/
* Runner-up prize in International News Recommender Systems Workshop and Challenge, Hong Kong, China
  * https://sites.google.com/site/newsrec2013/challenge

## Contributors

- Jaroslav Kuchař (https://github.com/jaroslav-kuchar)
- Tomáš Kliegr (https://github.com/kliegr)

## Licence
BSD License
