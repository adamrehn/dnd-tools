/*
//  D&D Power Card Manager
//  Copyright (c) 2015, Adam Rehn
//  
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//  
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//  
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
*/

function CardRenderer() {}

//Generates a div to display a card
CardRenderer.generateCardDiv = function(card)
{
	//Create the div for the card
	var cardDiv = $(document.createElement('div')).attr('class', 'card ' + card.type);
	
	//Iterate over the list of fields
	$.each(CardDefinitions.fields, function(index, field)
	{
		//Determine if the card has a value for the current field
		var value = card[field.name];
		if (value !== null && value !== undefined && value.length > 0)
		{
			//Create a div for the field
			var fieldDiv = $(document.createElement('div')).attr('class', 'field ' + field.class);
			
			//Create paragraphs for the label and value
			var labelParagraph = $(document.createElement('p')).attr('class', 'label').text(field.label);
			var valueParagraph = $(document.createElement('p')).attr('class', 'value');
			valueParagraph.html( marked(value) );
			
			//Append the created elements to their parent containers
			fieldDiv.append(labelParagraph);
			fieldDiv.append(valueParagraph);
			cardDiv.append(fieldDiv);
		}
	});
	
	//For encounter and daily powers, enable toggling on click
	if (card.type != "atwill") {
		cardDiv.click(function() { cardDiv.toggleClass("used"); });
	}
	
	//Return the generated div
	return cardDiv;
}
