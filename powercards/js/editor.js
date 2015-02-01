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

//Retrieves the current in-memory set of cards
function getCurrentCards(sort)
{
	//Retrieve the current set of cards
	var json = $('input[name="cards"]').val();
	var cards = ((json.length > 0) ? $.parseJSON(json) : []);
	
	//If requested, sort by type and name
	if (sort === true) {
		cards = CardDefinitions.sortCards(cards);
	}
	
	return cards;
}

//Loads a new set of cards, replacing any existing set
function loadCardSet(cards)
{
	//Create the list of fields
	var fields = [{
		"name": "type",
		"type": "dropdown",
		"preText": "Type: ",
		"dropDownValues": [
			{'name': 'At-Will',    'value': 'atwill'},
			{'name': 'Encounter',  'value': 'encounter'},
			{'name': 'Daily',      'value': 'daily'},
			{'name': 'Magic Item', 'value': 'item'}
		]
	}];
	
	//Populate the list of fields with our card field definitions
	$.each(CardDefinitions.fields, function(index, field)
	{
		//Determine if the field is a text field or a dropdown
		var dropdownOptions = null;
		var fieldType = ((field.class == "block") ? "textarea" : "text");
		if (field.options !== undefined && field.options.length > 0)
		{
			//Process the list of possible values
			fieldType = "dropdown";
			dropdownOptions = [];
			$.each(field.options, function(index, value) {
				dropdownOptions.push({"name":value, "value":value});
			});
		}
		
		fields.push({
			"name": field.name,
			"type": fieldType,
			"preText": field.label + ": ",
			"dropDownValues": dropdownOptions
		});
	});
	
	//Build the editing interface
	$('#cards').empty();
	window.builder = new TableMultiListBuilder('cards', $('#cards'), fields, cards);
}

$(document).ready(function()
{
	//Create a server interaction manager instance
	window.server = new ServerInteractionManager(getCurrentCards);
	
	//When a load operation has been requested by the user, perform it
	window.server.loadRequested(function(setName) {
		window.loader.loadFromServer(setName);
	});
	
	//When a save operation to the server has completed, inform the user
	window.server.saveSucceeded(function() { alert('Card set saved to server.'); });
	window.server.saveFailed(function() { alert('Error: failed to save card set to server!'); });
	
	//Create a card loader and bind it to the file input element
	window.loader = new CardLoader();
	loader.bindToFileInput( $('#importFile').get(0) );
	
	//When a card set has been loaded, display it
	loader.loaded(function(cards) {
		loadCardSet(cards);
	});
	
	//If an error occurs when attempting to load cards, inform the user
	loader.error(function() {
		alert('Error: failed to load cards!');
	});
	
	//Wire up the event handler for the "Create New" button
	$('#new').click(function() {
		loadCardSet(undefined);
	});
	
	//Wire up the event handler for the "Export to JSON" button
	$('#export').mouseover(function()
	{
		//Generate the data URI
		var data = getCurrentCards(true);
		var formattedJson = JSON.stringify(data, true, 1);
		var dataURI = 'data:text/javascript;base64,' + btoa(formattedJson);
		
		//Create the hyperlink
		var link = $(document.createElement('a'));
		link.attr('href', dataURI);
		link.attr('target', '_blank');
		
		//Wrap the export button in the hyperlink, removing any existing hyperlink
		$('#export').before(link);
		link.append( $('#export').detach() );
		var oldLink = link.parent();
		if (oldLink.is('a') === true)
		{
			oldLink.before( link.detach() );
			oldLink.remove();
		}
	});
	
	//Wire up the event handler for the "Import from JSON" button
	$('#import').click(function()
	{
		//Dispatch a click event to the file input element
		Utility.dispatchClickEvent('importFile');
	});
	
	//Wire up the event handler for the "Save to Server" button
	$('#save').click(function() {
		window.server.showSaveDialog();
	});
	
	//Wire up the event handler for the "Load from server" button
	$('#load').click(function() {
		window.server.showLoadDialog();
	});
	
	//Load a blank card set when the editor loads
	loadCardSet(undefined);
});
