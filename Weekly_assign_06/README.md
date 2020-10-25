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

## Part Two: Write and execute a query for your AA data PostgreSQL