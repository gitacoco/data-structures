var express = require('express'), 
app = express();
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config(); 

//var AWS = require('aws-sdk');
const moment = require('moment-timezone');
const handlebars = require('handlebars');
var fs = require('fs');

const sensorindexSource = fs.readFileSync("templates/sensor.html").toString();
var sensorTemplate = handlebars.compile(sensorindexSource, { strict: true });

const mapindexSource = fs.readFileSync("templates/map.html").toString();
var mapTemplate = handlebars.compile(mapindexSource, { strict: true });

// AWS RDS POSTGRESQL credentials
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_UN;
db_credentials.host = process.env.AWSRDS_EP; 
db_credentials.database = process.env.AWSRDS_DB;
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

//regerate the landing page
app.get('/', function(req, res) {
    res.send(`<h3 style="top: 100px; margin: 10% 0 0 45%;">Zhibang's Final Projects</h3><ul style="margin: 1% 0 0 44%;"><li><a href="/aa">AA Meetings Platform</a></li><li><a href="https://gitacoco.github.io/ds-finalproject2/index.html">Personal Activity Blog</a></li><li><a href="/temperature">Sensor Data Visualization</a></li></ul>`);
}); 

// respond to requests for /aa
app.get('/aa', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();
    
    // SQL query 
    var now = moment.tz(Date.now(), "America/New_York"); 
    var todayIndex = now.day(); 
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    var _today = days[todayIndex -1].toString();
    var today = "'"+ _today +"'"; 
    
    var thisQuery = `SELECT aalocations.meetingID, lat, lng, day, address, zipcode, wheelchairaccess, meetingname,
    json_agg(json_build_object('startTime', startTime, 'endTime', endTime, 'meetingType', meetingType, 'specialInterest', specialInterest)) AS meetingTime
    FROM aalocations
    INNER JOIN aatimeLists USING(meetingID)
    WHERE aatimeLists.day = ` + today  + 
    `GROUP BY lat, lng, day, meetingID, address, zipcode, wheelchairaccess, meetingname
    ORDER BY meetingID;`
    
    client.query(thisQuery, (err, qres) => {
        if (err) { throw err }
        
        else {
            res.end(mapTemplate({ mapdata: JSON.stringify(qres.rows)}));
            client.end();
            console.log('2) responded to request for aa meeting location data');
        }
    });
    
 });

app.get('/temperature', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    var q = `SELECT to_char(sensorTime, 'MM-DD') as sensordate,
             AVG(Temperature::int) as num_obs
             FROM sensorData
             GROUP BY sensordate
             ORDER BY sensordate;`;
             
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.end(sensorTemplate({ sensordata: JSON.stringify(qres.rows)}));
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
}); 


// serve static files in /public
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// listen on port 8080
var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Server listening...');
});