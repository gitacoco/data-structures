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

// Introduce the address data in JSON
var file="./data/AAmeeting04.json";
var addressesForDb = JSON.parse(fs.readFileSync(file));

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', E'" + value.city + "', E'" + value.state + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 