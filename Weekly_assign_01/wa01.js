// npm install request
// mkdir data

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
