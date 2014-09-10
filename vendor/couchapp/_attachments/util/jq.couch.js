/**
 * bereitet jquery.couch.js auf, damit es in node.js benutzt werden kann
 */

var fs = require('fs'),
    $ = {};

// Read and eval library
filedata = fs.readFileSync('./jquery.couch.js','utf8');
eval(filedata);

/* The jquery.couch.js file defines a class '$.couch' which is all we want to export */

exports.couch = $.couch;