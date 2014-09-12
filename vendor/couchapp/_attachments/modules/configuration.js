/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

'use strict';

var config = {}
    , couch_passfile = require('../../../../couchpass.json')
    ;

config.couch = {};
config.couch.dbUrl = '127.0.0.1:5984';
config.couch.dbName = 'evab';
config.couch.userName = couch_passfile.user;
config.couch.passWord = couch_passfile.pass;

module.exports = config;