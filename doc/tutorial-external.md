# InBeat - external recommender system

InBeat export of aggregated interests per user and object can be used in external recommender systems. 

## Export formats

InBeat support three formats for exports: JSON, CSV and MySQL DDL script.

accountId | objectId | parentObjectId | sessionId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Television | entity_Onion | entity_Salt | interest
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- 
INBEAT-TUTORIAL | http://example.com/objects/object1 | | 1427725950907 | **1** | 0 | **1** | 1 | 0 | 1 | 0 | 0 | **1**
INBEAT-TUTORIAL | http://example.com/objects/object2 | | 1427725950907 | **1** | 1 | 0 | 0 | 0 | 0 | 1 | 1 | **-1**


### Example of JSON

```json
[
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object2",
        "parentObjectId": "",
        "sessionId": "1433667182856",
        "userId": "http://example.com/users/user1",
        "interest": -1,
        "type_Root": 1,
        "type_Food": 1,
        "entity_Onion": 1,
        "entity_Salt": 1,
        "last": "1433667199100"
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object1",
        "parentObjectId": "",
        "sessionId": "1433667182856",
        "userId": "http://example.com/users/user1",
        "interest": 1,
        "type_Root": 1,
        "type_Electronics": 1,
        "type_Televisions": 1,
        "entity_Television": 1,
        "last": "1433667191974"
    }
]
```

### Example of CSV

```csv
accountId;objectId;parentObjectId;sessionId;userId;interest;type_Root;type_Food;entity_Onion;entity_Salt;last;type_Electronics;type_Televisions;entity_Television
INBEAT-TUTORIAL;http://example.com/objects/object2;0;1433667182856;http://example.com/users/user1;-1;1;1;1;1;1433667199100;0;0;0
INBEAT-TUTORIAL;http://example.com/objects/object1;0;1433667182856;http://example.com/users/user1;1;1;0;0;0;1433667191974;1;1;1
```

### Example of MySQL DDL script

```sql
DROP TABLE IF EXISTS `INBEAT-TUTORIAL-http://example.com/users/user1`; 
CREATE TABLE `INBEAT-TUTORIAL-http://example.com/users/user1` (Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`accountId` TEXT , `userId` TEXT, `sessionId` TEXT, `objectId` TEXT, `parentObjectId` TEXT, `interest` FLOAT default 0, `type_Root` FLOAT default 0, `type_Food` FLOAT default 0, `entity_Onion` FLOAT default 0, `entity_Salt` FLOAT default 0, `last` FLOAT default 0, `type_Electronics` FLOAT default 0, `type_Televisions` FLOAT default 0, `entity_Television` FLOAT default 0);
INSERT INTO `INBEAT-TUTORIAL-http://example.com/users/user1`(Id, `accountId`, `objectId`, `parentObjectId`, `sessionId`, `userId`, `interest`, `type_Root`, `type_Food`, `entity_Onion`, `entity_Salt`, `last` ) VALUES (0,"INBEAT-TUTORIAL", "http://example.com/objects/object2", "", "1433667182856", "http://example.com/users/user1", "-1", "1", "1", "1", "1", "1433667199100");
INSERT INTO `INBEAT-TUTORIAL-http://example.com/users/user1`(Id, `accountId`, `objectId`, `parentObjectId`, `sessionId`, `userId`, `interest`, `type_Root`, `type_Electronics`, `type_Televisions`, `entity_Television`, `last` ) VALUES (0,"INBEAT-TUTORIAL", "http://example.com/objects/object1", "", "1433667182856", "http://example.com/users/user1", "1", "1", "1", "1", "1", "1433667191974");
```
