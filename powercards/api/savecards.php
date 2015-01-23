<?php
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

require_once(__DIR__ . '/common/CardUtil.php');
require_once(__DIR__ . '/common/Utility.php');

//Check that valid data was supplied
$name  = Utility::requestVarOrDefault('name', NULL);
$cards = Utility::requestVarOrDefault('cards', NULL);
if (empty($name) || !is_array($cards) || count($cards) == 0)
{
	//Invalid data supplied
	echo json_encode(Array('result' => 'error'));
	exit();
}

//Prepare the JSON data that will be saved to file
$data = json_encode(Array(
	'name'  => $name,
	'cards' => $cards
));

//Determine if the card set already exists
$filename = NULL;
$sets = CardUtil::listCardSets();
foreach ($sets as $set)
{
	if ($set['name'] == $name) {
		$filename = $set['filename'];
	}
}

//If the set doesn't already exist, generate a unique filename
if ($filename === NULL)
{
	$filename = sha1($name);
	while (file_exists(__DIR__ . '/cards/' . $filename)) {
		$filename = sha1($name . microtime());
	}
}

//Write the JSON data to file
file_put_contents(__DIR__ . '/cards/' . $filename, $data);
echo json_encode(Array('result' => 'success'));

?>