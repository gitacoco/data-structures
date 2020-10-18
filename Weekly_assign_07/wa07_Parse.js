// npm install

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/4.txt');
var $ = cheerio.load(content); 

var locationList = [];

    $('tbody tbody tbody tr').each(function(i, elem){
        
        // MeetingID
        var meetingID = $(elem).find('a').eq(0).attr('href').split('=')[1]
       
        // Building Name
        var buildingName = $(elem).find('h4').eq(0).text();
            
        // Meeting Name
        var meetingName = $(elem).find('b').eq(0).text();
        
        // Street, Room and Floor
        var _address = $(elem).find('b')[0].nextSibling.nextSibling
                        
        var address = $(_address).text().split(',')[0].split(/-|Rm/)[0]
                        .replace('W.','West').replace('Street','St').replace(/St.|St/,'Street').trim();
     
        var roomFloor = $(_address).text().split(/,| - /).slice(1).toString()
                        .replace(/\b\d{5}\b/g,'').replace(/FL.|Floor/,'Fl').replace('Fl','Floor')
                        .replace(/,/g,'').replace('.','').replace('(Room','Room').trim();
         
        // Zipcode
        var zipCode = $(elem).html().trim().match(/\b\d{5}\b/g).toString();
        
        // DetailsBox
        var detailsBox = $(elem).find('div').eq(0).text().trim();
        
        // Accessible Facility
        var wheelChair;
        
        if ($(elem).text().includes('span')){
            wheelChair = true;
        } else {
            wheelChair = false;
        };
        
        var meetingLocation = {
            meetingID: meetingID,
            streetAddress: address,
            buildingName: buildingName,
            roomFloor: roomFloor,
            city: "New York",
            state: "NY",
            zipCode: zipCode,
            detailsBox: detailsBox,
        };
        
        locationList.push(meetingLocation);
    });

console.log(locationList);

var timeList = [];

    $('tbody tbody tbody tr').each(function(i, elem){
        
        // MeetingID
        var meetingID = $(elem).find('a').eq(0).attr('href').split('=')[1]
        
        // Transfer the html content in the second <td> in each tr to an array
        var allString = $(elem).find('td').eq(1).html().trim();
        var _timeArray = allString.split(/<br>\s*<br>/).toString().trim().replace(/Gay,/g,'Gay').split(',');
        // Remove the last empty entry in array
        var timeArray = _timeArray.filter(function(val){return val!==''});
        
        $(timeArray).each(function(i, eachInfo){
            
            var eachInfo_htmltags = $(eachInfo).toString().trim();
            var eachInfo_notags = $(eachInfo).text().trim();
            
                // Day of the week
                var day = eachInfo_notags.split('From')[0].trim();
                    // !!I have no idea that how to skip the outlier entry in each function
            
                // Start Time
                var startTime = eachInfo_notags.split('From')[1].split('to')[0].trim();
        
                // End Time
                var endTime = eachInfo_htmltags.split('<b>to</b>')[1].split('<br><b>')[0].trim();
                
                // Meeting Type
                if (eachInfo_notags.includes('=')) {
                    var _type = eachInfo_notags.split('=')[1].trim();
                        
                        if (_type.includes('Special Interest')) {
                            var type = _type.split('Special Interest')[0].trim();
                        } else {
                            var type = _type
                        }
                    
                } else {
                    var type = 'N/A'
                }
                
                // Special Interest
                if (eachInfo_notags.includes('Special Interest')){
                    var _interest = eachInfo_notags.split('Special Interest')[1].trim();
                    var interest = _interest.replace(/Gay/g,'Gay,');
                } else {
                    var interest = 'N/A'
                }
            
            
            var eachTime = {
                meetingID: meetingID,
                day: day,
                startTime: startTime,
                endTime: endTime,
                meetingType: type,
                specialInterest: interest,
            };
            
            timeList.push(eachTime);
            
        });
            
    });

console.log(timeList)