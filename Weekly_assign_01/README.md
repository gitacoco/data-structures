# Introduction

This is one of the series of weekly assignments under Final Project 1. This documentation would be progressive and be distributed in each week's folder.

# The Goal of Week 1
To collect the raw data by conducting web scraping towards AA zones webpages, so that we could make a modern and user-friendly map-based information inquiry interface in the next few classes. [Detailed Requirements](/Weekly_assign_01/brief_assignment_01.md)

# Highlights

1. Write a JavaScripe For loop to get information that is across multiple pages named in a predicted way. Use the self-executing anonymous function ```javascript // (function () {/*code*/} ) () ``` to solve the problem of "For loop only shows last value of array" 

2. Use ```javascript("00" + num).slice(-2)``` to make sure all numbers are specific-length integer values, so that the file names in the URL could be represented by an uniform unknown number. 

# Code Preview
```javascript
var request = require('request');
var fs = require('fs');
var itemUrl="", FileName="";
for (var i=1;i<11;i++){
    let num = i;
    (function (i) {
    itemUrl = "https://parsons.nyc/aa/m" + ("00" + num).slice(-2) + ".html";
    
    request(itemUrl, function(error, response, body){
    if (!error && response.statusCode == 200) { 
        FileName="/home/ec2-user/environment/data/" + i + ",txt";
        fs.writeFileSync(FileName, body);
    }
    else {console.log("Request failed!")}
    });
    })(i);
   }

```

# Reference
* [How can I format an integer to a specific length in javascript?](https://stackoverflow.com/questions/1127905/how-can-i-format-an-integer-to-a-specific-length-in-javascript)
* [Self-executing anonymous function](https://www.cnblogs.com/csuwujing/p/8021913.html)
