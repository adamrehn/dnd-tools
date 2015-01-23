D&D Power Card Manager
======================

The Power Card manager is a simple browser-based utility for editing and viewing Power Cards, which are useful for keeping track of a character's skills and abilities when playing [Dungeons and Dragons](http://dnd.wizards.com/).

Most functionality is implemented purely in client-side Javascript, allowing the manager to be used with JSON files on the local filesystem without needing to run a web server. **A server that supports PHP is required in order to save card sets to the server and load them from the server.**

A number of UI features require technologies implemented only in modern web browsers. **Internet Explorer 9 and older are not supported, and JSON export from the card editor is not supported under any version of Internet Explorer** (due to security restrictions on data URIs in IE.)
