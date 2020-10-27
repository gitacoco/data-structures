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
let location_geocoded = [];
var file="./week7/merged_data/location_merged.json";
var addressList = JSON.parse(fs.readFileSync(file));


// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addressList, function(addressObject, callback) {
    
    let address = addressObject['streetAddress'];

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
        
        let finalGeo = {
            zoneID: addressObject['zoneID'],
            meetingID: addressObject['meetingID'],
            streetAddress: address,
            buildingName: addressObject['buildingName'],
            roomFloor: addressObject['roomFloor'],
            city: city,
            state: state,
            zipCode: addressObject['zipCode'],
            detailsBox: addressObject['detailsBox'],
            wheelChair: addressObject['wheelChair'],
            latLong: 
                {lat: latitude, 
                lng: longitude}
            };
        
        //location_geocoded = addressObject.concat(finalGeo);
        location_geocoded.push(finalGeo);
        console.log(location_geocoded);
    });
        
    // sleep for a couple seconds before making the next request
    setTimeout(callback, 500);
}, 


function() {
    fs.writeFileSync('week7/geocoded_data/location_geocoded.json', JSON.stringify(location_geocoded));
    console.log('geocoding task finished');
    console.log(`Number of meetings totally: ${location_geocoded.length}`);
});
