/**
 * stellt Methoden zur Verfügung, um mit der Couch zu Kommunizieren
 *
 */

'use strict';

var $ = require('jquery'),
    couch = require('./util/jq.couch.js');

$.extend($, couch);

var $db = $.couch.db("evab");

module.exports = function() {
    return $;
};