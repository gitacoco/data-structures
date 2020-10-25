// npm install

var fs = require("fs");
var cheerio = require("cheerio");

var content = fs.readFileSync("data/4.txt");
var $ = cheerio.load(content);

//const rule = require("./replace_rules.json"); // to introduce the configuration file

var locationList = [];

$("tbody tbody tbody tr").each(function (i, elem) {
  // MeetingID
  var meetingID = $(elem).find("a").eq(0).attr("href").split("=")[1];

  // Building Name
  var buildingName = $(elem).find("h4").eq(0).text();

  // Meeting Name
  var meetingName = $(elem).find("b").eq(0).text();

  // Address
  const rule = require("./replace_rules.json"); // to introduce the configuration file
    // Street
    var _address = $(elem).find("b")[0].nextSibling.nextSibling; // to navigate our target parsing location. the same way as before
    var address_string = $(_address).text().split(",")[0].split(/-|Rm/)[0].trim(); //to roughly get the address with some inconsistent spelled words
    var address_stringlist = address_string.split(" "); //to break down the address into single words and store them in array

    rule.forEach(function (eachRule) {
        //to select each rule in the configuration file. forEach function here will iterater each rule
        eachRule.from.forEach(function (eachFrom) {
        //to select each inconsistent spelled word. forEach function here will iterater each word in the "from" array
        for (let i = 0; i < address_stringlist.length; i++) {
            //to use for loops comparing the word in address_stringlist with the word from "from" array in the configuration file one by one
            if (eachFrom.indexOf(address_stringlist[i]) >= 0) {
            //if not matched, the value would be -1, this word would be skipped. if matched, the value would large than 0, then
            address_stringlist[i] = eachRule.to; //assign the value in "to" attribute to the word
            }
        }
        });
    });
    var address = address_stringlist.join(" ").trim(); //to joins all elements of an array into a string. the separator here is a space

    //Room and Floor
    var roomFloor_string = $(_address).text().split(/,| - /).slice(1).toString().replace(/\b\d{5}\b/g, "").replace(/,/g, "").trim();
    var roomFloor_stringlist = roomFloor_string.split(" ");

    rule.forEach(function (eachRule) {
        eachRule.from.forEach(function (eachFrom) {
        if (roomFloor_stringlist.length > 1) {
            // I add this statement since if there is no content, the field will be filled with the first rule. I don't know why
            for (let i = 0; i < roomFloor_stringlist.length; i++) {
            if (eachFrom.indexOf(roomFloor_stringlist[i]) >= 0) {
                roomFloor_stringlist[i] = eachRule.to;
            }
            }
        }
        });
    });
    var roomFloor = roomFloor_stringlist.join(" ").trim();

  // Zipcode
  var zipCode = $(elem).html().trim().match(/\b\d{5}\b/g);

  // DetailsBox
  var detailsBox = $(elem).find("div").eq(0).text().trim();

  // Accessible Facility
  var wheelChair;

  if ($(elem).html().includes("span")) {
    wheelChair = true;
  } else {
    wheelChair = false;
  }

  var meetingLocation = {
    meetingID: meetingID,
    streetAddress: address,
    buildingName: buildingName,
    //roomFloor: roomFloor,
    city: "New York",
    state: "NY",
    zipCode: `${zipCode}`,
    detailsBox: detailsBox,
    wheelChair: wheelChair,
  };

  locationList.push(meetingLocation);
});

console.log(locationList);

var timeList = [];

$("tbody tbody tbody tr").each(function (i, elem) {
  // MeetingID
  var meetingID = $(elem).find("a").eq(0).attr("href").split("=")[1];

  // Transfer the html content in the second <td> in each tr to an array
  var allString = $(elem).find("td").eq(1).html().trim();
  var _timeArray = allString.split(/<br>\s*<br>/).toString().trim().replace(/Gay,/g, "Gay").split(",");
  // Remove the last empty entry in array
  var timeArray = _timeArray.filter(function (val) {
    return val !== "";
  });

  $(timeArray).each(function (i, eachInfo) {
    var eachInfo_htmltags = $(eachInfo).toString().trim();
    var eachInfo_notags = $(eachInfo).text().trim();

    // Day of the week
    var day = eachInfo_notags.split("From")[0].trim();
    // !!I have no idea that how to skip the outlier entry in each function

    // Start Time
    var startTime = eachInfo_notags.split("From")[1].split("to")[0].trim();

    // End Time
    var endTime = eachInfo_htmltags.split("<b>to</b>")[1].split("<br><b>")[0].trim();

    // Meeting Type
    if (eachInfo_notags.includes("=")) {
      var _type = eachInfo_notags.split("=")[1].trim();

      if (_type.includes("Special Interest")) {
        var type = _type.split("Special Interest")[0].trim();
      } else {
        var type = _type;
      }
    } else {
      var type = "N/A";
    }

    // Special Interest
    if (eachInfo_notags.includes("Special Interest")) {
      var _interest = eachInfo_notags.split("Special Interest")[1].trim();
      var interest = _interest.replace(/Gay/g, "Gay,");
    } else {
      var interest = "N/A";
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
