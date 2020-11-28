var request = require('request');
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config(); 

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable1 = 'tempC';
var particle_variable2 = 'Humidity';
var tempC_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable1 + '?access_token=' + access_token;
var Humid_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable2 + '?access_token=' + access_token;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'gitacoco';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var getAndWriteData = function() {
    // Make request to the Particle API to get sensor values
    request(tempC_url, function(error, response, body1) {
        var tem = JSON.parse(body1).result;
        
        request(Humid_url, function(error, response, body2) {
        
            var hum = JSON.parse(body2).result;
            console.log(tem, hum);
        
            const client = new Client(db_credentials);
            client.connect();
        
            var thisQuery = "INSERT INTO sensorData VALUES (" + tem + ", " + hum + ", DEFAULT);";
            console.log(thisQuery); // for debugging
        
            client.query(thisQuery, (err, res) => {
                console.log(err, res);
                client.end();
            });
            
        });
    
    });

};

// write a new row of sensor data every five minutes
setInterval(getAndWriteData, 300000);