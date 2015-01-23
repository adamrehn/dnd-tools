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

function TableMultiListBuilder(listName, containerElem, fields, initialRows, customUpdateHandler)
{
	/*
		Fields looks like this:
		
		fields = [{
			name: "fieldName", //Used when the list contains multiple fields, unused when there's a single field
			type: "dropdown",  //Dropdown / text / textarea
			dropDownValues: [
				{'name': 'see this in the dropdown', 'value': 'see this in the result'}
			],
			preText:  "optional, goes before the input",
			postText: "optional, goes after the input"
		}];
	*/
	
	this.listName            = listName;
	this.containerElem       = $(containerElem);
	this.fields              = fields;
	this.initialRows         = initialRows;
	this.customUpdateHandler = customUpdateHandler;
	
	this.build();
}

TableMultiListBuilder.prototype.build = function()
{
	//Create the hidden form field to hold the final list result
	this.outputFormField = $(document.createElement('input')).attr('type', 'hidden');
	this.outputFormField.attr('name', this.listName);
	this.containerElem.append(this.outputFormField);
	
	//Build the table
	this.table = $(document.createElement('table')).attr('class', 'multiList');
	this.tbody = $(document.createElement('tbody'));
	
	//Generate the callbacks for updating field values and adding rows to the table
	var that = this;
	this.updateFieldFunc = function() { that.update();               };
	this.addRowFunc      = function() { that.addRow(); return false; };
	
	//Generate the 'add row' button
	var addButton = $(document.createElement('button')).text('+');
	addButton.click(this.addRowFunc);
	
	//Generate the 'add row' button's surrounding row
	var addButtonCell = $(document.createElement('td')).attr('colspan', 2);
	var addButtonRow  = $(document.createElement('tr'));
	addButtonCell.append(addButton);
	addButtonRow.append(addButtonCell);
	this.tbody.append(addButtonRow);
	
	//Generate the initial rows, if supplied
	if (this.initialRows !== undefined && this.initialRows !== null && this.initialRows.length > 0)
	{
		//Build each initial row
		for (var i = 0; i < this.initialRows.length; ++i) {
			this.addRow( this.initialRows[i] );
		}
	}
	
	//Add the table to the container element
	this.table.append(this.tbody);
	this.containerElem.append(this.table);
}

TableMultiListBuilder.prototype.update = function()
{
	//Iterate over the rows in the table and build the list of values
	var values = [];
	var that = this;
	var rows = $('> tr', this.tbody);
	rows.each(function(index, row)
	{
		//Determine if we are processing a single field or multiple fields
		var singleField = (that.fields.length === 1);
		
		//When processing a single field, the resultant row value will be a scalar, otherwise it will be a list
		var rowValue = ((singleField === true) ? null : {});
		
		//Iterate over the input elements in the current row
		var inputElems = $('input, select, textarea', row);
		inputElems.each(function(index, inputElem)
		{
			//Retrieve the name and value of the input field
			var fieldName  = $(inputElem).attr('fieldName');
			var fieldValue = $(inputElem).val();
			
			//If we're processing a single field, store the raw value, otherwise store the name/value pair
			if (singleField === true) {
				rowValue = fieldValue;
			}
			else {
				rowValue[ fieldName ] = fieldValue;
			}
		});
		
		//Add the row value to the overall list
		if (rowValue != null && Object.keys(rowValue).length > 0) {
			values.push(rowValue);
		}
	});
	
	//Update the form field
	this.outputFormField.val( JSON.stringify(values) );
	
	//If a custom update handler has been provided, invoke it
	if (this.customUpdateHandler !== undefined) {
		this.customUpdateHandler(this);
	}
}

