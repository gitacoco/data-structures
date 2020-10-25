var blogEntries = [];

class BlogEntry {
  constructor(classday, date, sleep_duration_before_waking_up, location, donelist, exercise, mood) {
    this.classday = {};
    //this.classday.BOOL = classday.toString();
    this.classday.S = classday;
    
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    
    this.sleep_duration_before_waking_up ={};
    this.sleep_duration_before_waking_up.N = sleep_duration_before_waking_up.toString()
    
    this.location = {};
    this.location.S = location;
    
    if (donelist != null) {
      this.donelist = {};
      this.donelist.SS = donelist; 
    }
    
    this.exercise = {};
    this.exercise.BOOL = exercise;
    
    this.mood = {};
    this.mood.S = mood;

  }
}

blogEntries.push(new BlogEntry('no', 'October 18 2020', 6, 'Hangzhou', ["Parsed the remaining data of zone 4 in AA meeting"], true, "negative"));
blogEntries.push(new BlogEntry('yes', 'October 19 2020', 7.5, 'Hangzhou',  ["New component of my commercial project"], true, "positive"));
blogEntries.push(new BlogEntry('yes', 'October 20 2020', 7, 'Hangzhou', ["Designed prototype and documentation of Major Studio 1", "Wrote documentation for data structures class"], true, "positive"));
blogEntries.push(new BlogEntry('yes', 'October 21 2020', 8, 'Hangzhou', ["Made up week5's assignment"], true, "negative"));
blogEntries.push(new BlogEntry('yes', 'October 22 2020', 7, 'Hangzhou', ["Tencent HR interview", "Prepared the mini-lab presentation for Major Studio class"], true, "negative"));
blogEntries.push(new BlogEntry('no', 'October 23 2020', 6, 'Hangzhou', ["Met with ChenShuai for Eurovis Paper co-authored work"], true, "negative"));
blogEntries.push(new BlogEntry('no', 'October 24 2020', 7, 'Linan', ["Succesfully wrote an external configuration file for DS assignment 7", "Succesfully tested to geocode the data in the parsing loop simultaneously"], true, "positive"));
blogEntries.push(new BlogEntry('no', 'October 25 2020', 7, 'Linan', ["Finished the parsing task of assignment 7 and followed up with Lee", "Made up week6's assignment"], false, "neutral"));

const async = require('async');

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();

async.eachSeries(blogEntries, function(entry, callback) {
      
      var params = {};
      params.Item = entry; 
      params.TableName = "blog";
      
      dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(entry);           // successful response
      });
      
      setTimeout(callback, 500); 
  
});