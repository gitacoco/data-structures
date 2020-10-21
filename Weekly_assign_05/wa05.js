var blogEntries = [];

class BlogEntry {
  constructor(classday, date, sleep_duration, screen_time, donelist, exercise, mood) {
    this.classday = {};
    //this.classday.BOOL = classday.toString();
    this.classday.S = classday;
    
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    
    this.sleep_duration ={};
    this.sleep_duration.N = sleep_duration.toString()

    this.screen_time ={};
    this.screen_time.N = screen_time.toString()
    
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

blogEntries.push(new BlogEntry('no', 'October 18 2020', 6, 7, ["Parsed the remaining data of zone 4 in AA meeting"], true, "negative"));
blogEntries.push(new BlogEntry('yes', 'October 19 2020', 7.5, 3, ["New component of my commercial project"], true, "positive"));
blogEntries.push(new BlogEntry('yes', 'October 20 2020', 7, 4.5, ["Designed prototype and documentation of Major Studio 1", "Wrote documentation for data structures class"], true, "positive"));
blogEntries.push(new BlogEntry('yes', 'October 21 2020', 8, 5.3, ["Complete week5's assignment"], true, "negative"));


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