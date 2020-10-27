const { Client } = require('pg'),
    async = require('async'),  
    dotenv = require('dotenv'),
    fs = require('fs');
dotenv.config();  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'gitacoco';
db_credentials.host = 'data-structures.cmwlovjahk2o.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Introduce the address data in DB
var addressFile="./week7/geocoded_data/location_geocoded.json";
var addressesForDb = JSON.parse(fs.readFileSync(addressFile));

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisLocationsQuery = "INSERT INTO aalocations VALUES (E'" + value.zoneID + "', E'" + value.meetingID + "', E'" + value.meetingName + "', E'" + value.streetAddress + "', E'" + value.city + "', E'" + value.state + "', E'" + value.zipCode + "', " + value.latLong.lat + ", " + value.latLong.lng + ", E'" + value.buildingName + "', E'" + value.roomFloor + "', E'" + value.wheelChair + "', E'" + value.detailsBox + "');";
    client.query(thisLocationsQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 500); 
}); 

// Introduce the time data in DB
var timeFile="./week7/merged_data/time_merged.json";
var timeForDb = JSON.parse(fs.readFileSync(timeFile));

async.eachSeries(timeForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisTimeQuery = "INSERT INTO aatimeLists VALUES (E'" + value.zoneID + "', E'" + value.meetingID + "', E'" + value.day + "', E'" + value.startTime + "', E'" + value.endTime + "', E'" + value.meetingType + "', E'" + value.specialInterest + "');";
    client.query(thisTimeQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 500); 
}); 