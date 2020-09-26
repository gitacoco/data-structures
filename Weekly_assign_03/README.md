# Weekly Assignment 3

This assignment is going to make queries using the address data parsed in weekly assignment 2, filter the response, make sure the final output is a `.json` **file** that contains an **array** that contains an **object** for each meeting:
```js
[ 
  { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } },
  { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } 
]
```

## Start

### Configure an Environment Variable for API Key

To avoiding being hacked, we need to keep our API key off of Github. We use NPM Dotenv Module to manage Environment Variable for Node project.
```js
require('dotenv').config() //read the .env file in root directory by default
process.env. + variable's name //match the corresponding variable
```
### Using Sample Data
Last week, my final outcome is not organized as arrays. So I decided to run through the whole process using the sample data first and then deal with the original data.
Sample Data:
```js
let addresses = ["63 Fifth Ave", "16 E 16th St", "2 W 13th St"];
```

### Make Requests to [TAMU Geocoding APIs](http://geoservices.tamu.edu/Services/Geocode/WebService/)
In the following two steps, we use NPM Async Module for asynchronous control flow.
```js
async.eachSeries(addresses, function(address, callback) {
  //Write a script for query
  //Use querystring.stringify(obj,separator,eq,options) to construct a querystring
  //Make a request for one address
  //……
}
```

### Process the Response Data and Save it to a Local File

```js
async.eachSeries(addresses, function(address, callback) {
  //……
  //Extract the target information in the response
  //Build a GeoJSON template
  //Write into a JOSN file
}
```
After carefully examination, I found that nested Arrays in JSON Objects flooded the response data, which means values in an array are also another array, or even another JSON object. 

```JSON
{
	"version" : "4.10",
	"TransactionId" : "7d2cbbc1-8972-4023-98d5-1e7759e11b31",
	"Version" : "4.1",
	"QueryStatusCodeValue" : "200",
	"FeatureMatchingResultType" : "BrokenTie",
	"FeatureMatchingResultCount" : "2",
	"TimeTaken" : "0.0624732",
	"ExceptionOccured" : "False",
	"Exception" : "",
	"InputAddress" :
		{
		"StreetAddress" : "63 FIFTH AVE New York NY ",
		"City" : "New York",
		"State" : "NY",
		"Zip" : ""
		},
	"OutputGeocodes" :
	[
		{
		"OutputGeocode" :
			{
			"Latitude" : "40.6807157",
			"Longitude" : "-73.9773913",
			"NAACCRGISCoordinateQualityCode" : "00",
			"NAACCRGISCoordinateQualityType" : "AddressPoint",
			"MatchScore" : "97.3372781065089",
			"MatchType" : "Relaxed;Soundex",
			"FeatureMatchingResultType" : "BrokenTie",
			"FeatureMatchingResultCount" : "2",
			"FeatureMatchingGeographyType" : "Parcel",
			"RegionSize" : "0",
			"RegionSizeUnits" : "Meters",
			"MatchedLocationType" : "LOCATION_TYPE_STREET_ADDRESS",
			"ExceptionOccured" : "False",
			"Exception" : "",
			"ErrorMessage" : ""
			}
		}
	]
}
```
#### Take its essence: get what we want 
This step is the most important part in this task. I met many challenges here. Our goal is to get the "Latitude" and "Longitude" coordinate for each address. So we need to filter other information out, or manage to get the exact data.

We need to deconstruct them one by one. First, we could access the object value "OutputGeocodes" by using dot (.) or bracket ([]) notation `tamuGeo['OutputGeocodes']`, and next we can access the first and the only array value by using the index number `tamuGeo['OutputGeocodes'][0]`. Then the left two levels are both Objects, whose values could be accessed by using dot (.) notation `tamuGeo['OutputGeocodes'][0].OutputGeocode.Latitude`. And so on and so forth
```JS
request(apiRequest, function(error, response, body) {
        //if (err){ throw err; }
        
        let tamuGeo = JSON.parse(body);
	
        let city = tamuGeo['InputAddress'].City;
        let state = tamuGeo['InputAddress'].State;
        let latitude = tamuGeo['OutputGeocodes'][0].OutputGeocode.Latitude;
        let longitude = tamuGeo['OutputGeocodes'][0].OutputGeocode.Longitude;
```

#### Template first, variables filled, New data pushed
```JS
let finalGeo = { address: address, city, state, latLong: {lat: latitude, lng: longitude} };
meetingsData.push(finalGeo);
```
#### Save the file
Finally, use JSON.stringify() method to convert a JavaScript object or value to a JSON string.
```js
function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
}
```
At this point, the whole process can be considered to be workable.

### Read Data from Previous Work(local file)
To prepare my data for work on this assignment, I made three modifications. Thus, they could be an array. 
1. `var addressList = '';` to `var addressList = []; `
2. `.trim() + '\n'` to `.trim() + ','`
3. `var array = addressList.split(',');`

But the problem is that there is a blank line in the last row. I tried to use regular expression to eliminate it:
```js
function replaceBlank(){
	var reg = /\n(\n)*( )*(\n)*\n/g;
	var oldStr = $("#oldStr").val();
	var newStr = oldStr.replace(reg,"\n");
	$("#newStr").val(newStr);
}
```
But it didn't work. I finally delete the last bank line manually. 

#### Reference

* [Node `querystring` module](https://nodejs.org/api/querystring.html)
* [npm `async` module](http://caolan.github.io/async/)  
* [npm `dotenv` module](https://www.npmjs.com/package/dotenv)
* [JSON Arrays](https://www.w3schools.com/js/js_json_arrays.asp)
* [JSON Objects](https://www.w3schools.com/js/js_json_objects.asp)
