var fs = require('fs');

//////////////////////
// To Merge Location Data
//////////////////////

var location_file_path = './week7/parsed_location_data/'
var location_file_list = fs.readdirSync(location_file_path)

var merged_location_file = [];

location_file_list.forEach(function(file_name){
    var eachFile = location_file_path + file_name
    var data = JSON.parse(fs.readFileSync(eachFile));
    merged_location_file = merged_location_file.concat(data);
})

fs.writeFileSync('./week7/merged_data/location_merged.json', JSON.stringify(merged_location_file));
console.log('location data successfully merged')

//////////////////////
// To Merge Time Data
//////////////////////

var time_file_path = './week7/parsed_time_data/'
var time_file_list = fs.readdirSync(time_file_path)

var merged_file = [];

time_file_list.forEach(function(file_name){
    var eachFile = time_file_path + file_name
    var data = JSON.parse(fs.readFileSync(eachFile));
    merged_file = merged_file.concat(data);
})

fs.writeFileSync('./week7/merged_data/time_merged.json', JSON.stringify(merged_file));
console.log('time data successfully merged')