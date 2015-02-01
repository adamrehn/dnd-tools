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

function CardDefinitions() {}

//The supported card types
CardDefinitions.types = [
	
	{
		"name":       "atwill",
		"label":      "At-Will",
		"border":     "#6d8b61",
		"background": "#b1c4a9"
	},
	
	{
		"name":       "encounter",
		"label":      "Encounter",
		"border":     "#6b222f",
		"background": "#d2aaaa"
	},
	
	{
		"name":       "daily",
		"label":      "Daily",
		"border":     "#3e3f3f",
		"background": "#ccc"
	},
	
	{
		"name":       "item",
		"label":      "Magic Item",
		"border":     "#ffba00",
		"background": "#ffedca"
	}
	
];

CardDefinitions.getSimplifiedTypes = function()
{
	var simplified = [];
	
	$.each(CardDefinitions.types, function(index, type) {
		simplified.push(type.name);
	});
	
	return simplified;
}

//The supported card fields
CardDefinitions.fields = [
	
	{
		"name":  "power",
		"label": "Power",
		"class": "bold"
	},
	
	{
		"name":  "attack",
		"label": "Attack",
		"class": "",
		"options": [
			"",
			"STR",
			"CON",
			"DEX",
			"INT",
			"WIS",
			"CHA",
		]
	},
	
	{
		"name":  "defence",
		"label": "Defence",
		"class": "",
		"options": [
			"",
			"STR",
			"CON",
			"DEX",
			"INT",
			"WIS",
			"CHA",
			"AC",
			"FORT",
			"REF",
			"WILL"
		]
	},
	
	{
		"name":  "level",
		"label": "Level",
		"class": ""
	},
	
	{
		"name":  "page",
		"label": "Page",
		"class": ""
	},
	
	{
		"name":  "range",
		"label": "Range",
		"class": ""
	},
	
	{
		"name":  "tohit",
		"label": "To-Hit",
		"class": ""
	},
	
	{
		"name":  "damage",
		"label": "Damage",
		"class": ""
	},
	
	{
		"name":  "action",
		"label": "Action",
		"class": "",
		"options": [
			"",
			"Standard",
			"Move",
			"Minor",
			"Free"
		]
	},
	
	{
		"name":  "source",
		"label": "Source",
		"class": ""
	},
	
	{
		"name":  "target",
		"label": "Target",
		"class": ""
	},
	
	{
		"name":  "description",
		"label": "Description",
		"class": "block"
	}
	
];

CardDefinitions.sortCards = function(cards)
{
	//Retrieve the list of simplified card types
	var simplifiedTypes = CardDefinitions.getSimplifiedTypes();
	
	//Sort the cards by type and name
	return cards.sort(function(card1, card2)
	{
		//Determine the indices of the cards' types in the card type list
		var card1TypeIndex = simplifiedTypes.indexOf(card1.type);
		var card2TypeIndex = simplifiedTypes.indexOf(card2.type);
		
		//If the types are different, order by type
		if (card1TypeIndex != card2TypeIndex) {
			return (card1TypeIndex - card2TypeIndex);
		}
		
		//If the types are the same, order by name
		return card1.power.localeCompare(card2.power);
	});
}
