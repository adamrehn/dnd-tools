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

function ServerInteractionManager(cardSource)
{
	this.events = new Observable();
	this.cardSource = cardSource;
	
	//Create the container div and hide it
	this.containerDiv = $(document.createElement('div'));
	this.containerDiv.attr('id', 'serverInteraction');
	this.containerDiv.css('position', 'fixed');
	this.containerDiv.css('top',      '0');
	this.containerDiv.css('left',     '0');
	this.containerDiv.css('width',    '100%');
	this.containerDiv.css('height',   '100%');
	this.containerDiv.hide();
	this.containerDiv.appendTo('body');
	
	//Create the save dialog and hide it
	this.createSaveDialog();
	this.saveDialog.hide();
	
	//Create the load dialog and hide it
	this.createLoadDialog();
	this.loadDialog.hide();
}

//Registers an event listener for when the user requests to load a card set
ServerInteractionManager.prototype.loadRequested = function(listener) {
	this.events.on('loadRequested', listener);
}

//Registers an event listener for when saving a card set to the server succeeds
ServerInteractionManager.prototype.saveSucceeded = function(listener) {
	this.events.on('saveSucceeded', listener);
}

//Registers an event listener for when saving a card set to the server fails
ServerInteractionManager.prototype.saveFailed = function(listener) {
	this.events.on('saveFailed', listener);
}

//Displays the 'save to server' dialog
ServerInteractionManager.prototype.showSaveDialog = function()
{
	//Close the load dialog if it's currently visible
	this.hideLoadDialog();
	
	this.saveDialog.show();
	this.containerDiv.show();
}

//Closes the 'save to server' dialog
ServerInteractionManager.prototype.hideSaveDialog = function()
{
	this.saveDialog.hide();
	this.containerDiv.hide();
}

//Displays the 'load from server' dialog
ServerInteractionManager.prototype.showLoadDialog = function()
{
	//Close the save dialog if it's currently visible
	this.hideSaveDialog();
	
	this.loadDialog.show();
	this.containerDiv.show();
	
	//Load the list of saved card sets from the server
	var that = this;
	$.ajax({
		url:      './api/listcards.php',
		type:     'POST',
		dataType: 'json',
		
		success: function(response)
		{
			//Populate the list of card sets
			that.cardSetList.empty();
			$.each(response, function(index, setName)
			{
				//Create a list item for each card set and register its event handler
				var listItem = $(document.createElement('li'));
				listItem.append( document.createTextNode(setName) );
				listItem.click(function()
				{
					//Load the requested card set and close the 'load' dialog
					that.events.emitEvent('loadRequested', setName);
					that.hideLoadDialog();
				});
				
				//Add the current list item to the list
				that.cardSetList.append(listItem);
			});
		},
		
		error: function(jqXHR, textStatus, errorThrown) {
			alert('Error: failed to load the list of saved card sets from the server!');
		}
	});
}

//Closes the 'load from server' dialog
ServerInteractionManager.prototype.hideLoadDialog = function()
{
	this.loadDialog.hide();
	this.containerDiv.hide();
}

ServerInteractionManager.prototype.createSaveDialog = function()
{
	var that = this;
	
	//Create the dialog div
	this.saveDialog = $(document.createElement('div'));
	
	//Create the paragraph to hold the controls
	var controlsParagraph = $(document.createElement('p'));
	controlsParagraph.append(document.createTextNode('Card set name: '));
	
	//Create the text box for the card set name
	this.saveNameInput = $(document.createElement('input')).attr('type', 'text');
	controlsParagraph.append(this.saveNameInput);
	
	//Create the save button
	var saveButton = $(document.createElement('button'));
	saveButton.append(document.createTextNode('Save to server'));
	saveButton.click(function() { that.performSave(); });
	controlsParagraph.append(saveButton);
	
	//Create the cancel button
	var cancelButton = $(document.createElement('button'));
	cancelButton.append(document.createTextNode('Cancel'));
	cancelButton.click(function() { that.hideSaveDialog(); });
	controlsParagraph.append(cancelButton);
	
	this.saveDialog.append(controlsParagraph);
	this.containerDiv.append(this.saveDialog);
}

ServerInteractionManager.prototype.createLoadDialog = function()
{
	var that = this;
	
	//Create the dialog div
	this.loadDialog = $(document.createElement('div'));
	this.loadDialog.attr('class', 'menu');
	this.loadDialog.append($(document.createElement('p')).text('Choose a card set to load:'));
	
	//Create the card set list container
	this.cardSetList = $(document.createElement('ul'));
	this.loadDialog.append(this.cardSetList);
	
	//Create the cancel button
	var cancelButton = $(document.createElement('button'));
	cancelButton.append(document.createTextNode('Cancel'));
	cancelButton.click(function() { that.hideLoadDialog(); });
	this.loadDialog.append(cancelButton);
	
	this.containerDiv.append(this.loadDialog);
}

ServerInteractionManager.prototype.performSave = function()
{
	//Retrieve the user-supplied name for the set of cards
	var name = this.saveNameInput.val();
	
	//Retrieve the current in-memory set of cards
	var cards = this.cardSource();
	
	//Attempt to perform the save
	var that = this;
	$.ajax({
		url:      './api/savecards.php',
		type:     'POST',
		dataType: 'json',
		data:     { 'name': name, 'cards': cards },
		
		success: function(response)
		{
			//Close the save dialog
			that.hideSaveDialog();
			
			//Determine if the save was successful
			if (response.result == 'success') {
				that.events.emitEvent('saveSucceeded', null);
			}
			else {
				that.events.emitEvent('saveFailed', null);
			}
		},
		
		error: function(jqXHR, textStatus, errorThrown)
		{
			that.hideSaveDialog();
			that.events.emitEvent('saveFailed', null);
		}
	});
}
