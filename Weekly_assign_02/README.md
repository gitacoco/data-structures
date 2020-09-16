# Background

This week we're going to extract the AA meeting adresses in street level from one of the files we collected last week. 

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

However, after parsing through the raw text, we could find that the address **303 West 42nd Street** is not inside the td element and not enclosed in any tag. And even worse, the address is followed by a more specific address, such as a room number, which is not what we want.

[Detailed Requirements](https://github.com/gitacoco/data-structures/blob/master/weekly_assignment_02.md)

# Process

```javascript

```

# Reference
* [String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
* [CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.asp)
* [jQuery text() Method](https://www.w3schools.com/jquery/html_text.asp)
