# Weekly Assignment 6

This week, I'm going to write and execute queries for the AA data in PostgreSQL database and the Dear Diary data in DynamoDB.

## Part One: Write and execute a query for your AA data PostgreSQL

For this query, I use `thisQuery = "SELECT address, city, state, lat, long FROM aalocations WHERE lat BETWEEN 40.746 AND 40.756;"` to filter and get all the addresses whose latitude is between 40.746 and 40.756

```javascript
const { Client } = require('pg');
const cTable = require('console.table');
const dotenv = require('dotenv');
dotenv.config();  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'gitacoco';
db_credentials.host = 'data-structures.cmwlovjahk2o.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// SQL statement to query addresses whose latitude is between 40.746 and 40.756: 
var thisQuery = "SELECT address, city, state, lat, long FROM aalocations WHERE lat BETWEEN 40.746 AND 40.756;";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
```
The result from my console:

address | city | state | lat | long             
-------------------- | -------- | ----- | ---------------- | -----------------
305 7th Avenue | New York | NY | 40.7467107 | -73.9935208      
441 West 26th Street | New York | NY | 40.7495486 | -74.0015106      
211 West 30th Street | New York | NY | 40.7486793956479 | -73.9927286472649
307 West 26th Street | New York | NY | 40.7474685 | -73.9974137      
446 West 33rd Street | New York | NY | 40.753496 | -73.9989428      
4 West 43rd Street | New York | NY | 40.7543885 | -73.9812083      
134 West 29th Street | New York | NY | 40.7472463 | -73.9917061      
446 West 33rd Street | New York | NY | 40.753496 | -73.9989428      

### Reference
[Operators in The WHERE Clause](https://www.w3schools.com/sql/sql_where.asp)

## Part Two: Query DynamoDB

For this query, I plan to retrieve the items on no-class days and between 2020-10-20 and 2020-10-25. However, I failed to make the query. Then I turned to make a query for a specific date as a compromise plan.

```javascript
// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "blog",
    KeyConditionExpression: "classday = :classday AND #dt = :filterDate", 
    ExpressionAttributeNames: {"#dt" : "date"},
    ExpressionAttributeValues: {
        ":classday": {S: "no"},
        ":filterDate": {S: "Sun Oct 18 2020"},
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
```

The result:
``` console
Query succeeded.
***** ***** ***** ***** ***** 
 { sleep_duration_before_waking_up: { N: '6' },
  location: { S: 'Hangzhou' },
  date: { S: 'Sun Oct 18 2020' },
  donelist:
   { SS: [ 'Parsed the remaining data of zone 4 in AA meeting' ] },
  mood: { S: 'negative' },
  exercise: { BOOL: true },
  classday: { S: 'no' } }
```

Although I successfully made a query in the end, I have too many questions and confusion.
1. I used the sample code in addToDynamo.js to create an attribute in the number data type, it didn't work. The console said: `'One or more parameter values were invalid: Type mismatch for key date expected: S actual: N',` Then I realized that I set my sort key as a string when creating DynamoDB 'table'.
2. So I store my date data using ISO 8601 strings: `YYYY-MM-DD`. However, I found in the item preview table in DynamoDB, the date is shown as the format like `Tue Oct 20 2020`. I'm not sure if it is automatically converted from `YYYY-MM-DD` to `Tue Oct 20 2020` by DynamoDB.
3. And then I tried several times to make a query:

- the FIRST round
```javascript
var params = {
    TableName : "blog",
    KeyConditionExpression: "classday = :classday AND #dt BETWEEN :minDate AND :maxDate", 
    ExpressionAttributeNames: {"#dt" : "date"},
    ExpressionAttributeValues: {
        ":classday": {S: "no"},
        ":minDate": {S: "2020-10-20"},
        ":maxDate": {S: "2020-10-24"}
    }
};
```
No objects returned, but 'Query succeeded.'.

- the SECOND round
I searched some discussions on querying ISO data in DynamoDB, and an AWS DynamoDB Specialist says: >If you store the date in ISO 8601 using a string data type, you can perform date range queries in DynamoDB. If you need to perform between two date attributes, you will need to use a FilterExpression:
`FilterExpression: “start_date BETWEEN :date1 and :date2”`
However, when I looked up the documentation, it says: >A filter expression cannot contain partition key or sort key attributes. You need to specify those attributes in the key condition expression, not the filter expression.
In my case, my sort key is the date. So I cannot use a FilterExpression to filter the date range. I think I have no way out.

- the SECOND round
I revised my strategy: to tentatively query a specific day. So:
```javascript
var params = {
    TableName : "blog",
    KeyConditionExpression: "classday = :classday AND #dt = :filterDate",
    ExpressionAttributeNames: { 
        "#dt" : "date"
    },
    ExpressionAttributeValues: {
        ":classday": {S: "no"},
        ":filterDate": {S: "2020-10-20"},
    }
};
```
'Query succeeded.', but no objects returned. Then I tried this way:
```javascript
var params = {
    TableName : "blog",
    KeyConditionExpression: "classday = :classday AND #dt = :filterDate",
    ExpressionAttributeNames: { 
        "#dt" : "date"
    },
    ExpressionAttributeValues: {
        ":classday": {S: "no"},
        ":filterDate": {S: "Sun Oct 18 2020"},
    }
};
```
This time, I successfully got the correct object. But my question is why I need to strictly use the "Sun Oct 18 2020" to query the date. Not to mention that I store the date use the format "2020-10-20". And how to prevent DynamoDB from converting my date format?

- the Third round
Based on the result of the second round, I tried to use `KeyConditionExpression` to query the date range.

```javascript
var params = {
    TableName : "blog",
    KeyConditionExpression: "classday = :classday AND #dt BETWEEN :minDate AND :maxDate", 
    ExpressionAttributeNames: {"#dt" : "date"},
    ExpressionAttributeValues: {
        ":classday": {S: "no"},
        ":minDate": {S: "Sun Oct 18 2020"},
        ":maxDate": {S: "Sun Oct 25 2020"}
    }
};
```
The result is strange, which returns two objects that are exact the ":minDate" and ":maxDate". That indicates the BETWEEN operation did not function as I expected.