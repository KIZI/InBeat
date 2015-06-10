# InBeat - News Recommender System

Minimalistic recommender system demonstrated on the news domain. 

## Interactions of users

userId | objectId | location | daytime
--- | --- | --- | --- 
http://example.com/users/user1 | http://example.com/objects/object1 | USA | morning 
http://example.com/users/user2 | http://example.com/objects/object1 | GER | morning
http://example.com/users/user3 | http://example.com/objects/object2 | GER | evening

JSON representation of interaction

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


## Export of aggregated interests


```bash
# Get export
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" "http://localhost:8880/gain/api/INBEAT-TUTORIAL/export/interests > export.json
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


## Preference learning

Use the web admin console [http://localhost:8880/admin/#/pl-data](http://localhost:8880/admin/#/pl-data) and 
[http://localhost:8880/admin/#/pl-rule](http://localhost:8880/admin/#/pl-rule)
or 

```bash
# Upload to PL
curl --user "INBEAT-TUTORIAL:INBEAT-TUTORIAL" -X PUT --header "Content-Type: application/json" -d@export.json "http://localhost:8880/pl/api/INBEAT-TUTORIAL/data?uid=newsrec"
```

Rule mining can be initiated with a set of parameters: type (jsapriori|arules|lm) , support and confidence. ClassName is target class for classification. For this use case: obejctId.

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


Example of output:
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

All mined rules, sorted according to CBA (decreasingly by confidence, support, rule length):

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

### Recommendation 1

Let consider user with following attributes: location: USA

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

Only _http://example.com/objects/object1_ is recommended, because only rule _{location=USA} => {objectId=http://example.com/objects/object1}_ match the query.

### Recommendation 1

Let consider user with following attributes: daytime: evening, location: USA

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
Both _http://example.com/objects/object1_ and _http://example.com/objects/object2_ are recommended, because first two rules match the query (_{daytime=evening} => {objectId=http://example.com/objects/object2}_ and _{location=USA} => {objectId=http://example.com/objects/object1}_)





