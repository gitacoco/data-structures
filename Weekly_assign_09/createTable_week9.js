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

/////////////////////////
// Creating the table:
////////////////////////
var thisQuery = "CREATE TABLE sensorData (temperature double precision, humidity double precision, sensorTime timestamp DEFAULT current_timestamp);";

//var thisQuery = "DROP TABLE aalocations;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

// client.query(thisTimeListQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });