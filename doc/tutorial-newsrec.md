# InBeat - News Recommender System

![](https://docs.google.com/drawings/export/png?id=12K2DH4qPVp0dTwMpk82OUhQt1KmiIqoLTiN4YNlK-gE)

###Scope
This tutorial describes a basic use case, in which InBeat is used to recommend articles on a news website using  association rules. 

The rules are used to suggest  news items based on location and day time of the user. Example output rule:

rule | support | confidence
--- | --- | ---
{location=GER,daytime=evening} => {objectId=http://example.com/objects/object2} | 0,333333333333333 | 1

###Input data
For each page view, the website sends an event to InBeat giving user id, identifier of the visited news article (i.e. object id in InBeat terminology), user location and daytime. 



###What this tutorial covers
- [Data format for user interactions accepted by InBeat ](#receiving-pageviews)
- [Export of collected data](#export-of-collected-data)
- [Building rule-based user model](#preference-learning)
- [Initializing the recommender system](#classificationrecommender-system)
- [Invoking recommendation](#recommendation)

## Receiving pageviews
Let us assume, we had three visitors, each viewing one of the two distinct two news articles.

userId | objectId | location | daytime
--- | --- | --- | --- 
http://example.com/users/user1 | http://example.com/objects/object1 | USA | morning 
http://example.com/users/user2 | http://example.com/objects/object1 | GER | morning
http://example.com/users/user3 | http://example.com/objects/object2 | GER | evening

JSON documents  that  the website needs to send to InBeat in order to represent the three pageviews above:

```json
{
    "accountId": "INBEAT-TUTORIAL",
    "type": "event",
    "userId": "http://example.com/users/user1",
    "objectId": "http://example.com/objects/object1",
    "user": {
       "attributes": {
            "location": "USA", 
            "daytime": "morning"
        }
    }
}
```

```json
{
    "accountId": "INBEAT-TUTORIAL",
    "type": "event",
    "userId": "http://example.com/users/user2",
    "objectId": "http://example.com/objects/object1",
    "user": {
       "attributes": {
            "location": "GER", 
            "daytime": "morning"
        }
    }
}
```

```json
{
    "accountId": "INBEAT-TUTORIAL",
    "type": "event",
    "userId": "http://example.com/users/user3",
    "objectId": "http://example.com/objects/object2",
    "user": {
       "attributes": {
            "location": "GER", 
            "daytime": "evening"
        }
    }
}
```

Use the web admin console [http://localhost:8880/admin/#/gain-listener](http://localhost:8880/admin/#/gain-listener) or 

```bash
# Send events
curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
    "accountId": "INBEAT-TUTORIAL",
    "type": "event",
    "userId": "http://example.com/users/user1",
    "objectId": "http://example.com/objects/object1",
    "user": {
       "attributes": {
            "location": "USA", 
            "daytime": "morning"
        }
    }
}'

curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
    "accountId": "INBEAT-TUTORIAL",
    "type": "event",
    "userId": "http://example.com/users/user2",
    "objectId": "http://example.com/objects/object1",
    "user": {
       "attributes": {
            "location": "GER", 
            "daytime": "morning"
        }
    }
}'

curl -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
    "accountId": "INBEAT-TUTORIAL",
    "type": "event",
    "userId": "http://example.com/users/user3",
    "objectId": "http://example.com/objects/object2",
    "user": {
       "attributes": {
            "location": "GER", 
            "daytime": "evening"
        }
    }
}'
```


## Export of collected data


```bash
# Get export
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" "http://localhost:8880/gain/api/INBEAT-TUTORIAL/export/interests" > export.json
```

Example of output in JSON:
```json
[
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object2",
        "parentObjectId": "",
        "sessionId": "1433931348341",
        "userId": "http://example.com/users/user3",
        "interest": null,
        "location": "GER",
        "daytime": "evening",
        "last": "1433931348380"
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object1",
        "parentObjectId": "",
        "sessionId": "1433931342437",
        "userId": "http://example.com/users/user2",
        "interest": null,
        "location": "GER",
        "daytime": "morning",
        "last": "1433931342472"
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object1",
        "parentObjectId": "",
        "sessionId": "1433931336651",
        "userId": "http://example.com/users/user1",
        "interest": null,
        "location": "USA",
        "daytime": "morning",
        "last": "1433931336700"
    }
]
```

The tabular representation is following:

accountId | objectId | parentObjectId | sessionId | interest | location | daytime
--- | --- | --- | --- | --- | --- | --- | --- 
INBEAT-TUTORIAL | http://example.com/objects/object2 | | 1433931348341 | null | GER | evening 
INBEAT-TUTORIAL | http://example.com/objects/object1 | | 1433931342437 | null | GER | morning
INBEAT-TUTORIAL | http://example.com/objects/object1 | | 1433931336651 | null | USA | morning


## Association rule learning

Use the web admin console [http://localhost:8880/admin/#/pl-data](http://localhost:8880/admin/#/pl-data) and 
[http://localhost:8880/admin/#/pl-rule](http://localhost:8880/admin/#/pl-rule)
or 

```bash
# Upload to PL
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" -d@export.json "http://localhost:8880/pl/api/INBEAT-TUTORIAL/data?uid=newsrec"
```

Rule mining can be initiated with the following set of parameters: type (jsapriori|arules|lm), support and confidence. We will use the built-in jsapriori rule learner.
Support and confidence are two standard parameters of association rule learning, for explanation refer e.g. to [Wikipedia](http://en.wikipedia.org/wiki/Association_rule_learning#Useful_Concepts).

ClassName is the target class for classification, which will be used for the right hand side of the rules. For this use case: obejctId.

```json
{
  "type": "jsapriori",
  "support": 0.01,
  "confidence": 0.01,
  "className": "objectId"
}
```

```bash
# Get rules
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" "http://localhost:8880/pl/api/INBEAT-TUTORIAL/rules?uid=newsrec" --data-binary '{
  "type": "jsapriori",
  "support": 0.01,
  "confidence": 0.01,
  "className": "objectId"
}' > rules.json
```


Example output:
```json
[
    {
        "antecedent": {
            "daytime": "morning"
        },
        "consequent": {
            "objectId": "http://example.com/objects/object1"
        },
        "support": 0.6666666666666666,
        "confidence": 1,
        "text": "{daytime=morning} => {objectId=http://example.com/objects/object1}"
    },
    {
       ...
    },
    ...
]
```

Discovered rules are sorted in the descending order according to the following criteria: confidence, support, rule length:

rule | support | confidence
--- | --- | ---
{daytime=evening} => {objectId=http://example.com/objects/object2} | 0,333333333333333 | 1
{location=USA} => {objectId=http://example.com/objects/object1} | 0,333333333333333 | 1
{daytime=morning} => {objectId=http://example.com/objects/object1} | 0,666666666666667 | 1
{location=GER,daytime=evening} => {objectId=http://example.com/objects/object2} | 0,333333333333333 | 1
{location=USA,daytime=morning} => {objectId=http://example.com/objects/object1} | 0,333333333333333 | 1
{location=GER,daytime=morning} => {objectId=http://example.com/objects/object1} | 0,333333333333333 | 1
{location=GER} => {objectId=http://example.com/objects/object2} | 0,333333333333333 | 0,5
{location=GER} => {objectId=http://example.com/objects/object1} | 0,333333333333333 | 0,5


### Classification/Recommender System

Use the web admin console [http://localhost:8880/admin/#/rs-rule](http://localhost:8880/admin/#/rs-rule) and [http://localhost:8880/admin/#/rs-classification](http://localhost:8880/admin/#/rs-classification)

or

```bash
# Upload rules RS
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" -d@rules.json "http://localhost:8880/rs/api/INBEAT-TUTORIAL/rules?uid=newsrec"
```

### Recommendation
We give two examples.
#### Recommendation 1

Let us consider  a user with the following attributes: location: USA

```json
{
    "location": "USA"    
}
```
cUrl example

```bash
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" "http://localhost:8880/rs/api/INBEAT-TUTORIAL/classification?uid=newsrec" --data-binary '{"location":"GER"}'
```

Example of output - set of obejctIds :

```json
[
    {
        "objectId": "http://example.com/objects/object1",
        "confidence": 1
    }
]
```

Only _http://example.com/objects/object1_ is recommended, because the left hand side of only one rule _{location=USA} => {objectId=http://example.com/objects/object1}_ matches the user description.

#### Recommendation 2

Let  us consider a user with the  following attributes: daytime: evening, location: USA

```json
{
    "daytime": "evening",
    "location": "USA"
}
```
cUrl example

```bash
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" "http://localhost:8880/rs/api/INBEAT-TUTORIAL/classification?uid=newsrec" --data-binary '{
    "daytime": "evening",
    "location": "USA"
}
'
```

Example of output - set of obejctIds :

```json
[[
    {
        "objectId": "http://example.com/objects/object2",
        "confidence": 1
    },
    {
        "objectId": "http://example.com/objects/object1",
        "confidence": 0.5
    }
]
```
Both _http://example.com/objects/object1_ and _http://example.com/objects/object2_ are recommended, because the user description is matched by left hand sides of   two rules: (_{daytime=evening} => {objectId=http://example.com/objects/object2}_ and _{location=USA} => {objectId=http://example.com/objects/object1}_)





