// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
var file="./data/wa02_addressList.json";
var addresses = JSON.parse(fs.readFileSync(file));

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(address, callback) {
    let query = {
        streetAddress: address,
        city: "New York",
        state: "NY",
        apiKey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    request(apiRequest, function(error, response, body) {
        //if (err){ throw err; }
        
        let tamuGeo = JSON.parse(body);
        
        let city = tamuGeo['InputAddress'].City;
        let state = tamuGeo['InputAddress'].State;
        let latitude = tamuGeo['OutputGeocodes'][0].OutputGeocode.Latitude;
        let longitude = tamuGeo['OutputGeocodes'][0].OutputGeocode.Longitude;
        
        let finalGeo = { address: address, city, state, latLong: {lat: latitude, lng: longitude} };
        
        console.log(finalGeo);
        meetingsData.push(finalGeo);
    });

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 1000);
}, 


function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});
