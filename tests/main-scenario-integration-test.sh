#!/bin/bash
# Create account in InBeat
response=$(curl --write-out %{http_code} --silent --output /dev/null --user "admin:admin" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/admin/account --data-binary '[
  {
    "id": "INBEAT-TEST",
    "status": "verified",
    "sessionization": 30,
    "credentials": "INBEAT-TEST:INBEAT-TEST"
  }
]')
echo "Create account in InBeat $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi

# Create aggregation rules
response=$(curl --write-out %{http_code} --silent --output /dev/null --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/INBEAT-TEST/aggregation/rules --data-binary '{
  "body": "if(interaction.attributes.action===\"like\") {aggregation.interest = 1;} else {aggregation.interest = -1;} "
}')
echo "Create aggregation rules $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi

# Create aggregation taxonomy
response=$(curl --write-out %{http_code} --silent --output /dev/null --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" http://localhost:8880/gain/api/INBEAT-TEST/aggregation/taxonomy --data-binary '{
  "body": "{\"name\": \"Root\",\"uri\": \"http://example.com/taxonomy/root\",\"children\": [{      \"name\": \"Food\",\"uri\": \"http://example.com/taxonomy/food\"},{\"name\": \"Electronics\",      \"uri\": \"http://example.com/taxonomy/electronics\",\"children\": [{\"name\": \"Televisions\", \"uri\": \"http://example.com/taxonomy/televisions\"},{\"name\": \"Radios\", \"uri\": \"http://example.com/taxonomy/radios\"}]}]}"
}')
echo "Create aggregation taxonomy $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi

# Send events
response=$(curl --write-out %{http_code} --silent --output /dev/null -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
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
}')
echo "Send events $response"
if [ "$response" -ne "201" ]; then
  echo "Failed"
  exit 1
fi

response=$(curl --write-out %{http_code} --silent --output /dev/null -X POST --header "Content-Type: application/json" http://localhost:8880/gain/listener --data-binary '{
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
}')
echo "Send events $response"
if [ "$response" -ne "201" ]; then
  echo "Failed"
  exit 1
fi

# Get export
response=$(curl --write-out %{http_code} --silent --output /dev/null  --user "INBEAT-TEST:INBEAT-TEST" "http://localhost:8880/gain/api/INBEAT-TEST/export/interests?uid=http://example.com/users/user1")
echo "Get export $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi
curl --silent --user "INBEAT-TEST:INBEAT-TEST" "http://localhost:8880/gain/api/INBEAT-TEST/export/interests?uid=http://example.com/users/user1" > export.json

# Upload to PL
response=$(curl --write-out %{http_code} --silent --output /dev/null --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" -d@export.json "http://localhost:8880/pl/api/INBEAT-TEST/data?uid=http://example.com/users/user1")
echo "Upload to PL $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi

# Get rules
response=$(curl --write-out %{http_code} --silent --output /dev/null  --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" "http://localhost:8880/pl/api/INBEAT-TEST/rules?uid=http://example.com/users/user1" --data-binary '{
  "type": "jsapriori",
  "support": 0.01,
  "confidence": 0.01
}')
echo "Get rules $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi
curl --silent --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" "http://localhost:8880/pl/api/INBEAT-TEST/rules?uid=http://example.com/users/user1" --data-binary '{
  "type": "jsapriori",
  "support": 0.01,
  "confidence": 0.01
}' > rules.json
if ! grep -q "\"consequent\":{\"interest\":\"positive\"}" "rules.json"; then
  echo "Failed rules.json"
  exit 1
fi

# Get rules arules
response=$(curl --write-out %{http_code} --silent --output /dev/null  --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" "http://localhost:8880/pl/api/INBEAT-TEST/rules?uid=http://example.com/users/user1" --data-binary '{
  "type": "arules",
  "support": 0.01,
  "confidence": 0.01
}')
echo "Get rules $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi
curl --silent --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" "http://localhost:8880/pl/api/INBEAT-TEST/rules?uid=http://example.com/users/user1" --data-binary '{
  "type": "arules",
  "support": 0.01,
  "confidence": 0.01
}' > rules.csv
if ! grep -q "{} =>" "rules.csv"; then
  echo "Failed rules.csv"
  exit 1
fi

# Upload rules RS
response=$(curl --write-out %{http_code} --silent --output /dev/null --user "INBEAT-TEST:INBEAT-TEST" -X PUT --header "Content-Type: application/json" -d@rules.json "http://localhost:8880/rs/api/INBEAT-TEST/rules?uid=http://example.com/users/user1")
echo "Upload rules RS $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi

# Create new objects
response=$(curl --write-out %{http_code} --silent --output /dev/null --user "INBEAT-TEST:INBEAT-TEST" -X POST --header "Content-Type: application/json" "http://localhost:8880/gain/api/INBEAT-TEST/object/attributes" --data-binary '
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
]')
echo "Create new objects $response"
if [ "$response" -ne "201" ]; then
  echo "Failed"
  exit 1
fi

# Classify
response=$(curl --write-out %{http_code} --silent --output /dev/null --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object3")
echo "Classify $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi
curl --silent --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object3" > "object3.json"
if ! grep -q "negative" "object3.json"; then
  echo "Failed object3.json"
  exit 1
fi

response=$(curl --write-out %{http_code} --silent --output /dev/null --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object4")
echo "Classify $response"
if [ "$response" -ne "200" ]; then
  echo "Failed"
  exit 1
fi
curl --silent --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1&id=http://example.com/objects/object4" > "object4.json"
if ! grep -q "positive" "object4.json"; then
  echo "Failed object4.json"
  exit 1
fi

# curl --user "INBEAT-TEST:INBEAT-TEST" -X PUT "http://localhost:8880/rs/api/INBEAT-TEST/classification?uid=http://example.com/users/user1"
