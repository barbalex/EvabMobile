/**
 * Das Modell für einfache Beobachtungen
 */

'use strict';

var _ = require('underscore')
    , Backbone = require('backbone')
    , PouchDB = require('pouchdb')
    , Boxspring = require('boxspring')
    , configuration = require('./configuration')
    , couchUser = configuration.couch.userName
    , couchPassword = configuration.couch.passWord
    ;

console.log('username', username);

var evabDbMaker = Backbone.Boxspring.Model.extend({
    'defaults': {
        '_db_name': 'evab'
        , '_design': '_design/evab'
        , '_maker': ddoc
        , '_auth': {
            'name': couchUser,
            'password': couchPassword
        }
    }
});

module.exports = BeobEinfach;