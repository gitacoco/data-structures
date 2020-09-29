# Weekly Assignment 4

This week, I'm going to continue working with the data I scraped, parsed, and augmented in the previous three assignments. In this assignment, I will write my AA data to a relational database.

## Part One: Plan

## Part Two: Create a table in my database

The data last week I parsed from TAMU API has five dimensions, so I'm to build a table with five columns correspondingly. Here is one piece of the data:
```JSON
[ {"address":"303 West 42nd Street","city":"New York","state":"NY","latLong":{"lat":"40.7575385","lng":"-73.9901368"}}, … ]
```
After configuring the database credentials, I use `pg` module to make SQL statements to create a new table. 
```js
// Sample SQL statement to create a table: 
const { Client } = require('pg');
var thisQuery = "CREATE TABLE aalocations (address varchar(100), city varchar(50), state varchar(50), lat double precision, long double precision);";

}
```
All progress has been satisfactory up to now. But next, I met several issues.

## Part Three: Populate the database

In this step, I continued to use `pg` module to insert my AA data into the table I created.

### Prepare the data file

First of all, we need to make sure we have the correct number of rows in our JSON file, however, as I said last week, there is a blank line 

### Problem solving while populating

In the beginning, I modified the starter code with my own situation —— to add more columns:
```js
var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.city + ", " + value.state + ", " + value.latLong.lat + ", " + value.latLong.lng + ");";
```
But the result shows there is something wrong:
```console
ec2-user:~/environment $ node wa04b.js
{ error: syntax error at or near "York"
    ……} undefined
```

#### Reference

* [Node `querystring` module](https://nodejs.org/api/querystring.html)
