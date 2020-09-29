# Weekly Assignment 4

This week, I'm going to continue working with the data I scraped, parsed, and augmented in the previous three assignments. In this assignment, I will write my AA data to a relational database.

## Part One: Plan

I built a data model for the AA meetings data using ER diagrams. Following is the building process:
1. I imitated the common thinking of locating an event or describing an event: "what meeting, when and where" or "when and where, there is a meeting of xxx". So I summarized 3 entities: Location, Time and Meetings.
2. I sorted out all the content/data/variables from the website that I believe to be relevant, and categorized them into those three entities.
    - Location: Longitude, Latitude, Building_name(has null values), Street, Zone, Borough, City, State, Zip_code
    - Time: Day, Start_time, End_time
    - Meeting: Meeting_name(has null values), Meeting_type, Special_interest

3. I determined Primary Keys(PK) and Foreign Keys(FK) for each entity:
    - Location: Location_ID(PK), Time_ID(FK), Longitude, Latitude, Building_name(has null values), Street, Zone, Borough, City, State, Zip_code
    - Time: Time_ID (PK), Location_ID(FK), Day, Start_time, End_time
    - Meeting: Location_ID(PK, FK), Time_ID(PK, FK), Meeting_name(has null values), Meeting_type, Special_interest
    
For the entity of Meeting, I intend to creat a composite key with two Foreign Keys, because I think the meeting is unique at a specific location at the exact same time, which sounds mutual exclusive naturally. Actually, in the beginning, I added a PK for Meeting, which is Meeting_ID. But I just want to give a try by using a composite key.

4. Map relationships and the cardinality among entities. In other words, to illustrate the association between two entities.
> So the hierarchy of the data would be three related Logical Tables at the logical layer and the relationship between an entity and its attributes in each table at the Physical Layer.
![Data Model](https://github.com/gitacoco/data-structures/blob/master/Weekly_assign_04/DataModel.png)

## Part Two: Create a table in my database

The data last week I parsed from TAMU API has five attributes, so I'm to build a table with five columns correspondingly. Here is one piece of the data:
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

First of all, we need to make sure we have the correct number of rows in our JSON file, however, as I said last week, there is a blank line in the last row. This week, I reconstruct my code and solved this issue.

#### Code alternatives
1. using .trim() method
```js
var addressList = '';                                           
$('td[style="border-bottom:1px solid #e3e3e3; width:260px"] b')     
    .each(function(i, elem){
    addressList += $(elem.nextSibling.nextSibling).text().split(',')[0].split(/-|Rm/)[0].trim() + '\n';    
});

var array = addressList.trim().split('\n');
fs.writeFileSync('data/addressList1.json', JSON.stringify(array));    
```
2. using .push() method
```js
var array = [];
$('td[style="border-bottom:1px solid #e3e3e3; width:260px"] b').each(function(i, elem){
    array.push($(elem.nextSibling.nextSibling).text().split(',')[0].split(/-|Rm/)[0].trim()); 
});

fs.writeFileSync('data/addressList.json', JSON.stringify(array));          
```
3. using .map() method
```js
var array = $('td[style="border-bottom:1px solid #e3e3e3; width:260px"] b').map(function(i, elem) {
  return $(elem.nextSibling.nextSibling).text().split(',')[0].split(/-|Rm/)[0].trim();
});

fs.writeFileSync('data/addressList.json', JSON.stringify(array));     
```

### Problem solving while populating

In this step, we're supposed to populate the database using the JSON data. In the beginning, I modified the starter code with my own situation —— to add more columns:
```js
var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.city + ", " + value.state + ", " + value.latLong.lat + ", " + value.latLong.lng + ");";
```
But the result showed that there was something wrong:
```console
ec2-user:~/environment $ node wa04b.js
{ error: syntax error at or near "York"
    …} undefined
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

## Part Four: Check your work (finally)
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

* [String Constants with C-style Escapes](https://www.postgresql.org/docs/13/sql-syntax-lexical.html)
* [Crow’s Foot Notation](https://www.vertabelo.com/blog/crow-s-foot-notation/)
* [What is an Entity Relationship Diagram (ERD)?](https://www.lucidchart.com/pages/er-diagrams)
* [Entity Relationship Diagram (ERD) Tutorial - Part 1](https://www.youtube.com/watch?time_continue=319&v=QpdhBUYk7Kk&feature=emb_logo)
* [Entity Relationship Diagram (ERD) Tutorial - Part 2](https://www.youtube.com/watch?v=-CuY5ADwn24)
