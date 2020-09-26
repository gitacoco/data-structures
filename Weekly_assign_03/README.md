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
### Use Sample Data
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
  //Write into a JOSN file
}
```
### Read Data from Previous Work(local file)


#### Reference

* [Texas A&M Geoservices Geocoding APIs](http://geoservices.tamu.edu/Services/Geocode/WebService/)  
* [Node `querystring` module](https://nodejs.org/api/querystring.html)
* [npm `async` module](http://caolan.github.io/async/)  
* [npm `dotenv` module](https://www.npmjs.com/package/dotenv)
