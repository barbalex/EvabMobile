/**
 * synchronisiert die Daten aus einer CouchDB in PouchDB
 */

'use strict';

exports.sync = function() {
    var PouchDB = require('pouchdb')
        , db = new PouchDB('evab')
        , configuration = require('./configuration')
        , couchUser = configuration.couch.userName
        , couchPassword = configuration.couch.passWord
        , couchUrl = configuration.couch.dbUrl
        , couchName = configuration.couch.dbName
        , remoteCouch = 'http://' + couchUser + ':' + couchPassword + '@' + couchUrl + '/' + couchName
        ;

    function sync() {
        if (remoteCouch) {
            var opts = {live: true};
            db.replicate.to(remoteCouch, opts, syncError);
            db.replicate.from(remoteCouch, opts, syncError);
        }
    }

    function syncError() {
        console.log('error syncing');
    }

    return sync();
};
