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
But the result showed that there was something wrong:
```console
ec2-user:~/environment $ node wa04b.js
{ error: syntax error at or near "York"
    ……} undefined
```
After consulting the documentation, I found that bescides `,`(comma), `\s`(blank space) is also one kind of the escape characters. So I expanded the coverage of the second single quotation mark of E to include another two identifiers:
```js
var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + ", " + value.city + ", " + value.state + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
```
So far, so good. The results in console looked well. Then I use `var thisQuery = "SELECT * FROM aalocations;"` to query all of the contents in my database table and check my work.
```console
ec2-user:~/environment $ node wa04c.js
null [ { address: '303 West 42nd Street, New York, NY',
    city: '40.7575385',
    state: '-73.9901368',
    lat: null,
    long: null },
```
Unfortunately, the result that showed a dislocation was still not we want. Then I realized that I needed to put an E' in front of those three string, respectively, to avoid the SQL escaping the commas among name/value pairs in JSON. 
```js
var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', E'" + value.city + "', E'" + value.state + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
```
However, after I ran `wa04c.js` again, I found that the former contents were not covered automatically, which indicates that `INSERT INTO aalocations VALUES` will just add new rows below the previous ones. To solve this issue, I made a fresh start from `wa04a.js` to `wa04c.js` and get the proper result:
```console
ec2-user:~/environment $ node wa04c.js
null [ { address: '303 West 42nd Street',
    city: 'New York',
    state: 'NY',
    lat: 40.7575385,
    long: -73.9901368 },
  { address: '252 West 46th Street',
    city: 'New York',
    state: 'NY',
    lat: 40.7593831,
    long: -73.9872329 },
    …
```

#### Reference

* [4.1.2.2. String Constants with C-style Escapes](https://www.postgresql.org/docs/13/sql-syntax-lexical.html)
