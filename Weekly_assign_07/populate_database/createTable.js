const { Client } = require('pg');
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

// Creating the location tables:
var thisQuery = "CREATE TABLE aalocations (zoneID integer, meetingID integer, meetingName varchar(1000), address varchar(120), city varchar(120), state varchar(2), zipCode integer, lat double precision, lng double precision, buildingName varchar(1000), roomFloor varchar(500), wheelChairAccess boolean);";

// Creating the time tables:
//var thisQuery = "CREATE TABLE aatimeLists (zoneID integer, meetingID integer, day varchar(120), startTime time, endTime time, meetingType varchar(120), specialInterest varchar(255));";

//var thisQuery = "DROP TABLE aalocations;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

// client.query(thisTimeListQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });