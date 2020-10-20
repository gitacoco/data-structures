# Weekly Assignment 7

Finish parsing and cleaning the rest of the data in "zone 4" and all other zones, and update/replace my PostgreSQL table(s) with the new data. This would include **all the data** I may need for the final map in Final Assignment 1.

## Workflow

### Step 1 Parsing the HTML File

In Weekly Assignment 2, I parsed limited addresses data in Zone 4 of AA meetings. In this step, I will parse the rest of the data in [4.txt](/Weekly_assign_01/data/4.txt).

#### Examining the HTML Structure
```HTML
<table>
    <table>
        <table>
            <tbody>
                <tr>
                    <td>location data</td>
                    <td>time, type and interest information</td>
                    <td>meeting id</td>
                </tr>

                <tr>
                    <td>location data</td>
                    <td>time, type and interest information</td>
                    <td>meeting id</td>
                </tr>
                ……

            </tbody>
        </table>
    </table>
</table>
```
#### Determining the Data Model

I continue to use the data model that I created in [weekly assignment 4](https://github.com/gitacoco/data-structures/tree/master/Weekly_assign_04). So there will be two tables: `Location List` and `Time List`. And we can rely on the composite key to extract meeting information efficiently.

#### Parsing the file

The code please refer to [wa07_Parse.js](https://github.com/gitacoco/data-structures/blob/master/Weekly_assign_07/wa07_Parse.js). The basic workflow: 
1. I defined two parallel arrays: `var locationList = [];` and `var timeList = [];`
2. Navigate to our target HTML tags. **There is a hateful pitfall here!** When I was examining the HTML file, I found there is only one pair of `<tbody></tbody>` tag. So I wrote `$('tbody tr')` in the selector. When I finished my code, it did not work at all. I started the tough voyage of debugging. I printed each step reversely, finally found the problems is from this step. **There are two pairs of invisible `<tbody></tbody>`. This would be elaborated in the last part of this documentation.
3. Run an each function to parse the address data.
4. Run an nested each function to parse the time data.

#### Outcome of Zone 4
Here comes the results from my console:

1. **the location table example**

```JS
{ meetingID: '302',
    streetAddress: '484 West 43rd Street',
    buildingName: 'Manhattan Plaza Health Club',
    roomFloor: '1st Floor',
    city: 'New York',
    state: 'NY',
    zipCode: '10036',
    detailsBox: 'Fri=Living Sober, Sat=Promises',
    wheelChair: true },
```

2. **the time table with type and special interest information example**

Meeting ID here is the foreign key of the time table. And there would be a new attribute, which would be generated automatically in database management systems, assigned for each time item as a primary key.
```JS
  { meetingID: '62',
    day: 'Mondays',
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    meetingType: 'Closed Discussion meeting',
    specialInterest: 'N/A' },
  { meetingID: '62',
    day: 'Wednesdays',
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    meetingType: 'Closed Discussion meeting',
    specialInterest: 'N/A' },
  { meetingID: '62',
    day: 'Fridays',
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    meetingType: 'Closed Discussion meeting',
    specialInterest: 'N/A' },
```

#### Teamwork: Other Zones Together

I contributed the code [wa07_Parse.js](https://github.com/gitacoco/data-structures/blob/master/Weekly_assign_07/wa07_Parse.js) as the base code. So far so good, and this code works for my zone, but may not for each zone. [Lee Kuczewski](https://github.com/leeallennyc/data-structures-fall-2020/tree/master/week7) then did a lot adaptation work and built massive exceptions, especially for the address data, to ensure the code could work for all other zones. The whole data he parsed please refer to [Lee's repository](https://github.com/leeallennyc/data-structures-fall-2020/tree/master/week7/data).

#### External Reference Library for Exceptions

To avoid excessive exceptions in the JavasScript file, we could establish an external reference library through JSON format. This could strip rules from JS code. And then the readability of the JS file and the maintainability of the rules will be better. (This is a strategy for optimization with a low priority)

Example Code:
```JS
  var west = ["W.", "W", "WEST"]
  var string = "W. Street"
  var string_list = string.split(" ")
  if (west.indexOf(string_list[0]) >=0)
    string_list[0] = "west"
```

#### Some Thoughts on the Exceptions and Data Integrity

What is the border of data cleaning? What is the bottom line of data integrity? Do we have to standardize all the data in a UGC meeting information sharing platform (I assume AA Meeting is UGC)?

Take Google Calendar as an example, anyone could invite me to join an event. Let's take a closer look at the event-creating panel. 
1. The **meeting name** is totally written by users. 
2. The **time** is determined by users in limited freedom. You cannot type something. The only thing you can do is to pick a day and/or a time slot in their ‘prefabricated components’.
3. For the **address** information, the blank(you need to fill in) is an input box as well as a search engine. They have features like computer-assisted address association and map-based localization to help your data in good order. However, if you just want to input something in a mess, they won't interfere you.

I think the ranking of freedom of these three information input mechanisms is 1>3>2, and the level of data consistency tends to be 2>3>1. Apparently, the strategies towards the management of different data types should depend on something(I have no idea so far). At least, more strict does not necessarily mean better. This is supposed to be case by case.

### Step 2 Geocoding the Data (under construction, won't be delivered before week8's class )

### Step 3 Populate the Database (under construction, won't be delivered before week8's class )

### Debugging and Lesson Learned (under construction, won't be delivered before week8's class )