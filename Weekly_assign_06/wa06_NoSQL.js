// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "blog",
    KeyConditionExpression: "classday = :classday AND #dt = :filterDate", // the query expression  
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#dt" : "date"
    },
    ExpressionAttributeValues: { // the query values
        ":classday": {S: "no"},
        ":filterDate": {S: "Sun Oct 18 2020"},
        //":maxDate": {S: "2020-10-25"}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});