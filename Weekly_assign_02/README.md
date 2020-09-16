# A Quick Glance of the Final Code

```javascript
// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/4.txt');                      // load the 4.txt file into a variable, `content`
var $ = cheerio.load(content);                                    // load `content` into a cheerio object
var addressList = '';                                           

$('td[style="border-bottom:1px solid #e3e3e3; width:260px"] b')   // Use CSS selector to select all td with a specific tyle and element
    .each(function(i, elem){
    addressList += $(elem.nextSibling.nextSibling).text()              // Use .nextSibling method to re-navigate to a new object
                                                  .split(',')[0]       // Split it and only keep the first object
                                                  .split(/-|Rm/)[0]    // Deal with the outlier
                                                  .trim() + '\n'       // Remove spaces and make the variable hold the lines
});
   
fs.writeFileSync('data/addressList.txt', addressList);            // Write all the addresses to a text file
```

# Background

[Detailed Requirements](https://github.com/gitacoco/data-structures/blob/master/weekly_assignment_02.md)
This week we're going to extract the AA meeting addresses at a street level from one of the files we collected last week. It's not difficult to narrow down to the `<td>` tag through Cheerio.js. But after parsing through the raw text, the challenges were unlocked…

```html
<tr style="margin-bottom:10px">
                    <td style="border-bottom:1px solid #e3e3e3; width:260px" valign="top">
                    	<h4 style="margin:0;padding:0;"></h4><br />
				  	    <b>ALANON HOUSE   (AA Meetings Only) - </b><br />
						303 West 42nd Street, 3rd Floor, Room #306, 
						<br />(@ Corner of 8th Avenue) 10036
						<br />
						<br />
                        
                        <div class="detailsBox"> 
                        	Sun.2pm=Women's Meeting 
                        </div>
	            </td>
	
                    <td style="border-bottom:1px solid #e3e3e3;width:350px;" valign="top">
                   	 	
				  	    <b>Saturdays From</b>  3:00 PM <b>to</b> 4:00 PM <br /><b>Meeting Type</b> OD = Open Discussion meeting 
			 			<br />
                    	<br />
                    		
					</td> 
                    <td style="border-bottom:1px solid #dedede; width:90px; ">
                    	<a href="getdirections.cfm?meetingid=49" class="GetDirections">Get Directions</a>
                    </td>
                  </tr>
```
* **Challenge 1** Besides the `<td>` elements that contain the address, there are other unnecessary ones.
* **Challenge 2** The address **303 West 42nd Street** is not inside the `<td>` tags and not enclosed in any tag. 
* **Challenge 3** The address is followed by a lower-level address, such as a room number, which is not what we want.

# Process and Code Alternatives
First of all, we need to shake off the second burdensome `<td>` element. Although they have no class attribute, we can differentiate them by style values. Cheerio has a same `.attr()` method as JQuery, so I used 
```javascript
	if($(elem).attr("style")==="border-bottom:1px solid #e3e3e3; width:260px") 
```

However, this is a zigzag way. I want to make it more concise: to select one element with a certain style, just like Intersection (A ∩ B) in mathematics rather than a conditional statement. So then I went to:
```javascript
	$('td[style="border-bottom:1px solid #e3e3e3; width:260px"]')
```

And next, I was starting to extract the text we need. To start with, I used `.html()` method to return the whole DOM content of the first macthed element. And then I `split()` again and again. 
```javascript
$('td[style="border-bottom:1px solid #e3e3e3; width:260px"]').each(function(i, elem){
  addressList += ($(elem).html().split('<br>')[2].split(',')[0].split(' - ')[0].split(' Rm ')[0]).trim() + '\n';
  });
```
At this time, I questioned the maintainability of my code. A series of `split()` did solve the problem, but maybe several days later I would forget why I coded this way. I was thinking of using **Regular Expression**. I believe this would be an elegant way, but may not be concise enough, so I eliminate it. By analyzing these split(), I found that they were supporting for different purposes. 
* The first `split()` is to split, of course, and to remove <br> tags. Actually, we just want the text rather than the HTML tags. So why don't we use `.text()` directly? To achieve this, the navigation need to be more accurate. Look at the html structure, there is a sole `<b></b>` that is like an anchor. We can select this element first and then move to our "true lover".
* The second `split()` is to remove the comma and all other text(lower-level addressess) behind it, which applies to most of the cases.
* The last two `split()` is to deal with the outlier, which could be mergered.

So the final solution is:
```javascript
$('td[style="border-bottom:1px solid #e3e3e3; width:260px"] b').each(function(i, elem){
  addressList += $(elem.nextSibling.nextSibling).text().split(/,|-|Rm/)[0].trim() + '\n'
});
```

# Reference
* [String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
* [CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.asp)
* [jQuery text() Method](https://www.w3schools.com/jquery/html_text.asp)
