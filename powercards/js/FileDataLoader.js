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

function FileDataLoader()
{
	this.events = new Observable();
}

FileDataLoader.prototype.loaded = function(listener) {
	this.events.on('loaded', listener);
}

FileDataLoader.prototype.getLastFilename = function() {
	return this.lastFilename;
}

FileDataLoader.prototype.load = function(fileInputElem)
{
	if (fileInputElem.files !== undefined && fileInputElem.files.length > 0)
	{
		//Retrieve the first file in the FileList
		var file = fileInputElem.files[0];
		this.lastFilename = file.name;
		
		//Create a FileReader to read the file contents
		var that = this;
		var reader = new FileReader();
		reader.onload = function() {
			that.dataLoaded(reader.result);
		};
		
		//Read the file
		reader.readAsBinaryString(file);
	}
}

FileDataLoader.prototype.dataLoaded = function(data) {
	this.events.emitEvent('loaded', data);
}
