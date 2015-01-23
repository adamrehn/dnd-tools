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

function CardLoader()
{
	this.events = new Observable();
}

//Registers an event handler for when data has been loaded
CardLoader.prototype.loaded = function(listener) {
	this.events.on('loaded', listener);
}

//Registers an event handler for when an error occurs
CardLoader.prototype.error = function(listener) {
	this.events.on('error', listener);
}

//Registers an on-change event listener for a file input element
//Subsequently, we will load any file that is selected
CardLoader.prototype.bindToFileInput = function(fileInputElem)
{
	var that = this;
	fileInputElem.addEventListener('change', function() {
		that.loadFromFile(fileInputElem);
	});
}

//Loads data from a local file upload
CardLoader.prototype.loadFromFile = function(fileInputElem)
{
	//Create an file-based data loader
	var loader = new FileDataLoader();
	
	//When the data has loaded, process it as JSON
	var that = this;
	loader.loaded(function(data) {
		that.loadJsonData(data);
	});
	
	//Load the requested file
	loader.load(fileInputElem);
}

//Loads data from the server, using an Ajax request
CardLoader.prototype.loadFromServer = function(setName)
{
	//Attempt to retrieve the specified card set from the server
	var that = this;
	$.ajax({
		url:      './api/getcards.php',
		type:     'POST',
		dataType: 'text',
		data:     { 'name': setName },
		
		success: function(response) {
			that.loadJsonData(response);
		},
		
		error: function(jqXHR, textStatus, errorThrown) {
			that.events.emitEvent('error', null);
		}
	});
}

CardLoader.prototype.loadJsonData = function(jsonData)
{
	//Attempt to parse the supplied data as JSON
	try
	{
		var cards = $.parseJSON(jsonData);
		this.events.emitEvent('loaded', cards);
	}
	catch(e)
	{
		//Failed to parse the data as JSON
		this.events.emitEvent('error', null);
	}
}
