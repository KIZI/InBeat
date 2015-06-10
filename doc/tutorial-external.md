# InBeat - external recommender system

InBeat export of aggregated interests per user and object can be used in external recommender systems. 

## Export formats

InBeat support three formats for exports: JSON, CSV and MySQL DDL script.

accountId | objectId | userId | sessionId | type_Root | type_Food | type_Electronics | type_Televisions | type_Radios| entity_Television | entity_Onion | entity_Salt | interest
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- 
INBEAT-TUTORIAL | http://example.com/objects/object1 | http://example.com/users/user3 | 1433937669616 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1
INBEAT-TUTORIAL | http://example.com/objects/object2 | http://example.com/users/user2 | 1433937683920 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | -1
INBEAT-TUTORIAL | http://example.com/objects/object1 | http://example.com/users/user2 | 1433937666223 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 0.5
INBEAT-TUTORIAL | http://example.com/objects/object1 | http://example.com/users/user1 | 1433937683920 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1


### Example of JSON

```json
[
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object1",
        "parentObjectId": "",
        "sessionId": "1433937669616",
        "userId": "http://example.com/users/user3",
        "interest": 1,
        "type_Root": 1,
        "type_Electronics": 1,
        "type_Televisions": 1,
        "entity_Television": 1,
        "last": "1433937683920"
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object2",
        "parentObjectId": "",
        "sessionId": "1433937683920",
        "userId": "http://example.com/users/user2",
        "interest": -1,
        "type_Root": 1,
        "type_Food": 1,
        "entity_Onion": 1,
        "entity_Salt": 1,
        "last": "1433937694713"
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object1",
        "parentObjectId": "",
        "sessionId": "1433937666223",
        "userId": "http://example.com/users/user2",
        "interest": 0.5,
        "type_Root": 1,
        "type_Electronics": 1,
        "type_Televisions": 1,
        "entity_Television": 1,
        "last": "1433937666242"
    },
    {
        "accountId": "INBEAT-TUTORIAL",
        "objectId": "http://example.com/objects/object1",
        "parentObjectId": "",
        "sessionId": "1433937683920",
        "userId": "http://example.com/users/user1",
        "interest": 1,
        "type_Root": 1,
        "type_Electronics": 1,
        "type_Televisions": 1,
        "entity_Television": 1,
        "last": "1433937680581"
    }
]
```

### Example of CSV

```csv
accountId;objectId;parentObjectId;sessionId;userId;interest;type_Root;type_Electronics;type_Televisions;entity_Television;last;type_Food;entity_Onion;entity_Salt
INBEAT-TUTORIAL;http://example.com/objects/object1;0;1433937669616;http://example.com/users/user3;1;1;1;1;1;1433937683920;0;0;0
INBEAT-TUTORIAL;http://example.com/objects/object2;0;1433937666223;http://example.com/users/user2;-1;1;0;0;0;1433937694713;1;1;1
INBEAT-TUTORIAL;http://example.com/objects/object1;0;1433937666223;http://example.com/users/user2;0.5;1;1;1;1;1433937666242;0;0;0
INBEAT-TUTORIAL;http://example.com/objects/object1;0;1433937660867;http://example.com/users/user1;1;1;1;1;1;1433937680581;0;0;0
```

### Example of MySQL DDL export result

```sql
DROP TABLE IF EXISTS `INBEAT-TUTORIAL-undefined`; 
CREATE TABLE `INBEAT-TUTORIAL-undefined` (Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,`accountId` TEXT , `userId` TEXT, `sessionId` TEXT, `objectId` TEXT, `parentObjectId` TEXT, `interest` FLOAT default 0, `type_Root` FLOAT default 0, `type_Electronics` FLOAT default 0, `type_Televisions` FLOAT default 0, `entity_Television` FLOAT default 0, `last` FLOAT default 0, `type_Food` FLOAT default 0, `entity_Onion` FLOAT default 0, `entity_Salt` FLOAT default 0);
INSERT INTO `INBEAT-TUTORIAL-undefined`(Id, `accountId`, `objectId`, `parentObjectId`, `sessionId`, `userId`, `interest`, `type_Root`, `type_Electronics`, `type_Televisions`, `entity_Television`, `last` ) VALUES (0,"INBEAT-TUTORIAL", "http://example.com/objects/object1", "", "1433937669616", "http://example.com/users/user3", "1", "1", "1", "1", "1", "1433937683920");
INSERT INTO `INBEAT-TUTORIAL-undefined`(Id, `accountId`, `objectId`, `parentObjectId`, `sessionId`, `userId`, `interest`, `type_Root`, `type_Food`, `entity_Onion`, `entity_Salt`, `last` ) VALUES (0,"INBEAT-TUTORIAL", "http://example.com/objects/object2", "", "1433937666223", "http://example.com/users/user2", "-1", "1", "1", "1", "1", "1433937694713");
INSERT INTO `INBEAT-TUTORIAL-undefined`(Id, `accountId`, `objectId`, `parentObjectId`, `sessionId`, `userId`, `interest`, `type_Root`, `type_Electronics`, `type_Televisions`, `entity_Television`, `last` ) VALUES (0,"INBEAT-TUTORIAL", "http://example.com/objects/object1", "", "1433937666223", "http://example.com/users/user2", "0.5", "1", "1", "1", "1", "1433937666242");
INSERT INTO `INBEAT-TUTORIAL-undefined`(Id, `accountId`, `objectId`, `parentObjectId`, `sessionId`, `userId`, `interest`, `type_Root`, `type_Electronics`, `type_Televisions`, `entity_Television`, `last` ) VALUES (0,"INBEAT-TUTORIAL", "http://example.com/objects/object1", "", "1433937660867", "http://example.com/users/user1", "1", "1", "1", "1", "1", "1433937680581");
```

## Example of usage in MyMediaLite

The export can be used in [MyMediaLite](http://www.mymedialite.net/).

For the [item prediction](http://www.mymedialite.net/documentation/item_prediction.html) task, the CSV output of InBeat should be tarnsformed to the supported format (e.g [postitive only feedback file](http://www.mymedialite.net/documentation/implicit_feedback_files.html)). The minimal requirement is to provide two columns: userId and objectId. 

For tranformation can be used for example the folloewing simple python script

```python
import pandas
data = pandas.read_csv("inbeat.csv", sep=";")
data.to_csv("mymedialite.csv",columns=["userId","objectId"],index=False,header=False)
```

The output of transformation is as follows:

```csv
http://example.com/users/user3,http://example.com/objects/object1
http://example.com/users/user2,http://example.com/objects/object2
http://example.com/users/user2,http://example.com/objects/object1
http://example.com/users/user1,http://example.com/objects/object1
```

Example of item recommendation using UserKNN algorithm:
```bash
./item_recommendation --training-file=mymedialite.csv --recommender=UserKNN --prediction-file=prediction.csv
```

The output is an [Item recommendation file](http://www.mymedialite.net/documentation/item_recommendation_files.html)
```
http://example.com/users/user3	[http://example.com/objects/object2:0.4142136]
http://example.com/users/user2	[]
http://example.com/users/user1	[http://example.com/objects/object2:0.4142136]
```

Summary:
* for the _...user3_ and the _...user1_, the _...object2_ is recommended, because other users interacted with this object.
* there is no recommendation for the _...user2_, since the user already interacted with all availble objects.

