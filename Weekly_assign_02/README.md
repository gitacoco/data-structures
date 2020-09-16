# Background

[Detailed Requirements](https://github.com/gitacoco/data-structures/blob/master/weekly_assignment_02.md)
This week we're going to extract the AA meeting addresses in the street level from one of the files we collected last week. It's not difficult for us to narrow down to the <td> tag through Cheerio.js, but after parsing through the raw text, there are some challenges…

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
```
* **Challenge1** Besides the <td> elements that contain the address, there are other unnecessary ones.
* **Challenge2** The address **303 West 42nd Street** is not inside the <td> tags and not enclosed in any tag. 
* **Challenge3** The address is followed by a lower-level address, such as a room number, which is not what we want.

# Process
## Programming Alternative
- Regular Expression

```javascript

```

# Reference
* [String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
* [CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.asp)
* [jQuery text() Method](https://www.w3schools.com/jquery/html_text.asp)
