/**
 * synchronisiert die Daten aus einer CouchDB in PouchDB
 */

'use strict';

exports.sync = function() {
    var PouchDB = require('pouchdb'),
        db = new PouchDB('ab'),
        remoteCouch = 'http://barbalex:dLhdMg12@127.0.0.1:5984/evab';

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
