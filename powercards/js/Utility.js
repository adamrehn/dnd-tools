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

function Utility() {}

Utility.dispatchClickEvent = function(elementID)
{
	if (MouseEvent !== undefined)
	{
		//Create a click event
		var event = null;
		try
		{
			//If supported, use the MouseEvent constructor
			event = new MouseEvent('click', {
				'view':       window,
				'bubbles':    false,
				'cancelable': true
			});
		}
		catch (e)
		{
			//If the MouseEvent constructor is not supported, fall back to createEvent() and initMouseEvent()
			event = document.createEvent("MouseEvents");
			event.initMouseEvent("click", false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		}
		
		//Dispatch the click event to the specified element
		var elem = document.getElementById(elementID); 
		elem.dispatchEvent(event);
	}
	else
	{
		//Use the raw click() method
		var elem = document.getElementById(elementID); 
		elem.click();
	}
}
