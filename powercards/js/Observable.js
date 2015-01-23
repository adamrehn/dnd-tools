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

function Observable()
{
	this.eventListeners = {};
}

//Registers a new event listener
//[Event listeners are instances of callable that take a single argument]
Observable.prototype.on = function(eventName, listener)
{
	//We maintain a list of listeners for each event
	if (this.eventListeners[eventName] === undefined) {
		this.eventListeners[eventName] = [];
	}
	
	this.eventListeners[eventName].push(listener);
}

Observable.prototype.emitEvent = function(eventName, eventData)
{
	if (this.eventListeners[eventName] !== undefined)
	{
		for (var listenerIndex = 0; listenerIndex < this.eventListeners[eventName].length; ++listenerIndex) {
			this.eventListeners[eventName][listenerIndex](((eventData === undefined) ? {} : eventData));
		}
	}
}
