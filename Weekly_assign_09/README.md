# Weekly Assignment 8 & 9

## My Photon
I accommodate my photon at a corner with an uninterruptible USB-A power with my robot vacuum. And an additional surprise I found was that even if my laptop is connecting to the 5G channel while my photon is connecting to 2.4G, they communicate perfectly.

![img](./myPhoton.jpeg)

## Data Capturing
I plan to collect two variables: Temperature and Humidity. I wrote nested requests to query the data from the particle API, 
```js
var getAndWriteData = function() {

    request(tempC_url, function(error, response, body1) {
        var tem = JSON.parse(body1).result;
        
        request(Humid_url, function(error, response, body2) {
            var hum = JSON.parse(body2).result;
            console.log(tem, hum);
        });
    });
};
```
I printed the results in console. And it looks great:
![img](./console1.png)

## Data Inserting
However, when I was trying to insert the data to PostgreSQL, errors happened. That looks like a promise problem. I tried to use the .catch(), but I couldn't figure it out. I don't want to give up on the humidity, so I left it here tentatively.

```console
ec2-user:~/environment $ node insert_week9.js
23.799999237060547 48.20000076293945
INSERT INTO sensorData VALUES (23.799999237060547, 48.20000076293945, DEFAULT);
(node:10401) UnhandledPromiseRejectionWarning: Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1107:14)
(node:10401) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:10401) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
Error: Connection terminated unexpectedly
    at Connection.con.once (/home/ec2-user/node_modules/pg/lib/client.js:123:73)
    at Object.onceWrapper (events.js:286:20)
    at Connection.emit (events.js:198:13)
    at Socket.<anonymous> (/home/ec2-user/node_modules/pg/lib/connection.js:58:12)
    at Socket.emit (events.js:198:13)
    at TCP._handle.close (net.js:607:12) undefined
```