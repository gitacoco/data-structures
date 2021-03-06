// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/4.txt');                           // load the 4.txt file into a variable, `content`
var $ = cheerio.load(content);                                         // load `content` into a cheerio object
var addressList = '';                                           

$('td[style="border-bottom:1px solid #e3e3e3; width:260px"] b')        // Use CSS selector to select all td elements with a specific tyle and element
    .each(function(i, elem){
    addressList += $(elem.nextSibling.nextSibling).text()              // Use .nextSibling method to re-navigate to a new object
                                                  .split(',')[0]       // Split it and only keep the first object
                                                  .split(/-|Rm/)[0]    // Deal with the outlier
                                                  .trim() + ','       // Remove spaces and make the variable hold the lines
});


    var array = addressList.split(',');
    console.log(array);
    fs.writeFileSync('data/wa02_addressList.json', JSON.stringify(array));                 // Write all the addresses to a text file