TableMultiListBuilder.prototype.addRow = function(initialValue)
{
	var that = this;
	
	//Determine if we are processing a single field or multiple fields
	var singleField = (this.fields.length === 1);
	
	//Create the table row and the two cells
	var row          = $(document.createElement('tr'));
	var contentsCell = $(document.createElement('td'));
	var buttonCell   = $(document.createElement('td'));
	
	//Create the 'remove row' button
	var button = $(document.createElement('button')).text('-');
	buttonCell.append(button);
	button.click(function()
	{
		row.remove();
		that.update();
		return false;
	});
	
	//Create the nested table
	var nestedTable = $(document.createElement('table'));
	var nestedTbody = $(document.createElement('tbody'));
	nestedTable.append(nestedTbody);
	
	//Iterate over our list of fields
	$.each(this.fields, function(index, field)
	{
		//Create the row in the nested table, and the three cells
		var currentRow   = $(document.createElement('tr'));
		var preTextCell  = $(document.createElement('td'));
		var controlsCell = $(document.createElement('td'));
		var postTextCell = $(document.createElement('td'));
		
		//Determine if an initial value was provided
		var fieldValue = null;
		if (initialValue !== undefined) {
			fieldValue = ((singleField === true) ? initialValue : initialValue[ field.name ]);
		}
		
		//Add the field's pre-text, if specified
		if (field.preText !== undefined) {
			preTextCell.append( document.createTextNode(field.preText) );
		}
		
		//Determine the type of the current field
		if (field.type == "text")
		{
			//Create a text input
			var textField = $(document.createElement('input'));
			textField.attr('type', 'text');
			textField.attr('fieldName', field.name);
			
			//If an initial value was provided, use it
			if (fieldValue !== null) {
				textField.val(fieldValue);
			}
			
			//Add the event listeners for when the input's value is changed
			textField.change(that.updateFieldFunc);
			textField.keyup(that.updateFieldFunc);
			
			//Add the input to the row's main table cell
			controlsCell.append(textField);
		}
		else if (field.type == "textarea")
		{
			//Create a textarea
			var textareaField = $(document.createElement('textarea'));
			textareaField.attr('fieldName', field.name);
			
			//If an initial value was provided, use it
			if (fieldValue !== null) {
				textareaField.val(fieldValue);
			}
			
			//Add the event listeners for when the input's value is changed
			textareaField.change(that.updateFieldFunc);
			textareaField.keyup(that.updateFieldFunc);
			
			//Add the input to the row's main table cell
			controlsCell.append(textareaField);
		}
		else if (field.type == "dropdown")
		{
			//Create a dropdown input
			var dropdown = $(document.createElement('select'));
			dropdown.attr('fieldName', field.name);
			
			//Iterate over the list of values to build the the dropdown contents
			$.each(field.dropDownValues, function(index, nameAndValue)
			{
				//Create each dropdown item
				var option = $(document.createElement('option'));
				option.attr('value', nameAndValue.value);
				option.text(nameAndValue.name);
				
				//If the option is the initial value, select it
				if (fieldValue !== null && nameAndValue.value == fieldValue) {
					option.attr('selected', 'selected');
				}
				
				//Add the item to the dropdown
				dropdown.append(option);
			});
			
			//Add the event listener for when the input's value is changed
			dropdown.change(that.updateFieldFunc);
			
			//Add the input to the row's main table cell
			controlsCell.append(dropdown);
		}
		else
		{
			//Unsupported field type detected
			var error = "Unsupported field type: \"" + field.type + "\"";
			alert(error);
			throw error;
		}
		
		//Add the field's post-text, if specified
		if (field.postText !== undefined) {
			postTextCell.append( document.createTextNode(field.postText) );
		}
		
		//Append the current row to the nested table
		currentRow.append(preTextCell);
		currentRow.append(controlsCell);
		currentRow.append(postTextCell);
		nestedTbody.append(currentRow);
	});
	
	//Add the cells to the row, and the row to the table
	contentsCell.append(nestedTable);
	row.append(contentsCell);
	row.append(buttonCell);
	this.tbody.children().last().before(row);
	
	//Update the form field to include the newly generated row
	this.update();
}
