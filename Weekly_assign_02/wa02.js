// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the 4.txt file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/4.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// var addressList = ''; // this variable will hold the lines of text
var addressList = '';

//Use CSS selector to select all td with tyle="border-bottom:1px solid #e3e3e3; width:260px"
$('td[style="border-bottom:1px solid #e3e3e3; width:260px"] b').each(function(i, elem){
  addressList += $(elem.nextSibling.nextSibling).text().split(',')[0].split('-')[0].split('Rm')[0].trim() + '\n'
});
   
//write the addresses to a text file
fs.writeFileSync('data/addressList.txt', addressList);