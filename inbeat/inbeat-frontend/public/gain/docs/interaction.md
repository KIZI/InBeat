$title: GAIN Interaction format

# GAIN Interaction format

## Minimalistic
<pre>
{
"accountId": "INBEAT-TEST",
"type": "event",
"userId": "http://example.com/users/user1",
"objectId": "http://example.com/objects/object1"
}
</pre>


## Event
### Specification of interaction details
<pre>
{
"accountId": "INBEAT-TEST",
"type": "event",
"userId": "http://example.com/users/user1",
"objectId": "http://example.com/objects/object1",
"attributes": {
	"category": "Video",
	"action": "Pause",
	"location": "32",
	"client": {
	    "type": "lou/remote",
	    "version": "0.0.1"
	}
}
}
</pre>

## Context
### Context example
<pre>
{
"accountId": "INBEAT-TEST",
"type": "context",
"userId": "http://example.com/users/user1",
"objectId": "http://example.com/objects/object1",
"attributes": {
	"action": "kids",
	"value": "2",
	"location": "32",
	"confidence": "1"
}
}
</pre>

## Interaction with object description
<pre>
{
    "accountId": "INBEAT-TEST",
    "objectId": "-------",
    "userId": "uid",
    "type": "event",
    "attributes": {
        "client": {
            "type": "GAIN",
            "version": 1
        }
    },
    "object": {
        "objectId": "-------",
        "attributes": {
          "start": 12345
        },
        "entities": [
          {
            "source": "thd",
            "entityURI": "http://dbpedia.org/resource/Museum_Island",
            "typeURI": "http://dbpedia.org/ontology/Place",
            "label": "Museum Island",
            "typeLabel": "Place",
            "entityType": "named entity",
            "confidence": 0,
            "relevance": 0
          }
        ]
    }
}
curl -header "Content-Type: application/json" --request POST --data @interaction.json "http://127.0.0.1:8080/gain/listener"
</pre>