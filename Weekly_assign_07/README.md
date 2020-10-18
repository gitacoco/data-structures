# Weekly Assignment 7

Finish parsing and cleaning the rest of the data in "zone 4" and all other zones, and update/replace my PostgreSQL table(s) with the new data. This would include **all the data** I may need for the final map in Final Assignment 1.

## Step 1 [Finished]

In Weekly Assignment 2, I parsed limited addresses data in Zone 4 of AA meetings. In this step, I will parse the rest of the data in [4.txt](/Weekly_assign_01/data/4.txt).

### HTML Structure
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

### Parse the file
Needs to be elaborated. Still under construction …

### Outcome
Here comes the results from my consule:
1. the location table example

```JS
  { meetingID: '62',
    streetAddress: '139 West 31st Street',
    buildingName: 'St. Francis of Assisi Education Center',
    roomFloor: '3rd Floor',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    detailsBox: 'No Meeting on Legal Holidays All meetings are non-smoking.' },
```

2. the time table with type and special interest information example

```JS
  { meetingID: '62',
    streetAddress: '139 West 31st Street',
    buildingName: 'St. Francis of Assisi Education Center',
    roomFloor: '3rd Floor',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    detailsBox: 'No Meeting on Legal Holidays All meetings are non-smoking.' },
```

## Step 2 Geocode the data

## Step 3 Replace the table

## Step 4 Other zones together
